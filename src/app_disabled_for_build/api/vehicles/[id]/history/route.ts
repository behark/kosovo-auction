import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db/mongodb';
import VehicleHistory from '@/lib/db/models/vehicle-history';
import Vehicle from '@/lib/db/models/vehicle';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

// Get vehicle history for a specific vehicle
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
    
    // Get history record for this vehicle
    let history = await VehicleHistory.findOne({ vehicleId: id })
      .populate('inspections')
      .lean();
    
    if (!history) {
      // Return empty history if none exists yet
      return NextResponse.json({
        vehicleId: id,
        vin: vehicle.vin,
        services: [],
        ownership: [],
        incidents: [],
        odometerReadings: [],
        summaryData: {
          numberOfOwners: 0,
          numberOfAccidents: 0,
          totalServiceRecords: 0,
          hasOpenRecalls: false
        }
      });
    }
    
    return NextResponse.json(history);
  } catch (error: any) {
    console.error('Error fetching vehicle history:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching vehicle history' },
      { status: 500 }
    );
  }
}

// Create or update vehicle history
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
    
    // Only admins and verified dealers/inspectors can create/update history
    if (!['admin', 'inspector', 'dealer'].includes(session.user.role) || 
        (['dealer', 'inspector'].includes(session.user.role) && !session.user.isVerified)) {
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
    
    // Check what type of update we're doing
    const updateType = req.nextUrl.searchParams.get('type') || 'full';
    
    // Find existing history or create new one
    let history = await VehicleHistory.findOne({ vehicleId: id });
    
    if (!history) {
      // Create new history record
      history = new VehicleHistory({
        vehicleId: id,
        vin: vehicle.vin,
        reportDate: new Date(),
        services: [],
        ownership: [],
        incidents: [],
        odometerReadings: [],
        summaryData: {
          numberOfOwners: 0,
          numberOfAccidents: 0,
          totalServiceRecords: 0,
          hasOpenRecalls: false
        },
        isActive: true
      });
    }
    
    // Apply updates based on type
    switch (updateType) {
      case 'service':
        // Add new service record
        if (!data.service) {
          return NextResponse.json(
            { error: 'Service record data is required' },
            { status: 400 }
          );
        }
        history.services.push(data.service);
        break;
        
      case 'ownership':
        // Add new ownership record
        if (!data.ownership) {
          return NextResponse.json(
            { error: 'Ownership record data is required' },
            { status: 400 }
          );
        }
        history.ownership.push(data.ownership);
        break;
        
      case 'incident':
        // Add new incident record
        if (!data.incident) {
          return NextResponse.json(
            { error: 'Incident record data is required' },
            { status: 400 }
          );
        }
        history.incidents.push(data.incident);
        break;
        
      case 'odometer':
        // Add new odometer reading
        if (!data.odometerReading) {
          return NextResponse.json(
            { error: 'Odometer reading data is required' },
            { status: 400 }
          );
        }
        history.odometerReadings.push(data.odometerReading);
        break;
        
      case 'recall':
        // Add new recall
        if (!data.recall) {
          return NextResponse.json(
            { error: 'Recall data is required' },
            { status: 400 }
          );
        }
        if (!history.recalls) {
          history.recalls = [];
        }
        history.recalls.push(data.recall);
        break;
        
      case 'warranty':
        // Add new warranty
        if (!data.warranty) {
          return NextResponse.json(
            { error: 'Warranty data is required' },
            { status: 400 }
          );
        }
        if (!history.warrantyHistory) {
          history.warrantyHistory = [];
        }
        history.warrantyHistory.push(data.warranty);
        break;
        
      case 'importExport':
        // Add new import/export record
        if (!data.importExport) {
          return NextResponse.json(
            { error: 'Import/Export data is required' },
            { status: 400 }
          );
        }
        if (!history.importExport) {
          history.importExport = [];
        }
        history.importExport.push(data.importExport);
        break;
        
      case 'modification':
        // Add new modification record
        if (!data.modification) {
          return NextResponse.json(
            { error: 'Modification data is required' },
            { status: 400 }
          );
        }
        if (!history.modifications) {
          history.modifications = [];
        }
        history.modifications.push(data.modification);
        break;
        
      case 'value':
        // Add new value history record
        if (!data.value) {
          return NextResponse.json(
            { error: 'Value history data is required' },
            { status: 400 }
          );
        }
        if (!history.valueHistory) {
          history.valueHistory = [];
        }
        history.valueHistory.push(data.value);
        break;
        
      case 'flag':
        // Add new flag
        if (!data.flag) {
          return NextResponse.json(
            { error: 'Flag data is required' },
            { status: 400 }
          );
        }
        if (!history.flags) {
          history.flags = [];
        }
        // Add user ID to flag
        data.flag.addedBy = session.user.id;
        history.flags.push(data.flag);
        break;
        
      case 'full':
        // Full replace (admin only)
        if (session.user.role !== 'admin') {
          return NextResponse.json(
            { error: 'Forbidden: Only admins can perform full history replacements' },
            { status: 403 }
          );
        }
        
        // Keep the vehicleId and vin, but replace all other fields
        data.vehicleId = id;
        data.vin = vehicle.vin;
        
        // Use the data object to replace the history
        Object.assign(history, data);
        break;
        
      default:
        return NextResponse.json(
          { error: `Unknown update type: ${updateType}` },
          { status: 400 }
        );
    }
    
    // If user is admin or inspector, mark as verified
    if (session.user.role === 'admin' || session.user.role === 'inspector') {
      history.isVerified = true;
      history.verifiedBy = session.user.id;
      history.verificationDate = new Date();
    }
    
    // Save the updated history
    await history.save();
    
    return NextResponse.json(history);
  } catch (error: any) {
    console.error('Error updating vehicle history:', error);
    return NextResponse.json(
      { error: error.message || 'Error updating vehicle history' },
      { status: 500 }
    );
  }
}
