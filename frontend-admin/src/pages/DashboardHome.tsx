import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Loader,
  TrendingUp,
  AlertCircle,
  Server,
  Database,
  Zap,
} from 'lucide-react';
import { useClaims } from '../hooks/useClaims';
import { useStatistics, useTodayActivity } from '../hooks/useStatistics';
import { ClaimStatus } from '../types/api';
import { format } from 'date-fns';

interface SystemStatus {
  api: 'online' | 'offline' | 'unknown';
  database: 'healthy' | 'degraded' | 'offline';
  sync: 'active' | 'inactive';
}

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, change, changeType, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        <p
          className={`text-sm mt-1 ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}
        >
          {changeType === 'increase' ? '↗' : '↘'} {change} from last period
        </p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    </div>
  </div>
);

const RecentClaim: React.FC<{
  id: number;
  status: ClaimStatus;
  location: string;
  time: string;
}> = ({ id, status, location, time }) => {
  const statusConfig = {
    PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
    VERIFIED: { color: 'bg-green-100 text-green-800', text: 'Verified' },
    REJECTED: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
    RESOLVED: { color: 'bg-blue-100 text-blue-800', text: 'Resolved' },
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Claim #{id}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </div>
        </div>
      </div>
      <div className="text-right">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}
        >
          {statusConfig[status].text}
        </span>
        <p className="text-sm text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

const SystemStatusIndicator: React.FC<{
  label: string;
  status: 'online' | 'offline' | 'unknown' | 'healthy' | 'degraded' | 'active' | 'inactive';
  icon: React.ReactNode;
}> = ({ label, status, icon }) => {
  const getColor = () => {
    switch (status) {
      case 'online':
      case 'healthy':
      case 'active':
        return 'text-green-600';
      case 'offline':
      case 'inactive':
        return 'text-red-600';
      case 'degraded':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBgColor = () => {
    switch (status) {
      case 'online':
      case 'healthy':
      case 'active':
        return 'bg-green-500';
      case 'offline':
      case 'inactive':
        return 'bg-red-500';
      case 'degraded':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 text-gray-600">
        {icon}
        <span>{label}</span>
      </div>
      <span className={`flex items-center ${getColor()}`}>
        <div className={`w-2 h-2 ${getBgColor()} rounded-full mr-2`}></div>
        <span className="capitalize text-sm font-medium">{status}</span>
      </span>
    </div>
  );
};

const DashboardHome: React.FC = () => {
  const { data: claims = [], isLoading: claimsLoading, error: claimsError } = useClaims();
  const {
    data: statistics,
    isLoading: statsLoading,
    error: statsError,
  } = useStatistics();
  const {
    data: todayActivity,
    isLoading: todayLoading,
    error: todayError,
  } = useTodayActivity();

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    api: 'unknown',
    database: 'healthy',
    sync: 'inactive',
  });

  const isLoading = claimsLoading || statsLoading || todayLoading;
  const error = claimsError || statsError || todayError;

  // Check system health based on data availability
  useEffect(() => {
    const checkSystemHealth = () => {
      // API is online if we can fetch data
      const apiOnline = !claimsError && !statsError ? 'online' : 'offline';

      // Database is healthy if statistics are available
      const dbHealthy = statistics ? 'healthy' : 'degraded';

      // Sync is active if today's activity data is available
      const syncActive = todayActivity ? 'active' : 'inactive';

      setSystemStatus({
        api: apiOnline as 'online' | 'offline',
        database: dbHealthy as 'healthy' | 'degraded',
        sync: syncActive as 'active' | 'inactive',
      });
    };

    checkSystemHealth();
  }, [statistics, todayActivity, claimsError, statsError, todayError]);

  // Calculate all statistics dynamically
  const {
    totalClaims,
    verifiedClaims,
    pendingClaims,
    rejectedClaims,
    resolvedClaims,
    percentageChanges,
  } = useMemo(() => {
    // Use backend statistics if available, otherwise calculate from claims
    const total = statistics?.totalClaims || claims.length;
    const verified =
      statistics?.verifiedClaims || claims.filter((c) => c.status === ClaimStatus.VERIFIED).length;
    const pending =
      statistics?.pendingClaims || claims.filter((c) => c.status === ClaimStatus.PENDING).length;
    const rejected =
      statistics?.rejectedClaims || claims.filter((c) => c.status === ClaimStatus.REJECTED).length;
    const resolved =
      statistics?.resolvedClaims || claims.filter((c) => c.status === ClaimStatus.RESOLVED).length;

    // Use percentages from backend, or fallback to frontend calculation
    const changes = {
      verified: `${statistics?.verifiedPercentage ?? ((total > 0 ? (verified / total) * 100 : 0).toFixed(1))}%`,
      pending: `${statistics?.pendingPercentage ?? ((total > 0 ? (pending / total) * 100 : 0).toFixed(1))}%`,
      rejected: `${statistics?.rejectedPercentage ?? ((total > 0 ? (rejected / total) * 100 : 0).toFixed(1))}%`,
      resolved: `${statistics?.resolvedPercentage ?? ((total > 0 ? (resolved / total) * 100 : 0).toFixed(1))}%`,
    };

    return {
      totalClaims: total,
      verifiedClaims: verified,
      pendingClaims: pending,
      rejectedClaims: rejected,
      resolvedClaims: resolved,
      percentageChanges: changes,
    };
  }, [statistics, claims]);

  const stats = [
    {
      title: 'Total Claims',
      value: totalClaims.toString(),
      change: percentageChanges.verified,
      changeType: 'increase' as const,
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100',
    },
    {
      title: 'Verified Claims',
      value: verifiedClaims.toString(),
      change: percentageChanges.verified,
      changeType: 'increase' as const,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100',
    },
    {
      title: 'Pending Claims',
      value: pendingClaims.toString(),
      change: percentageChanges.pending,
      changeType: (pendingClaims > totalClaims * 0.3 ? 'increase' : 'decrease') as const,
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-100',
    },
    {
      title: 'Rejected Claims',
      value: rejectedClaims.toString(),
      change: percentageChanges.rejected,
      changeType: 'decrease' as const,
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      color: 'bg-red-100',
    },
  ];

  // Get recent claims (last 5)
  const recentClaims = useMemo(() => {
    return claims
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((claim) => ({
        id: claim.id,
        status: claim.status,
        location: claim.location,
        time: format(new Date(claim.createdAt), 'MMM dd, HH:mm'),
      }));
  }, [claims]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-red-800 font-medium">Error loading dashboard data</p>
          <p className="text-red-700 text-sm mt-1">
            Please refresh the page or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600 mt-1">Monitor your claims and system performance</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Last updated:</span>
          <span className="font-medium">{format(new Date(), 'MMM dd, HH:mm')}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Claims */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Claims</h3>
                <Link
                  to="/claims"
                  className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-2">
              {recentClaims.length > 0 ? (
                recentClaims.map((claim) => <RecentClaim key={claim.id} {...claim} />)
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No recent claims</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Today's Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Activity</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">New Claims</span>
                <span className="font-semibold">{todayActivity?.newClaims || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processed</span>
                <span className="font-semibold">{todayActivity?.processed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verified</span>
                <span className="font-semibold text-green-600">{todayActivity?.verified || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rejected</span>
                <span className="font-semibold text-red-600">{todayActivity?.rejected || 0}</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <SystemStatusIndicator
                label="API Status"
                status={systemStatus.api}
                icon={<Zap className="w-4 h-4" />}
              />
              <SystemStatusIndicator
                label="Database"
                status={systemStatus.database}
                icon={<Database className="w-4 h-4" />}
              />
              <SystemStatusIndicator
                label="Data Sync"
                status={systemStatus.sync}
                icon={<Server className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;