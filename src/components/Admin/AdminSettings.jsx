import React, { useState, useEffect } from "react";
import { FaSave, FaBell, FaShieldAlt, FaCreditCard, FaGlobe, FaToggleOn, FaToggleOff } from "react-icons/fa";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: "Shopify Store",
    storeEmail: "support@shopify.com",
    storePhone: "+1 234-567-8900",
    storeAddress: "123 Main St, San Francisco, CA",
    currency: "USD",
    timezone: "America/Los_Angeles",
    maintenanceMode: false,
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      ipWhitelist: ""
    }
  });

  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const savedSettings = localStorage.getItem("adminSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [category, field] = name.split('.');
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("adminSettings", JSON.stringify(settings));
      setIsSaving(false);
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    }, 1000);
  };

  const toggleMaintenance = () => {
    setSettings(prev => ({
      ...prev,
      maintenanceMode: !prev.maintenanceMode
    }));
  };

  const tabs = [
    { id: "general", label: "General", icon: "⚙️" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "payment", label: "Payment", icon: "💳" }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
          Configure your store settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="flex overflow-x-auto border-b dark:border-gray-700">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 md:px-6 py-3 
              md:py-4 font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
              }`}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 md:p-6">

          {/* Save Message */}
          {saveMessage && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg 
            flex items-center justify-between">
              <span>{saveMessage}</span>
              <button onClick={() => setSaveMessage("")}>×</button>
            </div>
          )}

          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Store Name</label>
                  <input type="text" name="storeName" value={settings.storeName} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 
                    focus:ring-primary focus:border-transparent"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Store Email</label>
                  <input type="email" name="storeEmail" value={settings.storeEmail} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 
                    focus:ring-primary focus:border-transparent"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Store Phone</label>
                  <input type="text" name="storePhone" value={settings.storePhone} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 
                    focus:ring-primary focus:border-transparent"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select name="currency" value={settings.currency} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 
                    focus:ring-primary focus:border-transparent">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Store Address</label>
                <textarea name="storeAddress" value={settings.storeAddress} onChange={handleInputChange} rows="3"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 
                  focus:ring-primary focus:border-transparent resize-none"/>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <select name="timezone"
                  value={settings.timezone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Asia/Kolkata">India (IST)</option>
                </select>
              </div>

              {/* Maintenance Mode */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                      Maintenance Mode
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Temporarily disable public access to your store
                    </p>
                  </div>
                  <button
                    onClick={toggleMaintenance}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium ${
                      settings.maintenanceMode
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}
                  >
                    {settings.maintenanceMode ? (
                      <>
                        <FaToggleOn className="text-xl" />
                        <span>Enabled</span>
                      </>
                    ) : (
                      <>
                        <FaToggleOff className="text-xl" />
                        <span>Disabled</span>
                      </>
                    )}
                  </button>
                </div>
                {settings.maintenanceMode && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                      ⚠️ Your store is currently in maintenance mode. Customers will see a maintenance page.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                {[
                  { 
                    id: 'email', 
                    label: 'Email Notifications', 
                    description: 'Receive order updates and alerts via email',
                    icon: <FaBell />
                  },
                  { 
                    id: 'sms', 
                    label: 'SMS Notifications', 
                    description: 'Get important alerts via SMS',
                    icon: <FaBell />
                  },
                  { 
                    id: 'push', 
                    label: 'Push Notifications', 
                    description: 'Browser push notifications for real-time updates',
                    icon: <FaBell />
                  }
                ].map(notification => (
                  <div key={notification.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="text-primary">
                        {notification.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{notification.label}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{notification.description}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name={`notifications.${notification.id}`}
                        checked={settings.notifications[notification.id]}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 md:p-6">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  💡 Notification Tips
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
                  <li>• Email notifications are recommended for all store owners</li>
                  <li>• SMS notifications work best for time-sensitive alerts</li>
                  <li>• Push notifications require browser permission</li>
                </ul>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">
                Security Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl gap-4">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="security.twoFactorAuth"
                      checked={settings.security.twoFactorAuth}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <label className="block text-sm font-medium mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="range"
                    name="security.sessionTimeout"
                    min="5"
                    max="120"
                    step="5"
                    value={settings.security.sessionTimeout}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span>5 min</span>
                    <span className="font-medium">{settings.security.sessionTimeout} min</span>
                    <span>120 min</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <label className="block text-sm font-medium mb-2">
                    IP Whitelist (Optional)
                  </label>
                  <textarea
                    name="security.ipWhitelist"
                    value={settings.security.ipWhitelist}
                    onChange={handleInputChange}
                    placeholder="Enter IP addresses separated by commas"
                    rows="3"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Only these IP addresses will be allowed to access the admin panel
                  </p>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 md:p-6">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                  🔒 Security Recommendations
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-400 space-y-2">
                  <li>• Enable Two-Factor Authentication for enhanced security</li>
                  <li>• Regularly update your password</li>
                  <li>• Only whitelist trusted IP addresses</li>
                  <li>• Review login activity regularly</li>
                </ul>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">
                Payment Gateway Settings
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    id: 'stripe',
                    name: 'Stripe',
                    status: 'connected',
                    description: 'Credit card payments'
                  },
                  {
                    id: 'paypal',
                    name: 'PayPal',
                    status: 'connected',
                    description: 'PayPal and card payments'
                  },
                  {
                    id: 'razorpay',
                    name: 'Razorpay',
                    status: 'disconnected',
                    description: 'Popular in India'
                  }
                ].map(gateway => (
                  <div key={gateway.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <FaCreditCard className="text-gray-700 dark:text-gray-300" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{gateway.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{gateway.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        gateway.status === 'connected'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {gateway.status === 'connected' ? 'Connected' : 'Disconnected'}
                      </span>
                      <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition">
                        {gateway.status === 'connected' ? 'Configure' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 md:p-6">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  💰 Payment Tips
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-400 space-y-2">
                  <li>• Connect multiple payment gateways for better conversion</li>
                  <li>• Test transactions in sandbox mode first</li>
                  <li>• Enable webhook URLs for real-time updates</li>
                  <li>• Keep API keys secure and rotate regularly</li>
                </ul>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-6 border-t dark:border-gray-700">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FaGlobe className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Domain</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">shopify-store.com</p>
            </div>
          </div>
          <button className="w-full py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            Configure Domain
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <FaShieldAlt className="text-purple-600 dark:text-purple-400 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Backup</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Last backup: 2 days ago</p>
            </div>
          </div>
          <button className="w-full py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition">
            Create Backup
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FaCreditCard className="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Billing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Next charge: Jan 15</p>
            </div>
          </div>
          <button className="w-full py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            View Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;