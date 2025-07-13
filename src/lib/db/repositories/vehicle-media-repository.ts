import mongoose from 'mongoose';
import Vehicle, { IVehicle } from '../models/vehicle';

interface IVehicleMedia {
  vehicleId: string;
  mainImage?: string;
  images: string[];
  videos?: string[];
  documents?: Array<{
    name: string;
    type: string;
    url: string;
    category: string;
    uploadedAt: Date;
    size?: number;
  }>;
}

export interface IVehicleMediaRepository {
  getVehicleMedia(vehicleId: string): Promise<IVehicleMedia | null>;
  addImage(vehicleId: string, imageUrl: string, isMain?: boolean): Promise<boolean>;
  addVideo(vehicleId: string, videoUrl: string): Promise<boolean>;
  addDocument(vehicleId: string, document: {
    name: string;
    type: string;
    url: string;
    category: string;
    size?: number;
  }): Promise<boolean>;
  removeImage(vehicleId: string, imageUrl: string): Promise<boolean>;
  removeVideo(vehicleId: string, videoUrl: string): Promise<boolean>;
  removeDocument(vehicleId: string, documentUrl: string): Promise<boolean>;
  setMainImage(vehicleId: string, imageUrl: string): Promise<boolean>;
  reorderImages(vehicleId: string, newOrder: string[]): Promise<boolean>;
}

export class VehicleMediaRepository implements IVehicleMediaRepository {
  async getVehicleMedia(vehicleId: string): Promise<IVehicleMedia | null> {
    try {
      if (!mongoose.isValidObjectId(vehicleId)) {
        return null;
      }

      const vehicle = await Vehicle.findById(vehicleId)
        .select('images mainImage videos documents')
        .lean();

      if (!vehicle) {
        return null;
      }

      return {
        vehicleId,
        mainImage: vehicle.mainImage,
        images: vehicle.images || [],
        videos: vehicle.videos || [],
        documents: vehicle.documents || []
      };
    } catch (error) {
      console.error('Error getting vehicle media:', error);
      throw error;
    }
  }

  async addImage(vehicleId: string, imageUrl: string, isMain = false): Promise<boolean> {
    try {
      if (!mongoose.isValidObjectId(vehicleId)) {
        return false;
      }

      const vehicle = await Vehicle.findById(vehicleId);

      if (!vehicle) {
        return false;
      }

      // Check if image already exists
      if (vehicle.images && vehicle.images.includes(imageUrl)) {
        // If the image exists but we need to set it as main
        if (isMain) {
          vehicle.mainImage = imageUrl;
          await vehicle.save();
        }
        return true;
      }

      // Add the image to the array
      if (!vehicle.images) {
        vehicle.images = [];
      }
      vehicle.images.push(imageUrl);

      // Set as main image if requested or if it's the first image
      if (isMain || !vehicle.mainImage) {
        vehicle.mainImage = imageUrl;
      }

      await vehicle.save();
      return true;
    } catch (error) {
      console.error('Error adding vehicle image:', error);
      throw error;
    }
  }

  async addVideo(vehicleId: string, videoUrl: string): Promise<boolean> {
    try {
      if (!mongoose.isValidObjectId(vehicleId)) {
        return false;
      }

      const vehicle = await Vehicle.findById(vehicleId);

      if (!vehicle) {
        return false;
      }

      // Check if video already exists
      if (vehicle.videos && vehicle.videos.includes(videoUrl)) {
        return true;
      }

      // Add the video to the array
      if (!vehicle.videos) {
        vehicle.videos = [];
      }
      vehicle.videos.push(videoUrl);

      await vehicle.save();
      return true;
    } catch (error) {
      console.error('Error adding vehicle video:', error);
      throw error;
    }
  }

  async addDocument(vehicleId: string, document: {
    name: string;
    type: string;
    url: string;
    category: string;
    size?: number;
  }): Promise<boolean> {
    try {
      if (!mongoose.isValidObjectId(vehicleId)) {
        return false;
      }

      const vehicle = await Vehicle.findById(vehicleId);

      if (!vehicle) {
        return false;
      }

      // Check if document already exists
      if (vehicle.documents && vehicle.documents.some(doc => doc.url === document.url)) {
        return true;
      }

      // Add the document to the array
      if (!vehicle.documents) {
        vehicle.documents = [];
      }

      vehicle.documents.push({
        name: document.name,
        type: document.type,
        url: document.url,
        category: document.category,
        uploadedAt: new Date(),
        size: document.size
      });

      await vehicle.save();
      return true;
    } catch (error) {
      console.error('Error adding vehicle document:', error);
      throw error;
    }
  }

  async removeImage(vehicleId: string, imageUrl: string): Promise<boolean> {
    try {
      if (!mongoose.isValidObjectId(vehicleId)) {
        return false;
      }

      const vehicle = await Vehicle.findById(vehicleId);

      if (!vehicle || !vehicle.images) {
        return false;
      }

      // Check if the image exists
      const imageIndex = vehicle.images.indexOf(imageUrl);
      if (imageIndex === -1) {
        return false;
      }

      // Remove the image
      vehicle.images.splice(imageIndex, 1);

      // If we removed the main image, set a new one if available
      if (vehicle.mainImage === imageUrl) {
        vehicle.mainImage = vehicle.images.length > 0 ? vehicle.images[0] : undefined;
      }

      await vehicle.save();
      return true;
    } catch (error) {
      console.error('Error removing vehicle image:', error);
      throw error;
    }
  }

  async removeVideo(vehicleId: string, videoUrl: string): Promise<boolean> {
    try {
      if (!mongoose.isValidObjectId(vehicleId)) {
        return false;
      }

      const vehicle = await Vehicle.findById(vehicleId);

      if (!vehicle || !vehicle.videos) {
        return false;
      }

      // Check if the video exists
      const videoIndex = vehicle.videos.indexOf(videoUrl);
      if (videoIndex === -1) {
        return false;
      }

      // Remove the video
      vehicle.videos.splice(videoIndex, 1);

      await vehicle.save();
      return true;
    } catch (error) {
      console.error('Error removing vehicle video:', error);
      throw error;
    }
  }

  async removeDocument(vehicleId: string, documentUrl: string): Promise<boolean> {
    try {
      if (!mongoose.isValidObjectId(vehicleId)) {
        return false;
      }

      const vehicle = await Vehicle.findById(vehicleId);

      if (!vehicle || !vehicle.documents) {
        return false;
      }

      // Find the document index
      const documentIndex = vehicle.documents.findIndex(doc => doc.url === documentUrl);
      if (documentIndex === -1) {
        return false;
      }

      // Remove the document
      vehicle.documents.splice(documentIndex, 1);

      await vehicle.save();
      return true;
    } catch (error) {
      console.error('Error removing vehicle document:', error);
      throw error;
    }
  }

  async setMainImage(vehicleId: string, imageUrl: string): Promise<boolean> {
    try {
      if (!mongoose.isValidObjectId(vehicleId)) {
        return false;
      }

      const vehicle = await Vehicle.findById(vehicleId);

      if (!vehicle) {
        return false;
      }

      // Check if the image exists in the vehicle's images
      if (!vehicle.images || !vehicle.images.includes(imageUrl)) {
        return false;
      }

      // Set as main image
      vehicle.mainImage = imageUrl;

      await vehicle.save();
      return true;
    } catch (error) {
      console.error('Error setting main vehicle image:', error);
      throw error;
    }
  }

  async reorderImages(vehicleId: string, newOrder: string[]): Promise<boolean> {
    try {
      if (!mongoose.isValidObjectId(vehicleId)) {
        return false;
      }

      const vehicle = await Vehicle.findById(vehicleId);

      if (!vehicle || !vehicle.images) {
        return false;
      }

      // Verify that newOrder contains all and only the images in vehicle.images
      const currentSet = new Set(vehicle.images);
      const newSet = new Set(newOrder);

      // Check if both sets have the same size and all elements in newOrder exist in vehicle.images
      if (currentSet.size !== newSet.size || !newOrder.every(img => currentSet.has(img))) {
        return false;
      }

      // Apply the new order
      vehicle.images = newOrder;

      await vehicle.save();
      return true;
    } catch (error) {
      console.error('Error reordering vehicle images:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const vehicleMediaRepository = new VehicleMediaRepository();
