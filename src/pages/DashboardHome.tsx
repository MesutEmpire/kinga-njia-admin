import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Clock, XCircle, TrendingUp, MapPin } from 'lucide-react';

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
        <p className={`text-sm mt-1 ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
          {changeType === 'increase' ? '↗' : '↘'} {change} from last month
        </p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const RecentClaim: React.FC<{
  id: string;
  status: 'pending' | 'verified' | 'rejected';
  location: string;
  time: string;
}> = ({ id, status, location, time }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
    verified: { color: 'bg-green-100 text-green-800', text: 'Verified' },
    rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' }
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
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
          {statusConfig[status].text}
        </span>
        <p className="text-sm text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

const DashboardHome: React.FC = () => {
  const stats = [
    {
      title: 'Total Claims',
      value: '1,247',
      change: '+12%',
      changeType: 'increase' as const,
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Verified Claims',
      value: '892',
      change: '+8%',
      changeType: 'increase' as const,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Pending Claims',
      value: '284',
      change: '+5%',
      changeType: 'increase' as const,
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-100'
    },
    {
      title: 'Rejected Claims',
      value: '71',
      change: '-3%',
      changeType: 'decrease' as const,
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      color: 'bg-red-100'
    }
  ];

  const recentClaims = [
    { id: '2024-001', status: 'pending' as const, location: 'Downtown Lagos', time: '2 min ago' },
    { id: '2024-002', status: 'verified' as const, location: 'Victoria Island', time: '15 min ago' },
    { id: '2024-003', status: 'pending' as const, location: 'Ikeja GRA', time: '1 hour ago' },
    { id: '2024-004', status: 'rejected' as const, location: 'Lekki Phase 1', time: '2 hours ago' },
    { id: '2024-005', status: 'verified' as const, location: 'Surulere', time: '3 hours ago' }
  ];

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
          <span className="font-medium">2 minutes ago</span>
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
              {recentClaims.map((claim) => (
                <RecentClaim key={claim.id} {...claim} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          
          {/* Claims Today */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Activity</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">New Claims</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processed</span>
                <span className="font-semibold">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verified</span>
                <span className="font-semibold text-green-600">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rejected</span>
                <span className="font-semibold text-red-600">3</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Status</span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database</span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Mobile Sync</span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;