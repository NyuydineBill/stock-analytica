import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  Bell, 
  User, 
  Shield, 
  Palette, 
  Globe, 
  Save, 
  Download, 
  Upload,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Monitor,
  Zap
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Profile Settings
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    company: 'Equity Research Corp',
    role: 'Senior Analyst',
    timezone: 'America/New_York',
    language: 'en',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    analysisComplete: true,
    ratingUpdates: true,
    systemUpdates: true,
    marketingEmails: false,
    
    // Display Settings
    theme: 'light',
    compactMode: false,
    showCharts: true,
    autoRefresh: true,
    refreshInterval: '5',
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    loginNotifications: true,
    
    // Export Settings
    defaultFormat: 'pdf',
    includeCharts: true,
    includeRating: true,
    watermark: false,
    autoSave: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // In a real app, this would save to backend
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings.json';
    link.click();
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
        } catch (error) {
          console.error('Error importing settings:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <SettingsIcon className="h-8 w-8 text-gray-600" />
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            </div>
            <p className="text-gray-600">
              Manage your account preferences, notifications, and system settings
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="display" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Display
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={settings.firstName}
                        onChange={(e) => handleSettingChange('firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={settings.lastName}
                        onChange={(e) => handleSettingChange('lastName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleSettingChange('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={settings.company}
                        onChange={(e) => handleSettingChange('company', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={settings.role}
                        onChange={(e) => handleSettingChange('role', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="Europe/London">London</SelectItem>
                          <SelectItem value="Europe/Paris">Paris</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how and when you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Push Notifications</Label>
                        <p className="text-sm text-gray-600">Receive notifications in browser</p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Analysis Complete</Label>
                        <p className="text-sm text-gray-600">When research reports are ready</p>
                      </div>
                      <Switch
                        checked={settings.analysisComplete}
                        onCheckedChange={(checked) => handleSettingChange('analysisComplete', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Rating Updates</Label>
                        <p className="text-sm text-gray-600">When stock ratings change</p>
                      </div>
                      <Switch
                        checked={settings.ratingUpdates}
                        onCheckedChange={(checked) => handleSettingChange('ratingUpdates', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">System Updates</Label>
                        <p className="text-sm text-gray-600">Important system announcements</p>
                      </div>
                      <Switch
                        checked={settings.systemUpdates}
                        onCheckedChange={(checked) => handleSettingChange('systemUpdates', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Marketing Emails</Label>
                        <p className="text-sm text-gray-600">Product updates and promotions</p>
                      </div>
                      <Switch
                        checked={settings.marketingEmails}
                        onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Display Settings */}
            <TabsContent value="display" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Display & Interface
                  </CardTitle>
                  <CardDescription>
                    Customize your viewing experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Compact Mode</Label>
                        <p className="text-sm text-gray-600">Reduce spacing for more content</p>
                      </div>
                      <Switch
                        checked={settings.compactMode}
                        onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Show Charts</Label>
                        <p className="text-sm text-gray-600">Display charts in reports</p>
                      </div>
                      <Switch
                        checked={settings.showCharts}
                        onCheckedChange={(checked) => handleSettingChange('showCharts', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Auto Refresh</Label>
                        <p className="text-sm text-gray-600">Automatically refresh data</p>
                      </div>
                      <Switch
                        checked={settings.autoRefresh}
                        onCheckedChange={(checked) => handleSettingChange('autoRefresh', checked)}
                      />
                    </div>
                    {settings.autoRefresh && (
                      <div className="space-y-2">
                        <Label>Refresh Interval</Label>
                        <Select value={settings.refreshInterval} onValueChange={(value) => handleSettingChange('refreshInterval', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 minute</SelectItem>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security & Privacy
                  </CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Session Timeout (minutes)</Label>
                      <Select value={settings.sessionTimeout} onValueChange={(value) => handleSettingChange('sessionTimeout', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Password Expiry (days)</Label>
                      <Select value={settings.passwordExpiry} onValueChange={(value) => handleSettingChange('passwordExpiry', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Login Notifications</Label>
                        <p className="text-sm text-gray-600">Notify on new device login</p>
                      </div>
                      <Switch
                        checked={settings.loginNotifications}
                        onCheckedChange={(checked) => handleSettingChange('loginNotifications', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Export Settings */}
            <TabsContent value="export" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export & Backup
                  </CardTitle>
                  <CardDescription>
                    Manage your export preferences and backup settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Default Export Format</Label>
                      <Select value={settings.defaultFormat} onValueChange={(value) => handleSettingChange('defaultFormat', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Include Charts</Label>
                        <p className="text-sm text-gray-600">Add charts to exports</p>
                      </div>
                      <Switch
                        checked={settings.includeCharts}
                        onCheckedChange={(checked) => handleSettingChange('includeCharts', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Include Rating</Label>
                        <p className="text-sm text-gray-600">Add your ratings to exports</p>
                      </div>
                      <Switch
                        checked={settings.includeRating}
                        onCheckedChange={(checked) => handleSettingChange('includeRating', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Add Watermark</Label>
                        <p className="text-sm text-gray-600">Include watermark on exports</p>
                      </div>
                      <Switch
                        checked={settings.watermark}
                        onCheckedChange={(checked) => handleSettingChange('watermark', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Auto Save</Label>
                        <p className="text-sm text-gray-600">Automatically save reports</p>
                      </div>
                      <Switch
                        checked={settings.autoSave}
                        onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Backup & Restore</h3>
                    <div className="flex gap-4">
                      <Button onClick={handleExportSettings} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Download className="h-4 w-4 mr-2" />
                        Export Settings
                      </Button>
                      <div>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportSettings}
                          className="hidden"
                          id="import-settings"
                        />
                        <Button variant="outline" asChild className="border-blue-300 text-blue-700 hover:bg-blue-50">
                          <label htmlFor="import-settings">
                            <Upload className="h-4 w-4 mr-2" />
                            Import Settings
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings; 