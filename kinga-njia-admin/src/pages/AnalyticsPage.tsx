import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  FileText,
  MapPin,
  Calendar,
  BarChart3
} from 'lucide-react';

interface KPI {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
}

const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const kpis: KPI[] = [
    {
      title: 'Total Claims',
      value: '1,247',
      change: '+12.5%',
      changeType: 'increase',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Verification Rate',
      value: '71.5%',
      change: '+3.2%',
      changeType: 'increase',
      icon: <Activity className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Active Users',
      value: '892',
      change: '+8.1%',
      changeType: 'increase',
      icon: <Users className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-100'
    },
    {
      title: 'Avg. Processing Time',
      value: '2.4h',
      change: '-15.3%',
      changeType: 'decrease',
      icon: <Activity className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-100'
    }
  ];

  const claimsByTime: ChartData[] = [
    { name: 'Jan', value: 65 },
    { name: 'Feb', value: 78 },
    { name: 'Mar', value: 90 },
    { name: 'Apr', value: 81 },
    { name: 'May', value: 95 },
    { name: 'Jun', value: 112 },
    { name: 'Jul', value: 108 }
  ];

  const claimsBySeverity: ChartData[] = [
    { name: 'Low', value: 512 },
    { name: 'Medium', value: 423 },
    { name: 'High', value: 312 }
  ];

  const topLocations = [
    { location: 'Victoria Island, Lagos', claims: 156, change: '+12%' },
    { location: 'Ikeja GRA, Lagos', claims: 134, change: '+8%' },
    { location: 'Lekki Phase 1, Lagos', claims: 98, change: '+15%' },
    { location: 'Surulere, Lagos', claims: 87, change: '+5%' },
    { location: 'Yaba, Lagos', claims: 73, change: '-2%' }
  ];

  const KPICard: React.FC<KPI> = ({ title, value, change, changeType, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-2">
            {changeType === 'increase' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const BarChart: React.FC<{ data: ChartData[]; title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-16 text-sm text-gray-600 flex-shrink-0">{item.name}</div>
              <div className="flex-1 mx-3">
                <div className="bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  >
                    <span className="text-white text-xs font-medium">{item.value}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Monitor claims trends and system performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Claims Over Time */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Claims Over Time</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              Monthly
            </div>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {claimsByTime.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-600 rounded-t-lg min-h-[20px] flex items-end justify-center pb-2"
                  style={{ height: `${(item.value / Math.max(...claimsByTime.map(d => d.value))) * 200}px` }}
                >
                  <span className="text-white text-xs font-medium">{item.value}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Claims by Severity */}
        <BarChart data={claimsBySeverity} title="Claims by Severity" />
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Locations */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Claim Locations</h3>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View Map
            </button>
          </div>
          <div className="space-y-4">
            {topLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{location.location}</p>
                    <p className="text-sm text-gray-500">{location.claims} claims</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    location.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {location.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-6">
          
          {/* Processing Speed */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Speed</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Time</span>
                <span className="font-semibold">2h 24m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fastest</span>
                <span className="font-semibold text-green-600">18m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Slowest</span>
                <span className="font-semibold text-red-600">8h 45m</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Target: &lt;3h</span>
                  <span className="text-green-600 font-medium">✓ Met</span>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">New Claims</span>
                <span className="font-semibold">127</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processed</span>
                <span className="font-semibold">134</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verified</span>
                <span className="font-semibold text-green-600">96</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rejected</span>
                <span className="font-semibold text-red-600">38</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Backlog</span>
                  <span className="font-semibold">-7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;