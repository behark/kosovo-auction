import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import CompanyProfile from '@/lib/db/models/company-profile';

// This endpoint handles the document uploads for verification
export async function POST(req: NextRequest) {
  try {
    // Only allow authenticated users
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const formData = await req.formData();
    const userId = session.user.id;
    const documentType = formData.get('documentType') as string;
    const documentFile = formData.get('document') as File;
    
    if (!documentType || !documentFile) {
      return NextResponse.json(
        { error: 'Missing document type or file' },
        { status: 400 }
      );
    }

    // In a real implementation, we'd upload the file to cloud storage (S3, etc.)
    // and store the URL. For this demo, we'll simulate this process.
    const documentUrl = `https://storage.bidvista.com/verification/${userId}/${Date.now()}-${documentFile.name}`;
    
    // Find the user and update their verification documents
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Add document to verification documents array
    if (!user.verificationDocuments) {
      user.verificationDocuments = [];
    }
    
    user.verificationDocuments.push(documentUrl);
    
    // Update specific fields based on document type
    if (documentType === 'business_license') {
      user.businessLicense = documentUrl;
    }
    
    await user.save();
    
    // If company profile exists, update it as well
    if (user.companyProfile) {
      const companyProfile = await CompanyProfile.findById(user.companyProfile);
      
      if (companyProfile) {
        if (!companyProfile.verifiedDocuments) {
          companyProfile.verifiedDocuments = [];
        }
        
        companyProfile.verifiedDocuments.push(documentUrl);
        await companyProfile.save();
      }
    }
    
    return NextResponse.json({
      message: 'Document uploaded successfully',
      documentUrl
    });
  } catch (error: any) {
    console.error('Verification document upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Error uploading verification document' },
      { status: 500 }
    );
  }
}

// This endpoint is for admins to approve or reject verification requests
export async function PUT(req: NextRequest) {
  try {
    // Only allow authenticated admins
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const { userId, action, verificationLevel, notes } = body;
    
    if (!userId || !action || (action !== 'approve' && action !== 'reject')) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Find user and update verification status
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    user.verificationStatus = action === 'approve' ? 'verified' : 'rejected';
    await user.save();
    
    // If approved and company profile exists, update verification level
    if (action === 'approve' && user.companyProfile && verificationLevel) {
      const companyProfile = await CompanyProfile.findById(user.companyProfile);
      
      if (companyProfile) {
        companyProfile.verificationLevel = verificationLevel;
        await companyProfile.save();
      }
    }
    
    // In a real implementation, we would send notification emails here
    
    return NextResponse.json({
      message: `User verification ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      user: {
        id: user._id,
        email: user.email,
        verificationStatus: user.verificationStatus
      }
    });
  } catch (error: any) {
    console.error('Verification update error:', error);
    return NextResponse.json(
      { error: error.message || 'Error updating verification status' },
      { status: 500 }
    );
  }
}
