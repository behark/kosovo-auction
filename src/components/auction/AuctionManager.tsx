import React, { useState, useEffect } from 'react';
import { Vehicle } from '@/components/vehicles/VehicleCard';

interface Bid {
  id: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
  isAutoBid?: boolean;
}

interface AuctionData {
  vehicleId: string;
  startingPrice: number;
  currentPrice: number;
  reservePrice?: number;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'active' | 'ended' | 'cancelled';
  bids: Bid[];
  winner?: string;
  totalBids: number;
}

interface AuctionManagerProps {
  vehicle: Vehicle;
  auction: AuctionData;
  currentUserId?: string;
  onPlaceBid: (amount: number) => Promise<void>;
  onSetAutoBid?: (maxAmount: number) => Promise<void>;
}

const AuctionManager: React.FC<AuctionManagerProps> = ({
  vehicle,
  auction,
  currentUserId,
  onPlaceBid,
  onSetAutoBid
}) => {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [autoBidMax, setAutoBidMax] = useState<string>('');
  const [showAutoBid, setShowAutoBid] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isSubmitting, setBidSubmitting] = useState(false);

  // Calculate time remaining
  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const end = new Date(auction.endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Auction Ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [auction.endTime]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);
    
    if (amount <= auction.currentPrice) {
      alert(`Bid must be higher than current price of €${auction.currentPrice.toLocaleString()}`);
      return;
    }

    setBidSubmitting(true);
    try {
      await onPlaceBid(amount);
      setBidAmount('');
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Failed to place bid. Please try again.');
    } finally {
      setBidSubmitting(false);
    }
  };

  const handleAutoBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const maxAmount = parseFloat(autoBidMax);
    
    if (maxAmount <= auction.currentPrice) {
      alert(`Auto-bid maximum must be higher than current price of €${auction.currentPrice.toLocaleString()}`);
      return;
    }

    if (onSetAutoBid) {
      try {
        await onSetAutoBid(maxAmount);
        setAutoBidMax('');
        setShowAutoBid(false);
        alert('Auto-bid set successfully!');
      } catch (error) {
        console.error('Error setting auto-bid:', error);
        alert('Failed to set auto-bid. Please try again.');
      }
    }
  };

  const getMinBidAmount = () => {
    return auction.currentPrice + 100; // Minimum increment of €100
  };

  const isAuctionActive = auction.status === 'active' && new Date() < new Date(auction.endTime);
  const isAuctionEnded = auction.status === 'ended' || new Date() >= new Date(auction.endTime);
  const userIsWinning = auction.bids.length > 0 && auction.bids[0]?.bidderId === currentUserId;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Live Auction
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          auction.status === 'active' ? 'bg-green-100 text-green-800' :
          auction.status === 'ended' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-gray-600">{vehicle.location}</p>
      </div>

      {/* Auction Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">Current Bid</p>
          <p className="text-2xl font-bold text-green-600">
            €{auction.currentPrice.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Starting Price</p>
          <p className="text-lg font-semibold text-gray-900">
            €{auction.startingPrice.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Bids</p>
          <p className="text-lg font-semibold text-blue-600">
            {auction.totalBids}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Time Remaining</p>
          <p className={`text-lg font-semibold ${
            timeRemaining.includes('Ended') ? 'text-red-600' : 'text-orange-600'
          }`}>
            {timeRemaining}
          </p>
        </div>
      </div>

      {/* Reserve Price */}
      {auction.reservePrice && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Reserve Price:</span> €{auction.reservePrice.toLocaleString()}
            {auction.currentPrice >= auction.reservePrice ? (
              <span className="text-green-600 ml-2">✓ Reserve Met</span>
            ) : (
              <span className="text-orange-600 ml-2">Reserve Not Met</span>
            )}
          </p>
        </div>
      )}

      {/* User Status */}
      {currentUserId && isAuctionActive && (
        <div className="mb-4">
          {userIsWinning ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 font-medium">🎉 You are currently winning this auction!</p>
            </div>
          ) : auction.bids.some(bid => bid.bidderId === currentUserId) ? (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800">You have placed bids on this auction</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Bidding Section */}
      {isAuctionActive && currentUserId && (
        <div className="space-y-4 mb-6">
          <form onSubmit={handleBidSubmit} className="flex space-x-3">
            <div className="flex-1">
              <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Your Bid (minimum: €{getMinBidAmount().toLocaleString()})
              </label>
              <input
                id="bidAmount"
                type="number"
                min={getMinBidAmount()}
                step="100"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`€${getMinBidAmount().toLocaleString()}`}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !bidAmount}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing...' : 'Place Bid'}
              </button>
            </div>
          </form>

          {/* Auto-bid */}
          {onSetAutoBid && (
            <div>
              <button
                onClick={() => setShowAutoBid(!showAutoBid)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showAutoBid ? 'Hide Auto-Bid' : 'Set Auto-Bid'}
              </button>
              
              {showAutoBid && (
                <form onSubmit={handleAutoBidSubmit} className="mt-2 flex space-x-3">
                  <div className="flex-1">
                    <label htmlFor="autoBidMax" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Auto-Bid Amount
                    </label>
                    <input
                      id="autoBidMax"
                      type="number"
                      min={getMinBidAmount()}
                      step="100"
                      value={autoBidMax}
                      onChange={(e) => setAutoBidMax(e.target.value)}
                      placeholder={`€${getMinBidAmount().toLocaleString()}`}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Set Auto-Bid
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* Auction Ended */}
      {isAuctionEnded && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Auction Ended</h3>
          {auction.winner ? (
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Winner:</span> {auction.winner}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Winning Bid:</span> €{auction.currentPrice.toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-700">No winner - reserve price not met</p>
          )}
        </div>
      )}

      {/* Recent Bids */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Bids</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {auction.bids.length > 0 ? (
            auction.bids.slice(0, 10).map((bid, index) => (
              <div
                key={bid.id}
                className={`flex justify-between items-center p-3 rounded-md ${
                  index === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {bid.bidderName}
                    {bid.isAutoBid && <span className="text-xs text-blue-600 ml-1">(Auto)</span>}
                    {index === 0 && <span className="text-xs text-green-600 ml-1">(Leading)</span>}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(bid.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    €{bid.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-4">No bids yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionManager;
