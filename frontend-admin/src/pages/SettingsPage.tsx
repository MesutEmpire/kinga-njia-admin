import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Download,
  Upload,
  Users,
  Activity,
  Save,
  RefreshCw,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAlertDialog } from '../components/ui/AlertDialog';
import { useSettings } from '../hooks/useSettings';
import { notificationService } from '../api/services/notifications';
import { NotificationType } from '../types/api';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showAlert } = useAlertDialog();
  const { settings, isLoading: settingsLoading, updateSettings, isUpdating } = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    NEW_CLAIM: true,
    STATUS_UPDATE: true,
    SYSTEM_ALERT: true,
    DAILY_REPORT: false,
    WEEKLY_REPORT: true,
    ASSIGNMENT: true,
    COMMENT: true,
  });

  const [profileData, setProfileData] = useState({
    organizationName: '',
    organizationEmail: '',
    organizationPhone: '',
    organizationAddress: ''
  });

  const [detectionSettings, setDetectionSettings] = useState({
    emailNotificationsEnabled: false,
    systemAlertNotifications: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    sessionTimeoutMinutes: 240,
    dataRetentionDays: 365,
    backupFrequency: 'daily'
  });

  // Load settings on mount
  useEffect(() => {
    if (settings && settings.id) {
      setProfileData({
        organizationName: settings.organizationName || '',
        organizationEmail: settings.organizationEmail || '',
        organizationPhone: settings.organizationPhone || '',
        organizationAddress: settings.organizationAddress || ''
      });
      setDetectionSettings({
        emailNotificationsEnabled: settings.emailNotificationsEnabled || false,
        systemAlertNotifications: settings.systemAlertNotifications || true,
      });
      setSystemSettings({
        sessionTimeoutMinutes: settings.sessionTimeoutMinutes || 240,
        dataRetentionDays: settings.dataRetentionDays || 365,
        backupFrequency: settings.backupFrequency || 'daily'
      });
    }
  }, [settings]);

  // Load notification preferences on mount
  useEffect(() => {
    if (user?.id) {
      loadNotificationPreferences();
    }
  }, [user?.id]);

  const loadNotificationPreferences = async () => {
    try {
      setLoading(true);
      const userNotifications = await notificationService.getUserNotifications(user!.id);
      const prefs: any = {};
      Object.values(NotificationType).forEach(type => {
        const notification = userNotifications.find(n => n.type === type);
        prefs[type] = notification?.isEnabled ?? true;
      });
      setNotifications(prefs);
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async (type: NotificationType, enabled: boolean) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      await notificationService.togglePreference(user.id, type, enabled);
      setNotifications(prev => ({
        ...prev,
        [type]: enabled
      }));
      showAlert({
        title: 'Preferences Updated',
        message: 'Notification preferences saved successfully.',
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to update notification preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'detection', name: 'Detection', icon: Activity },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'data', name: 'Data Management', icon: Download }
  ];

  const TabButton: React.FC<{
    tab: typeof tabs[0];
    isActive: boolean;
    onClick: () => void
  }> = ({ tab, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors ${isActive
        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
        : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      <tab.icon className="w-5 h-5 mr-3" />
      {tab.name}
    </button>
  );

  const SettingCard: React.FC<{
    title: string;
    description: string;
    children: React.ReactNode
  }> = ({ title, description, children }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      {children}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <SettingCard
              title="User Profile"
              description="Your account information and role"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user?.role?.toUpperCase().replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Created:</span>
                    <span className="font-medium">{new Date(user?.createdAt || '').toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="System Information"
              description="View basic system information and status"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium">v2.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Update:</span>
                    <span className="font-medium">Jan 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Environment:</span>
                    <span className="font-medium">Production</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Database:</span>
                    <span className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Healthy
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">API Status:</span>
                    <span className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Online
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage:</span>
                    <span className="font-medium">78% Used</span>
                  </div>
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="System Settings"
              description="Configure basic system behavior and preferences"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (hours)
                  </label>
                  <select
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => setSystemSettings({ ...systemSettings, sessionTimeout: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="4">4 hours</option>
                    <option value="8">8 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum File Size (MB)
                  </label>
                  <select
                    value={systemSettings.maxFileSize}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maxFileSize: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="5">5 MB</option>
                    <option value="10">10 MB</option>
                    <option value="25">25 MB</option>
                    <option value="50">50 MB</option>
                  </select>
                </div>
              </div>
            </SettingCard>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <SettingCard
              title="Notification Preferences"
              description="Configure what notifications you want to receive"
            >
              <div className="space-y-4">
                {Object.entries(notifications).map(([type, enabled]) => {
                  const getDescription = (t: string) => {
                    const descriptions: { [key: string]: string } = {
                      NEW_CLAIM: 'Get notified when new claims are submitted',
                      STATUS_UPDATE: 'Receive updates when claim statuses change',
                      SYSTEM_ALERT: 'Important system notifications and alerts',
                      DAILY_REPORT: 'Daily summary reports sent to your email',
                      WEEKLY_REPORT: 'Weekly analytics and performance reports',
                      ASSIGNMENT: 'Get notified when claims are assigned to you',
                      COMMENT: 'Receive notifications for new comments on your claims'
                    };
                    return descriptions[t] || '';
                  };

                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {getDescription(type)}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          disabled={loading}
                          onChange={(e) => handleNotificationChange(type as NotificationType, e.target.checked)}
                          className="sr-only peer disabled:opacity-50"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </SettingCard>
          </div>
        );

      case 'detection':
        return (
          <div className="space-y-6">
            <SettingCard
              title="Accident Detection Settings"
              description="Configure how the mobile app detects and processes accidents"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detection Sensitivity
                  </label>
                  <select
                    value={detectionSettings.sensitivity}
                    onChange={(e) => setDetectionSettings({ ...detectionSettings, sensitivity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low - Fewer false positives</option>
                    <option value="medium">Medium - Balanced detection</option>
                    <option value="high">High - Catches more incidents</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Auto-process Claims</p>
                      <p className="text-sm text-gray-600">Automatically verify low-risk claims</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={detectionSettings.autoProcess}
                        onChange={(e) => setDetectionSettings({ ...detectionSettings, autoProcess: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Require Manual Review</p>
                      <p className="text-sm text-gray-600">All claims need staff approval</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={detectionSettings.requireManualReview}
                        onChange={(e) => setDetectionSettings({ ...detectionSettings, requireManualReview: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Hash Validation</p>
                      <p className="text-sm text-gray-600">Verify image integrity using cryptographic hashes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={detectionSettings.hashValidation}
                        onChange={(e) => setDetectionSettings({ ...detectionSettings, hashValidation: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </SettingCard>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <SettingCard
              title="Security Settings"
              description="Manage security policies and access controls"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Password Policy</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Minimum 8 characters</li>
                      <li>• Must contain uppercase and lowercase letters</li>
                      <li>• Must contain at least one number</li>
                      <li>• Password expires every 90 days</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Enable 2FA for all users</p>
                      <p className="text-sm text-gray-600">Require second factor for login</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Configure
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Access Logs</h4>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">View recent login activity</p>
                      <p className="text-sm text-gray-600">Monitor user access and security events</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            </SettingCard>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <SettingCard
              title="Data Export"
              description="Export claims data for analysis or compliance"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Export All Claims</p>
                    <p className="text-sm text-gray-600">Download complete claims database as CSV</p>
                  </div>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Export Analytics Report</p>
                    <p className="text-sm text-gray-600">Generate comprehensive analytics PDF</p>
                  </div>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </button>
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="Data Retention"
              description="Configure how long data is stored in the system"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Retention Period (days)
                  </label>
                  <select
                    value={systemSettings.retentionPeriod}
                    onChange={(e) => setSystemSettings({ ...systemSettings, retentionPeriod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">1 year</option>
                    <option value="1095">3 years</option>
                    <option value="1825">5 years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={systemSettings.backupFrequency}
                    onChange={(e) => setSystemSettings({ ...systemSettings, backupFrequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </SettingCard>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSaveSettings = () => {
    updateSettings({
      organizationName: profileData.organizationName,
      organizationEmail: profileData.organizationEmail,
      organizationPhone: profileData.organizationPhone,
      organizationAddress: profileData.organizationAddress,
      emailNotificationsEnabled: detectionSettings.emailNotificationsEnabled,
      systemAlertNotifications: detectionSettings.systemAlertNotifications,
      sessionTimeoutMinutes: systemSettings.sessionTimeoutMinutes,
      dataRetentionDays: systemSettings.dataRetentionDays,
      backupFrequency: systemSettings.backupFrequency,
    }, {
      onSuccess: () => {
        showAlert({
          title: 'Settings Saved',
          message: 'Your settings have been saved successfully!',
          type: 'success'
        });
      },
      onError: () => {
        showAlert({
          title: 'Save Failed',
          message: 'Failed to save settings. Please try again.',
          type: 'error'
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600 mt-1">Configure system preferences and policies</p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;