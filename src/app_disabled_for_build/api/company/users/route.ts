import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { hash } from 'bcrypt';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Get all users for a company (for managers/admins)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only company managers and admins can view all company users
    if (session.user.role !== 'manager' && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    // Find all users from the same company
    const companyUsers = await User.find({ 
      company: session.user.company,
      // Exclude sensitive data
    }, {
      password: 0,
      verificationDocuments: 0,
      businessLicense: 0,
      taxId: 0
    }).sort({ createdAt: -1 });
    
    return NextResponse.json({ users: companyUsers });
  } catch (error: any) {
    console.error('Error fetching company users:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching company users' },
      { status: 500 }
    );
  }
}

// Add a new user to company
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only company managers and admins can add new users
    if (session.user.role !== 'manager' && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, role } = body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role (manager can't create other managers)
    if (session.user.role === 'manager' && role === 'manager') {
      return NextResponse.json(
        { error: 'Managers cannot create other managers' },
        { status: 403 }
      );
    }

    // Admin can create any role, except another admin
    if (session.user.role === 'admin' && role === 'admin') {
      return NextResponse.json(
        { error: 'Please use the admin panel to create admin users' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user with company info from the session user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      company: session.user.company,
      role: role || 'staff', // Default to staff if not specified
      companyProfile: session.user.companyProfile,
      verificationStatus: 'verified', // Users added by managers are auto-verified
    });

    // Remove sensitive data before returning
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
      verificationStatus: user.verificationStatus,
      createdAt: user.createdAt
    };

    return NextResponse.json({
      user: safeUser,
      message: 'User added to company successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding company user:', error);
    return NextResponse.json(
      { error: error.message || 'Error adding company user' },
      { status: 500 }
    );
  }
}

// Update user role (for company managers)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only company managers and admins can update users
    if (session.user.role !== 'manager' && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, role, isActive } = body;
    
    if (!userId || (role === undefined && isActive === undefined)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    // Find the user to update
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Ensure the user belongs to the same company
    if (user.company !== session.user.company) {
      return NextResponse.json(
        { error: 'Cannot modify users from other companies' },
        { status: 403 }
      );
    }
    
    // Managers can't modify other managers
    if (session.user.role === 'manager' && user.role === 'manager') {
      return NextResponse.json(
        { error: 'Managers cannot modify other managers' },
        { status: 403 }
      );
    }

    // Update user role if provided
    if (role !== undefined) {
      // Managers can't promote to manager or admin
      if (session.user.role === 'manager' && (role === 'manager' || role === 'admin')) {
        return NextResponse.json(
          { error: 'Insufficient permissions to assign this role' },
          { status: 403 }
        );
      }
      
      user.role = role;
    }
    
    // Update active status if provided
    if (isActive !== undefined) {
      user.isActive = isActive;
    }
    
    await user.save();
    
    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error: any) {
    console.error('Error updating company user:', error);
    return NextResponse.json(
      { error: error.message || 'Error updating company user' },
      { status: 500 }
    );
  }
}
