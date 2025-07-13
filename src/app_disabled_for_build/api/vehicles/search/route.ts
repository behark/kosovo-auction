import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db/mongodb';
import { vehicleRepository } from '@/lib/db/repositories/vehicle-repository';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
    
    // Get URL parameters for search and filtering
    const searchParams = req.nextUrl.searchParams;
    
    // Build filters object from search parameters
    const filters: any = {};
    
    // Text search
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      filters.search = searchQuery;
    }
    
    // Make & Model filters
    const make = searchParams.get('make');
    if (make) {
      filters.make = make.split(',');
    }
    
    const model = searchParams.get('model');
    if (model) {
      filters.model = model.split(',');
    }
    
    // Year range filter
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    if (minYear || maxYear) {
      filters.year = {};
      if (minYear) {
        filters.year.min = parseInt(minYear);
      }
      if (maxYear) {
        filters.year.max = parseInt(maxYear);
      }
    }
    
    // Price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) {
        filters.price.min = parseInt(minPrice);
      }
      if (maxPrice) {
        filters.price.max = parseInt(maxPrice);
      }
    }
    
    // Mileage range filter
    const minMileage = searchParams.get('minMileage');
    const maxMileage = searchParams.get('maxMileage');
    if (minMileage || maxMileage) {
      filters.mileage = {};
      if (minMileage) {
        filters.mileage.min = parseInt(minMileage);
      }
      if (maxMileage) {
        filters.mileage.max = parseInt(maxMileage);
      }
    }
    
    // Body type filter
    const bodyType = searchParams.get('bodyType');
    if (bodyType) {
      filters.bodyType = bodyType.split(',');
    }
    
    // Transmission filter
    const transmission = searchParams.get('transmission');
    if (transmission) {
      filters.transmission = transmission.split(',');
    }
    
    // Fuel type filter
    const fuelType = searchParams.get('fuelType');
    if (fuelType) {
      filters.fuelType = fuelType.split(',');
    }
    
    // Condition filter
    const condition = searchParams.get('condition');
    if (condition) {
      filters.condition = condition.split(',');
    }
    
    // Location filters
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const radius = searchParams.get('radius');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    
    if (country || city || (radius && lat && lng)) {
      filters.location = {};
      
      if (country) {
        filters.location.country = country.split(',');
      }
      
      if (city) {
        filters.location.city = city.split(',');
      }
      
      if (radius && lat && lng) {
        filters.location.radius = parseInt(radius);
        filters.location.lat = parseFloat(lat);
        filters.location.lng = parseFloat(lng);
      }
    }
    
    // Features filter
    const features = searchParams.get('features');
    if (features) {
      filters.features = features.split(',');
    }
    
    // Auction status filter
    const status = searchParams.get('status');
    if (status) {
      filters.status = status.split(',');
    }
    
    // Seller filter
    const seller = searchParams.get('seller');
    if (seller) {
      filters.seller = seller;
    }
    
    // Auction ID filter
    const auctionId = searchParams.get('auctionId');
    if (auctionId) {
      filters.auctionId = auctionId;
    }
    
    // Sort options
    const sortField = searchParams.get('sortField') || 'startDate';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    filters.sort = {
      field: sortField,
      order: sortOrder === 'desc' ? 'desc' : 'asc'
    };
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    filters.pagination = {
      page,
      limit
    };
    
    // Execute search
    const results = await vehicleRepository.search(filters);
    
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error searching vehicles:', error);
    return NextResponse.json(
      { error: error.message || 'Error searching vehicles' },
      { status: 500 }
    );
  }
}
