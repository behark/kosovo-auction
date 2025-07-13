import Vehicle, { IVehicle } from '../models/vehicle';
import mongoose from 'mongoose';

type VehicleFilters = {
  make?: string | string[];
  model?: string | string[];
  year?: {
    min?: number;
    max?: number;
  };
  mileage?: {
    min?: number;
    max?: number;
  };
  price?: {
    min?: number;
    max?: number;
  };
  bodyType?: string | string[];
  transmission?: string | string[];
  fuelType?: string | string[];
  condition?: string | string[];
  location?: {
    country?: string | string[];
    city?: string | string[];
    radius?: number;
    lat?: number;
    lng?: number;
  };
  features?: string[];
  status?: string | string[];
  seller?: string;
  auctionId?: string;
  search?: string;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    limit: number;
  };
};

interface IVehicleRepository {
  findById(id: string): Promise<IVehicle | null>;
  findByVin(vin: string): Promise<IVehicle | null>;
  search(filters: VehicleFilters): Promise<{
    vehicles: IVehicle[];
    totalCount: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  }>;
  getFeaturedVehicles(limit?: number): Promise<IVehicle[]>;
  getUpcomingAuctionVehicles(limit?: number): Promise<IVehicle[]>;
  getRecentlySoldVehicles(limit?: number): Promise<IVehicle[]>;
  getRelatedVehicles(vehicleId: string, limit?: number): Promise<IVehicle[]>;
  countByMake(): Promise<Array<{ _id: string; count: number }>>;
  countByBodyType(): Promise<Array<{ _id: string; count: number }>>;
  countByStatus(): Promise<Array<{ _id: string; count: number }>>;
}

export class VehicleRepository implements IVehicleRepository {
  async findById(id: string): Promise<IVehicle | null> {
    try {
      if (!mongoose.isValidObjectId(id)) {
        return null;
      }
      return await Vehicle.findById(id);
    } catch (error) {
      console.error('Error finding vehicle by ID:', error);
      throw error;
    }
  }

  async findByVin(vin: string): Promise<IVehicle | null> {
    try {
      return await Vehicle.findOne({ vin });
    } catch (error) {
      console.error('Error finding vehicle by VIN:', error);
      throw error;
    }
  }

  async search(filters: VehicleFilters): Promise<{
    vehicles: IVehicle[];
    totalCount: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  }> {
    try {
      // Default pagination values
      const page = filters.pagination?.page || 1;
      const limit = filters.pagination?.limit || 20;
      const skip = (page - 1) * limit;

      // Build query based on filters
      const query: any = { isActive: true };

      // Apply make filter
      if (filters.make) {
        query.make = Array.isArray(filters.make) 
          ? { $in: filters.make } 
          : filters.make;
      }

      // Apply model filter
      if (filters.model) {
        query.model = Array.isArray(filters.model) 
          ? { $in: filters.model } 
          : filters.model;
      }

      // Apply year range filter
      if (filters.year) {
        query.year = {};
        if (filters.year.min !== undefined) {
          query.year.$gte = filters.year.min;
        }
        if (filters.year.max !== undefined) {
          query.year.$lte = filters.year.max;
        }
      }

      // Apply mileage range filter
      if (filters.mileage) {
        query.mileage = {};
        if (filters.mileage.min !== undefined) {
          query.mileage.$gte = filters.mileage.min;
        }
        if (filters.mileage.max !== undefined) {
          query.mileage.$lte = filters.mileage.max;
        }
      }

      // Apply price range filter
      if (filters.price) {
        query['auctionDetails.currentBid'] = {};
        if (filters.price.min !== undefined) {
          query['auctionDetails.currentBid'].$gte = filters.price.min;
        }
        if (filters.price.max !== undefined) {
          query['auctionDetails.currentBid'].$lte = filters.price.max;
        }
      }

      // Apply body type filter
      if (filters.bodyType) {
        query.bodyType = Array.isArray(filters.bodyType)
          ? { $in: filters.bodyType }
          : filters.bodyType;
      }

      // Apply transmission filter
      if (filters.transmission) {
        query.transmission = Array.isArray(filters.transmission)
          ? { $in: filters.transmission }
          : filters.transmission;
      }

      // Apply fuel type filter
      if (filters.fuelType) {
        query.fuelType = Array.isArray(filters.fuelType)
          ? { $in: filters.fuelType }
          : filters.fuelType;
      }

      // Apply condition filter
      if (filters.condition) {
        query.condition = Array.isArray(filters.condition)
          ? { $in: filters.condition }
          : filters.condition;
      }

      // Apply location filters
      if (filters.location) {
        // Country filter
        if (filters.location.country) {
          query['location.country'] = Array.isArray(filters.location.country)
            ? { $in: filters.location.country }
            : filters.location.country;
        }

        // City filter
        if (filters.location.city) {
          query['location.city'] = Array.isArray(filters.location.city)
            ? { $in: filters.location.city }
            : filters.location.city;
        }

        // Radius search (requires GeoJSON data and $geoNear aggregation)
        if (filters.location.radius && filters.location.lat && filters.location.lng) {
          // We'd implement a geo query here in a real application
          // This would require converting the database to use GeoJSON for coordinates
        }
      }

      // Apply features filter (all features must be present)
      if (filters.features && filters.features.length > 0) {
        query.features = { $all: filters.features };
      }

      // Apply auction status filter
      if (filters.status) {
        query['auctionDetails.status'] = Array.isArray(filters.status)
          ? { $in: filters.status }
          : filters.status;
      }

      // Apply seller filter
      if (filters.seller) {
        if (mongoose.isValidObjectId(filters.seller)) {
          query.seller = new mongoose.Types.ObjectId(filters.seller);
        }
      }

      // Apply auction ID filter
      if (filters.auctionId) {
        if (mongoose.isValidObjectId(filters.auctionId)) {
          query['auctionDetails.auctionId'] = new mongoose.Types.ObjectId(filters.auctionId);
        }
      }

      // Apply text search
      if (filters.search) {
        // Add text search if a text index exists
        // query.$text = { $search: filters.search };
        
        // Alternative: Use regex search on multiple fields if no text index
        const searchRegex = new RegExp(filters.search, 'i');
        query.$or = [
          { make: searchRegex },
          { model: searchRegex },
          { description: searchRegex },
          { features: searchRegex },
          { sellerNotes: searchRegex }
        ];
      }

      // Determine sort order
      let sortOptions: any = { 'auctionDetails.startDate': -1 }; // Default sort by auction start date (newest first)
      
      if (filters.sort) {
        switch (filters.sort.field) {
          case 'price':
            sortOptions = { 'auctionDetails.currentBid': filters.sort.order === 'asc' ? 1 : -1 };
            break;
          case 'year':
            sortOptions = { year: filters.sort.order === 'asc' ? 1 : -1 };
            break;
          case 'mileage':
            sortOptions = { mileage: filters.sort.order === 'asc' ? 1 : -1 };
            break;
          case 'endDate':
            sortOptions = { 'auctionDetails.endDate': filters.sort.order === 'asc' ? 1 : -1 };
            break;
          case 'condition':
            // Map condition to numeric values for sorting
            const conditionValues = {
              'excellent': 5,
              'good': 4,
              'average': 3,
              'fair': 2,
              'poor': 1
            };
            // Would require an aggregation pipeline in a real implementation
            break;
          case 'make':
            sortOptions = { make: filters.sort.order === 'asc' ? 1 : -1 };
            break;
          case 'model':
            sortOptions = { model: filters.sort.order === 'asc' ? 1 : -1 };
            break;
          case 'popularity':
            sortOptions = { 'auctionDetails.bidCount': -1 }; // Higher bid count = more popular
            break;
          default:
            // Keep default sort
            break;
        }
      }

      // Execute query with pagination
      const vehicles = await Vehicle.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count for pagination
      const totalCount = await Vehicle.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      return {
        vehicles,
        totalCount,
        page,
        totalPages,
        hasMore: page < totalPages
      };
    } catch (error) {
      console.error('Error searching vehicles:', error);
      throw error;
    }
  }

  async getFeaturedVehicles(limit = 8): Promise<IVehicle[]> {
    try {
      // Get active auction vehicles with the most bids
      return await Vehicle.find({
        isActive: true,
        'auctionDetails.status': 'active',
      })
        .sort({ 'auctionDetails.bidCount': -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('Error getting featured vehicles:', error);
      throw error;
    }
  }

  async getUpcomingAuctionVehicles(limit = 8): Promise<IVehicle[]> {
    try {
      const now = new Date();
      
      // Get vehicles with upcoming auctions
      return await Vehicle.find({
        isActive: true,
        'auctionDetails.status': 'scheduled',
        'auctionDetails.startDate': { $gt: now }
      })
        .sort({ 'auctionDetails.startDate': 1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('Error getting upcoming auction vehicles:', error);
      throw error;
    }
  }

  async getRecentlySoldVehicles(limit = 8): Promise<IVehicle[]> {
    try {
      // Get recently sold vehicles
      return await Vehicle.find({
        isActive: true,
        'auctionDetails.status': 'sold'
      })
        .sort({ 'auctionDetails.endDate': -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('Error getting recently sold vehicles:', error);
      throw error;
    }
  }

  async getRelatedVehicles(vehicleId: string, limit = 4): Promise<IVehicle[]> {
    try {
      if (!mongoose.isValidObjectId(vehicleId)) {
        return [];
      }

      // Get the original vehicle
      const vehicle = await Vehicle.findById(vehicleId);
      
      if (!vehicle) {
        return [];
      }

      // Find vehicles with the same make and model or similar characteristics
      return await Vehicle.find({
        _id: { $ne: vehicle._id }, // Exclude the original vehicle
        isActive: true,
        $or: [
          { make: vehicle.make, model: vehicle.model },
          { make: vehicle.make, bodyType: vehicle.bodyType },
          { year: { $gte: vehicle.year - 2, $lte: vehicle.year + 2 }, make: vehicle.make },
        ]
      })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('Error getting related vehicles:', error);
      throw error;
    }
  }

  async countByMake(): Promise<Array<{ _id: string; count: number }>> {
    try {
      // Group vehicles by make and count
      return await Vehicle.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$make', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
    } catch (error) {
      console.error('Error counting vehicles by make:', error);
      throw error;
    }
  }

  async countByBodyType(): Promise<Array<{ _id: string; count: number }>> {
    try {
      // Group vehicles by body type and count
      return await Vehicle.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$bodyType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
    } catch (error) {
      console.error('Error counting vehicles by body type:', error);
      throw error;
    }
  }

  async countByStatus(): Promise<Array<{ _id: string; count: number }>> {
    try {
      // Group vehicles by auction status and count
      return await Vehicle.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$auctionDetails.status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
    } catch (error) {
      console.error('Error counting vehicles by status:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const vehicleRepository = new VehicleRepository();
