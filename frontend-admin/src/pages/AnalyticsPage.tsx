import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  FileText,
  MapPin,
  Calendar,
  BarChart3,
  Loader
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useStatistics } from '../hooks/useStatistics';
import { useUsers } from '../hooks/useUsers';
import { useClaims } from '../hooks/useClaims';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  const [showMapModal, setShowMapModal] = useState(false);

  // Convert period string to days
  const periodInDays = selectedPeriod === '7d' ? 7
    : selectedPeriod === '30d' ? 30
      : selectedPeriod === '90d' ? 90
        : 365;

  const { data: statistics, isLoading, error } = useStatistics(periodInDays);
  const { data: users = [] } = useUsers();
  const { data: claims = [] } = useClaims();

  // Group claims by location with coordinates
  const locationData = useMemo(() => {
    const locationMap = new Map<string, { location: string; lat: number; lng: number; count: number }>();

    claims.forEach(claim => {
      const key = claim.location;
      if (locationMap.has(key)) {
        locationMap.get(key)!.count += 1;
      } else {
        locationMap.set(key, {
          location: claim.location,
          lat: claim.latitude,
          lng: claim.longitude,
          count: 1
        });
      }
    });

    return Array.from(locationMap.values()).sort((a, b) => b.count - a.count);
  }, [claims]);

  const handleExport = () => {
    if (!statistics) return;

    // Create CSV content
    const csvContent = [
      // Header
      ['Analytics Report', '', '', `Period: Last ${selectedPeriod}`],
      ['Generated:', new Date().toLocaleString()],
      [''],

      // KPIs
      ['Key Performance Indicators'],
      ['Metric', 'Value', 'Change'],
      ['Total Claims', statistics.totalClaims, `${statistics.totalClaimsChange?.toFixed(1)}%`],
      ['Verification Rate', `${statistics.verificationRate.toFixed(1)}%`, `${statistics.verificationRateChange?.toFixed(1)}%`],
      ['Active Users', users.length, `${statistics.activeUsersChange?.toFixed(1)}%`],
      ['Avg Processing Time', `${statistics.processingMetrics?.averageProcessingTimeHours?.toFixed(1)}h`, statistics.processingMetrics?.targetMet ? 'On Target' : 'Over Target'],
      [''],

      // Claims by Status
      ['Claims by Status'],
      ['Status', 'Count', 'Percentage'],
      ['Verified', statistics.verifiedClaims, `${statistics.verifiedPercentage}%`],
      ['Pending', statistics.pendingClaims, `${statistics.pendingPercentage}%`],
      ['Rejected', statistics.rejectedClaims, `${statistics.rejectedPercentage}%`],
      [''],

      // Claims by Severity
      ['Claims by Severity'],
      ['Severity', 'Count'],
      ...Object.entries(statistics.claimsBySeverity).map(([severity, count]) => [severity, count]),
      [''],

      // Top Locations
      ['Top Claim Locations'],
      ['Location', 'Count'],
      ...statistics.topLocations.map(loc => [loc.location, loc.claimCount]),
      [''],

      // Weekly Activity
      ['Weekly Activity'],
      ['Metric', 'Value'],
      ['New Claims', statistics.weeklyActivity?.newClaims || 0],
      ['Processed', statistics.weeklyActivity?.processed || 0],
      ['Verified', statistics.weeklyActivity?.verified || 0],
      ['Rejected', statistics.weeklyActivity?.rejected || 0],
      ['Backlog', statistics.weeklyActivity?.backlog || 0],
    ].map(row => row.map(cell => {
      const str = String(cell);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')).join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-semibold">Error loading analytics</p>
        <p className="text-red-700 text-sm mt-2">
          {error instanceof Error ? error.message : 'Please ensure you are logged in and try again later.'}
        </p>
        {(error as any)?.response?.status === 401 && (
          <p className="text-red-700 text-sm mt-2">You need to be logged in to view analytics.</p>
        )}
      </div>
    );
  }

  const kpis: KPI[] = [
    {
      title: 'Total Claims',
      value: statistics?.totalClaims?.toString() || '0',
      change: `${statistics?.totalClaimsChange || 0 >= 0 ? '+' : ''}${statistics?.totalClaimsChange?.toFixed(1) || '0'}%`,
      changeType: (statistics?.totalClaimsChange || 0) >= 0 ? 'increase' : 'decrease',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Verification Rate',
      value: `${statistics?.verificationRate?.toFixed(1) || '0'}%`,
      change: `${statistics?.verificationRateChange || 0 >= 0 ? '+' : ''}${statistics?.verificationRateChange?.toFixed(1) || '0'}%`,
      changeType: (statistics?.verificationRateChange || 0) >= 0 ? 'increase' : 'decrease',
      icon: <Activity className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Active Users',
      value: users.length.toString(),
      change: `${statistics?.activeUsersChange || 0 >= 0 ? '+' : ''}${statistics?.activeUsersChange?.toFixed(1) || '0'}%`,
      changeType: (statistics?.activeUsersChange || 0) >= 0 ? 'increase' : 'decrease',
      icon: <Users className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-100'
    },
    {
      title: 'Avg. Processing Time',
      value: `${statistics?.processingMetrics?.averageProcessingTimeHours?.toFixed(1) || '0'}h`,
      change: statistics?.processingMetrics?.targetMet ? '✓ On Target' : '⚠ Over Target',
      changeType: statistics?.processingMetrics?.targetMet ? 'decrease' : 'increase',
      icon: <Activity className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-100'
    }
  ];

  // Convert time series data from API
  const claimsByTime: ChartData[] = statistics?.claimsByTimePeriod?.map(item => ({
    name: item.period,
    value: item.count
  })) || [];

  // Convert severity data from API
  const claimsBySeverity: ChartData[] = statistics?.claimsBySeverity
    ? Object.entries(statistics.claimsBySeverity).map(([name, value]) => ({
      name: name.charAt(0) + name.slice(1).toLowerCase(),
      value: value
    }))
    : [];

  // Convert top locations from API
  const topLocations = statistics?.topLocations?.map(loc => ({
    location: loc.location,
    claims: loc.claimCount
  })) || [];

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
            <span className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'
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
          <button
            onClick={handleExport}
            disabled={!statistics}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
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
            <button
              onClick={() => setShowMapModal(true)}
              className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
            >
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
                <span className="font-semibold">{statistics?.processingMetrics?.averageProcessingTimeHours?.toFixed(2) || '0'}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fastest</span>
                <span className="font-semibold text-green-600">{statistics?.processingMetrics?.fastestTimeMinutes?.toFixed(0) || '0'}m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Slowest</span>
                <span className="font-semibold text-red-600">{statistics?.processingMetrics?.slowestTimeHours?.toFixed(1) || '0'}h</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Target: &lt;{statistics?.processingMetrics?.targetTimeHours || 3}h</span>
                  <span className={`font-medium ${statistics?.processingMetrics?.targetMet ? 'text-green-600' : 'text-red-600'}`}>
                    {statistics?.processingMetrics?.targetMet ? '✓ Met' : '⚠ Not Met'}
                  </span>
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
                <span className="font-semibold">{statistics?.weeklyActivity?.newClaims || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processed</span>
                <span className="font-semibold">{statistics?.weeklyActivity?.processed || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verified</span>
                <span className="font-semibold text-green-600">{statistics?.weeklyActivity?.verified || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rejected</span>
                <span className="font-semibold text-red-600">{statistics?.weeklyActivity?.rejected || '0'}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Backlog</span>
                  <span className="font-semibold">{statistics?.weeklyActivity?.backlog || '0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Claim Locations Map</h2>
                <p className="text-sm text-gray-600 mt-1">Geographic distribution of {locationData.length} locations</p>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {locationData.length > 0 ? (
                <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
                  <MapContainer
                    center={[locationData[0].lat, locationData[0].lng]}
                    zoom={6}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locationData.map((location, index) => (
                      <CircleMarker
                        key={index}
                        center={[location.lat, location.lng]}
                        radius={Math.min(10 + location.count * 2, 30)}
                        fillColor="#3B82F6"
                        fillOpacity={0.6}
                        color="#1E40AF"
                        weight={2}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold text-gray-900 mb-2">{location.location}</h3>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center text-gray-600">
                                <FileText className="w-4 h-4 mr-2" />
                                <span>{location.count} claims</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No location data available</p>
                </div>
              )}

              {/* Location Legend */}
              {locationData.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Top Locations</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {locationData.slice(0, 6).map((location, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full bg-blue-600"
                            style={{ opacity: 0.6 }}
                          />
                          <span className="text-sm text-gray-700">{location.location}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{location.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AnalyticsPage;