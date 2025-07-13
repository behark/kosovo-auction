import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

// Socket.io server instance with NextAuth authentication
export const initializeSocketServer = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authenticate socket connections using NextAuth session
  io.use(async (socket, next) => {
    try {
      const session = await getSession({ req: socket.request });
      
      if (!session || !session.user) {
        return next(new Error('Unauthorized'));
      }
      
      // Store user info in socket for later use
      socket.data.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        company: session.user.company
      };
      
      // Store authentication status
      socket.data.authenticated = true;
      
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  // Handle connections
  io.on('connection', (socket) => {
    // Log connections for monitoring
    console.log(`Socket connected: ${socket.id} - User: ${socket.data.user?.name}`);
    
    // Join user to their own private channel for direct messages
    socket.join(`user:${socket.data.user.id}`);
    
    // Handle auction room subscriptions
    socket.on('join-auction', (auctionId) => {
      socket.join(`auction:${auctionId}`);
      console.log(`User ${socket.data.user.id} joined auction:${auctionId}`);
      
      // Notify auction room about new bidder
      socket.to(`auction:${auctionId}`).emit('bidder-joined', {
        userId: socket.data.user.id,
        userName: socket.data.user.name,
        company: socket.data.user.company
      });
    });
    
    // Handle leaving auction rooms
    socket.on('leave-auction', (auctionId) => {
      socket.leave(`auction:${auctionId}`);
      console.log(`User ${socket.data.user.id} left auction:${auctionId}`);
      
      // Notify auction room about bidder leaving
      socket.to(`auction:${auctionId}`).emit('bidder-left', {
        userId: socket.data.user.id,
        userName: socket.data.user.name
      });
    });
    
    // Handle new bids
    socket.on('place-bid', async ({ auctionId, vehicleId, amount, currency }) => {
      try {
        // In a real implementation, we would:
        // 1. Validate the bid (minimum increment, auction status, etc.)
        // 2. Create the bid in the database
        // 3. Update the vehicle's currentBid
        // 4. Emit events to relevant parties
        
        // For this example, we'll just emit the event
        io.to(`auction:${auctionId}`).emit('new-bid', {
          auctionId,
          vehicleId,
          amount,
          currency,
          bidder: {
            id: socket.data.user.id,
            name: socket.data.user.name,
            company: socket.data.user.company
          },
          timestamp: new Date()
        });
        
        // Send acknowledgement to the bidder
        socket.emit('bid-placed', {
          success: true,
          auctionId,
          vehicleId,
          amount
        });
      } catch (error) {
        console.error('Error placing bid:', error);
        socket.emit('bid-error', {
          message: 'Failed to place bid',
          details: error.message
        });
      }
    });
    
    // Handle disconnections
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  // Store the io instance to be reused
  (global as any).io = io;

  return io;
};

// Get the existing Socket.io server instance or create a new one
export const getSocketServer = (res: NextApiResponse) => {
  if ((global as any).io) {
    return (global as any).io;
  }
  
  // If no existing instance, initialize with the server from response
  if (res.socket?.server) {
    return initializeSocketServer(res.socket.server as unknown as HTTPServer);
  }
  
  throw new Error('Could not get Socket.io server instance');
};

// Socket events that our system can emit or listen to
export const SOCKET_EVENTS = {
  // Auction events
  AUCTION_STARTED: 'auction-started',
  AUCTION_ENDED: 'auction-ended',
  AUCTION_EXTENDED: 'auction-extended',
  AUCTION_UPDATED: 'auction-updated',
  
  // Bidding events
  NEW_BID: 'new-bid',
  BID_PLACED: 'bid-placed',
  BID_ACCEPTED: 'bid-accepted',
  BID_REJECTED: 'bid-rejected',
  BID_OUTBID: 'bid-outbid',
  BID_ERROR: 'bid-error',
  
  // User events
  USER_JOINED: 'bidder-joined',
  USER_LEFT: 'bidder-left',
  
  // Vehicle events
  VEHICLE_SOLD: 'vehicle-sold',
  VEHICLE_NOT_SOLD: 'vehicle-not-sold',
  VEHICLE_UPDATED: 'vehicle-updated',
  
  // Notifications
  NOTIFICATION: 'notification',
  
  // System events
  SYSTEM_MESSAGE: 'system-message'
};
