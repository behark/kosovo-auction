import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import CompanyProfile from '@/lib/db/models/company-profile';
import { hash } from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      company,
      businessType,
      primaryAddress,
      contactPhone,
      taxId,
      businessLicense
    } = body;

    // Validate required fields
    if (!name || !email || !password || !company || !businessType || !primaryAddress || !contactPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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

    // Create company profile
    const companyProfile = await CompanyProfile.create({
      name: company,
      businessType,
      primaryAddress,
      contactEmail: email,
      contactPhone,
      licenseNumbers: businessLicense ? [{
        type: 'business',
        number: businessLicense,
        country: primaryAddress.country
      }] : undefined,
      taxIdentifiers: taxId ? [{
        type: 'tax',
        number: taxId,
        country: primaryAddress.country
      }] : undefined
    });

    // Create new user with reference to company profile
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      company,
      role: 'dealer', // Default role for new registrations
      companyProfile: companyProfile._id,
      businessAddress: primaryAddress,
      phoneNumber: contactPhone,
      taxId,
      businessLicense,
      verificationStatus: 'pending' // All new accounts need verification
    });

    // Remove sensitive data before returning response
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      verificationStatus: user.verificationStatus,
      role: user.role
    };

    return NextResponse.json({ 
      user: safeUser,
      message: 'Registration successful! Your account is pending verification.' 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
