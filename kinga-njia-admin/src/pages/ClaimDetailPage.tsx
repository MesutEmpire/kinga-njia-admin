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
  Shield,
  Loader,
  User
} from 'lucide-react';
import { useClaim, useUpdateClaim } from '../hooks/useClaims';
import { useImagesByClaim } from '../hooks/useImages';
import { ClaimStatus, SeverityLevel } from '../types/api';
import { format } from 'date-fns';

const ClaimDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const claimId = id ? parseInt(id) : 0;

  const { data: claim, isLoading: claimLoading, error: claimError } = useClaim(claimId);
  const { data: images = [], isLoading: imagesLoading } = useImagesByClaim(claimId);
  const updateClaimMutation = useUpdateClaim();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ClaimStatus>(ClaimStatus.VERIFIED);

  if (claimLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (claimError || !claim) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading claim details. Please try again later.</p>
      </div>
    );
  }

  const handleStatusUpdate = async () => {
    try {
      await updateClaimMutation.mutateAsync({
        id: claimId,
        data: { status: newStatus }
      });
      alert(`Claim #${claimId} has been ${newStatus.toLowerCase()} successfully!`);
      setShowStatusModal(false);
    } catch (error) {
      console.error('Error updating claim status:', error);
      alert('Failed to update claim status. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const getStatusConfig = (status: ClaimStatus) => {
    const configs = {
      [ClaimStatus.PENDING]: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="w-4 h-4" />,
        text: 'Pending Review'
      },
      [ClaimStatus.VERIFIED]: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Verified'
      },
      [ClaimStatus.REJECTED]: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="w-4 h-4" />,
        text: 'Rejected'
      },
      [ClaimStatus.RESOLVED]: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Resolved'
      }
    };
    return configs[status];
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    const configs = {
      [SeverityLevel.LOW]: 'bg-blue-100 text-blue-800',
      [SeverityLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [SeverityLevel.HIGH]: 'bg-orange-100 text-orange-800',
      [SeverityLevel.CRITICAL]: 'bg-red-100 text-red-800'
    };
    return configs[severity];
  };

  const statusConfig = getStatusConfig(claim.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/claims')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Claim Details</h1>
          <p className="text-gray-600">Claim ID: #{claim.id}</p>
        </div>
        {claim.status === ClaimStatus.PENDING && (
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Status
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Reported At</p>
                  <p className="font-medium">{formatDate(claim.createdAt)}</p>
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
                  <p className="font-mono text-xs">{claim.hash}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Detection Type</p>
                  <p className="font-medium capitalize">{claim.detectionType.toLowerCase()}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{claim.description || 'No description provided'}</p>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Coordinates</h4>
              <p className="text-sm text-gray-600">Latitude: {claim.latitude}, Longitude: {claim.longitude}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Evidence Images</h3>
              <div className="flex items-center text-sm text-gray-600">
                <ImageIcon className="w-4 h-4 mr-1" />
                {imagesLoading ? '...' : images.length} images
              </div>
            </div>

            {imagesLoading ? (
              <div className="flex justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={`Evidence ${image.id}`}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => setSelectedImage(image.url)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-full"
                      >
                        <ZoomIn className="w-5 h-5 text-gray-900" />
                      </button>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        {formatDate(image.createdAt)}
                      </p>
                      <p className="text-xs text-gray-400 font-mono truncate">
                        Hash: {image.hash}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No images uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${statusConfig.color}`}>
              {statusConfig.icon}
              <span className="font-medium">{statusConfig.text}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Level</h3>
            <div className={`px-3 py-2 rounded-lg text-center font-medium capitalize ${getSeverityBadge(claim.severity)}`}>
              {claim.severity.toLowerCase()}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reported By</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{claim.user.firstName} {claim.user.lastName}</p>
                <p className="text-sm text-gray-500">{claim.user.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Blockchain Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Claim Hash</p>
                <p className="text-xs font-mono text-gray-900 break-all">{claim.hash}</p>
              </div>
              {claim.confirmationTime && (
                <div>
                  <p className="text-sm text-gray-600">Confirmed At</p>
                  <p className="text-sm text-gray-900">{formatDate(claim.confirmationTime)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Update Claim Status</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ClaimStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={ClaimStatus.VERIFIED}>Verified</option>
                  <option value={ClaimStatus.REJECTED}>Rejected</option>
                  <option value={ClaimStatus.RESOLVED}>Resolved</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updateClaimMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {updateClaimMutation.isPending ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
          >
            <XCircle className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ClaimDetailPage;
