import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db/mongodb';
import Vehicle from '@/lib/db/models/vehicle';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

// Create a new vehicle
export async function POST(req: NextRequest) {
  try {
    // Ensure user is authenticated and authorized
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is verified and has proper role
    if (!session.user.isVerified || !['admin', 'dealer'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
    
    await dbConnect();
    
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['make', 'model', 'year', 'vin'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Associate with the current user's company as the seller
    data.seller = session.user.company;
    
    // Create the vehicle
    const vehicle = await Vehicle.create(data);
    
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating vehicle' },
      { status: 500 }
    );
  }
}

// Get all vehicles (with filtering and pagination)
export async function GET(req: NextRequest) {
  try {
    // Ensure user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Build filter query
    const query: any = {};
    
    // Add filters based on query parameters
    const make = searchParams.get('make');
    if (make) {
      query.make = make;
    }
    
    const model = searchParams.get('model');
    if (model) {
      query.model = model;
    }
    
    const year = searchParams.get('year');
    if (year) {
      query.year = parseInt(year);
    }
    
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    if (minYear || maxYear) {
      query.year = {};
      if (minYear) {
        query.year.$gte = parseInt(minYear);
      }
      if (maxYear) {
        query.year.$lte = parseInt(maxYear);
      }
    }
    
    const bodyType = searchParams.get('bodyType');
    if (bodyType) {
      query.bodyType = bodyType;
    }
    
    // Filter by seller (only if admin or the seller themselves)
    const seller = searchParams.get('seller');
    if (seller && (session.user.role === 'admin' || session.user.company === seller)) {
      if (mongoose.isValidObjectId(seller)) {
        query.seller = new mongoose.Types.ObjectId(seller);
      }
    } else if (session.user.role !== 'admin') {
      // Non-admins can only see their own vehicles or active auction vehicles
      query.$or = [
        { seller: session.user.company },
        { 'auctionDetails.status': 'active', isActive: true }
      ];
    }
    
    // Fetch vehicles with pagination
    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const totalCount = await Vehicle.countDocuments(query);
    
    return NextResponse.json({
      vehicles,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching vehicles' },
      { status: 500 }
    );
  }
}
