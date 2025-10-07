import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Hash, 
  CheckCircle, 
  XCircle, 
  Clock,
  Image as ImageIcon,
  ZoomIn,
  Download,
  Shield
} from 'lucide-react';

interface ClaimDetail {
  id: string;
  userId: string;
  timestamp: string;
  location: string;
  coordinates: { lat: number; lng: number };
  status: 'pending' | 'verified' | 'rejected';
  hash: string;
  images: Array<{
    id: string;
    url: string;
    hash: string;
    timestamp: string;
  }>;
  severity: 'low' | 'medium' | 'high';
  description: string;
  detectionType: 'manual' | 'automatic';
  confirmationTime: string;
}

const mockClaimDetail: ClaimDetail = {
  id: '2024-001',
  userId: 'USER-001',
  timestamp: '2024-01-15T10:30:00Z',
  location: 'Victoria Island, Lagos, Nigeria',
  coordinates: { lat: 6.4281, lng: 3.4219 },
  status: 'pending',
  hash: 'a1b2c3d4e5f67890abcdef1234567890',
  images: [
    {
      id: 'IMG-001',
      url: 'https://images.pexels.com/photos/2449959/pexels-photo-2449959.jpeg?auto=compress&cs=tinysrgb&w=800',
      hash: 'img1hash123456789',
      timestamp: '2024-01-15T10:30:15Z'
    },
    {
      id: 'IMG-002',
      url: 'https://images.pexels.com/photos/2449543/pexels-photo-2449543.jpeg?auto=compress&cs=tinysrgb&w=800',
      hash: 'img2hash987654321',
      timestamp: '2024-01-15T10:30:30Z'
    },
    {
      id: 'IMG-003',
      url: 'https://images.pexels.com/photos/16230616/pexels-photo-16230616/free-photo-of-damaged-car-after-accident.jpeg?auto=compress&cs=tinysrgb&w=800',
      hash: 'img3hash456789123',
      timestamp: '2024-01-15T10:30:45Z'
    }
  ],
  severity: 'medium',
  description: 'Vehicle collision at intersection during morning traffic',
  detectionType: 'automatic',
  confirmationTime: '2024-01-15T10:32:00Z'
};

const ClaimDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [claim] = useState<ClaimDetail>(mockClaimDetail);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<'verified' | 'rejected'>('verified');
  const [statusComment, setStatusComment] = useState('');
  const [isRecalculatingHash, setIsRecalculatingHash] = useState(false);
  const [hashVerificationResult, setHashVerificationResult] = useState<'valid' | 'invalid' | null>(null);

  const handleStatusUpdate = () => {
    // In production, this would update the claim status via API
    console.log(`Updating claim ${id} to ${newStatus} with comment: ${statusComment}`);
    // Show success message or update UI
    alert(`Claim ${id} has been ${newStatus} successfully!`);
    setShowStatusModal(false);
  };

  const handleRecalculateHash = async () => {
    setIsRecalculatingHash(true);
    
    // Simulate hash recalculation process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // In production, this would recalculate the actual hash
      const isValid = Math.random() > 0.1; // 90% chance of valid hash for demo
      setHashVerificationResult(isValid ? 'valid' : 'invalid');
      
      if (isValid) {
        alert('Hash verification successful! All images are authentic.');
      } else {
        alert('Hash verification failed! Some images may have been tampered with.');
      }
    } catch (error) {
      alert('Error recalculating hash. Please try again.');
    } finally {
      setIsRecalculatingHash(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: <Clock className="w-4 h-4" />,
        text: 'Pending Review' 
      },
      verified: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Verified' 
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: <XCircle className="w-4 h-4" />,
        text: 'Rejected' 
      }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/claims')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Claim Details</h1>
          <p className="text-gray-600">Claim ID: {claim.id}</p>
        </div>
        {claim.status === 'pending' && (
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Status
          </button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Claim Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Reported At</p>
                  <p className="font-medium">{formatDate(claim.timestamp)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{claim.location}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Claim Hash</p>
                  <p className="font-mono text-sm">{claim.hash}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Detection Type</p>
                  <p className="font-medium capitalize">{claim.detectionType}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{claim.description}</p>
            </div>
          </div>

          {/* Evidence Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Evidence Images</h3>
              <div className="flex items-center text-sm text-gray-600">
                <ImageIcon className="w-4 h-4 mr-1" />
                {claim.images.length} images
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {claim.images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={`Evidence ${image.id}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => setSelectedImage(image.url)}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Taken: {formatDate(image.timestamp)}</span>
                      <button className="hover:text-gray-700">
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs font-mono text-gray-400 truncate">
                      Hash: {image.hash}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accident Location</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p>Interactive map would be displayed here</p>
                <p className="text-sm">Coordinates: {claim.coordinates.lat}, {claim.coordinates.lng}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            
            <div className={`flex items-center px-3 py-2 rounded-lg border ${getStatusConfig(claim.status).color}`}>
              {getStatusConfig(claim.status).icon}
              <span className="ml-2 font-medium">{getStatusConfig(claim.status).text}</span>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Severity:</span>
                <span className={`font-medium capitalize ${
                  claim.severity === 'high' ? 'text-red-600' :
                  claim.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`}>
                  {claim.severity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-medium">{claim.userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Confirmed:</span>
                <span className="font-medium">{formatDate(claim.confirmationTime)}</span>
              </div>
            </div>
          </div>

          {/* Hash Verification */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hash Verification</h3>
            
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-3 rounded-lg border ${
                hashVerificationResult === 'invalid' 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center">
                  {hashVerificationResult === 'invalid' ? (
                    <XCircle className="w-4 h-4 text-red-600 mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  )}
                  <span className={`text-sm font-medium ${
                    hashVerificationResult === 'invalid' ? 'text-red-800' : 'text-green-800'
                  }`}>
                    Hash {hashVerificationResult === 'invalid' ? 'Invalid' : 'Valid'}
                  </span>
                </div>
              </div>
              
              <div className="text-xs font-mono text-gray-500 break-all p-2 bg-gray-50 rounded">
                Original: {claim.hash}
              </div>
              
              <div className="text-xs font-mono text-gray-500 break-all p-2 bg-gray-50 rounded">
                Computed: {claim.hash}
              </div>
              
              <button 
                onClick={handleRecalculateHash}
                disabled={isRecalculatingHash}
                className="w-full px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isRecalculatingHash ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Recalculating...
                  </>
                ) : (
                  'Recalculate Hash'
                )}
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Claim Submitted</p>
                  <p className="text-xs text-gray-500">{formatDate(claim.timestamp)}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Evidence Uploaded</p>
                  <p className="text-xs text-gray-500">{formatDate(claim.confirmationTime)}</p>
                </div>
              </div>
              
              {claim.status !== 'pending' && (
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    claim.status === 'verified' ? 'bg-green-600' : 'bg-red-600'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium">Claim {claim.status}</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Evidence"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Claim Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as 'verified' | 'rejected')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment (Optional)</label>
                <textarea
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a comment about your decision..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimDetailPage;