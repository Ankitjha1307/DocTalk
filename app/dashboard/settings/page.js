'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Save, LogOut } from 'lucide-react';
import { userAPI, authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
  });

  const [appSettings, setAppSettings] = useState({
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    privateProfile: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [userData, userSettings] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getSettings(),
      ]);
      setUser(userData);
      setSettings(userSettings);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        emergencyContact: userData.emergencyContact || '',
      });
      setAppSettings(userSettings || appSettings);
    } catch (err) {
      console.error('[Settings] Fetch error:', err);
      // Use mock data
      const mockUser = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-0100',
        emergencyContact: 'Sarah Doe',
      };
      setUser(mockUser);
      setFormData(mockUser);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await userAPI.updateProfile(formData);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('[Settings] Update error:', err);
      setError(`Failed to update profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await userAPI.updateSettings(appSettings);
      setSuccess('Settings updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('[Settings] Settings update error:', err);
      setError(`Failed to update settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    router.push('/');
  };

  if (loading) {
    return (
      <main className="flex-1 lg:ml-64 mt-20 p-4 sm:p-6 lg:p-8">
        <p className="text-muted-foreground">Loading settings...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 lg:ml-64 mt-20 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Success Message */}
      {success && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <p className="text-green-800">{success}</p>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Emergency Contact</label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyContact: e.target.value })
                  }
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={appSettings.notificationsEnabled}
                  onChange={(e) =>
                    setAppSettings({ ...appSettings, notificationsEnabled: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <span>Enable all notifications</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={appSettings.emailNotifications}
                  onChange={(e) =>
                    setAppSettings({ ...appSettings, emailNotifications: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <span>Email notifications</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={appSettings.smsNotifications}
                  onChange={(e) =>
                    setAppSettings({ ...appSettings, smsNotifications: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <span>SMS notifications</span>
              </label>

              <Button onClick={handleSaveSettings} disabled={saving} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={appSettings.twoFactorAuth}
                  onChange={(e) =>
                    setAppSettings({ ...appSettings, twoFactorAuth: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <span>Two-factor authentication</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={appSettings.privateProfile}
                  onChange={(e) =>
                    setAppSettings({ ...appSettings, privateProfile: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <span>Keep profile private</span>
              </label>

              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium">Password</p>
                <button className="w-full px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                  Change Password
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">January 2024</p>
              </div>
              <button className="w-full px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                Delete Account
              </button>
            </CardContent>
          </Card>

          {/* App Version */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">DocTalk Version</p>
                <p className="font-medium">1.0.0</p>
              </div>
              <button className="w-full px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm">
                Check for Updates
              </button>
            </CardContent>
          </Card>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </main>
  );
}
