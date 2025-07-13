import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db/mongodb';
import Inspection from '@/lib/db/models/inspection';
import Vehicle from '@/lib/db/models/vehicle';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

// Get all inspections for a specific vehicle
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { id } = params;
    
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' },
        { status: 400 }
      );
    }
    
    // Check if vehicle exists
    const vehicle = await Vehicle.findById(id).lean();
    
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }
    
    // Get all inspections for this vehicle
    const inspections = await Inspection.find({ vehicleId: id })
      .sort({ inspectionDate: -1 })
      .lean();
    
    return NextResponse.json(inspections);
  } catch (error: any) {
    console.error('Error fetching inspections:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching inspections' },
      { status: 500 }
    );
  }
}

// Create a new inspection for a specific vehicle
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure user is authenticated and authorized
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Only inspectors, admins, and verified dealers can create inspections
    if (!['admin', 'inspector', 'dealer'].includes(session.user.role) || 
        (session.user.role === 'dealer' && !session.user.isVerified)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
    
    await dbConnect();
    
    const { id } = params;
    
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' },
        { status: 400 }
      );
    }
    
    // Check if vehicle exists
    const vehicle = await Vehicle.findById(id);
    
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }
    
    const data = await req.json();
    
    // Set vehicleId to ensure it matches the URL parameter
    data.vehicleId = id;
    
    // Set inspector information
    data.inspectorName = session.user.name;
    if (session.user.company) {
      data.inspectorCompany = session.user.company;
    }
    
    // Admin and inspectors can create verified inspections
    if (session.user.role === 'admin' || session.user.role === 'inspector') {
      data.isVerified = true;
      data.verifiedBy = session.user.id;
      data.verificationDate = new Date();
    } else {
      data.isVerified = false;
    }
    
    // Create the inspection
    const inspection = await Inspection.create(data);
    
    // Update vehicle with reference to this inspection
    await Vehicle.findByIdAndUpdate(id, {
      $push: { inspections: inspection._id }
    });
    
    return NextResponse.json(inspection, { status: 201 });
  } catch (error: any) {
    console.error('Error creating inspection:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating inspection' },
      { status: 500 }
    );
  }
}
