import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Building, 
  Calendar, 
  MapPin, 
  Phone, 
  Edit3, 
  Save, 
  X,
  BarChart3,
  FileText,
  TrendingUp,
  Clock,
  Award,
  Target,
  Activity
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Equity Research Corp',
    role: 'Senior Analyst',
    department: 'Investment Research',
    location: 'New York, NY',
    timezone: 'America/New_York',
    bio: 'Senior equity research analyst with 8+ years of experience in technology and financial services sectors. Specialized in fundamental analysis and valuation modeling.',
    joinDate: '2022-03-15',
    lastActive: '2024-01-15 14:30',
    reportsGenerated: 247,
    stocksAnalyzed: 89,
    averageRating: 4.2,
    totalExports: 156
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const recentActivity = [
    {
      id: 1,
      type: 'report',
      action: 'Generated research report',
      target: 'AAPL',
      timestamp: '2 hours ago',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 2,
      type: 'rating',
      action: 'Updated rating',
      target: 'MSFT',
      timestamp: '4 hours ago',
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      id: 3,
      type: 'export',
      action: 'Exported portfolio report',
      target: 'Portfolio Summary',
      timestamp: '1 day ago',
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      id: 4,
      type: 'analysis',
      action: 'Started analysis',
      target: 'TSLA',
      timestamp: '2 days ago',
      icon: <Target className="h-4 w-4" />
    },
    {
      id: 5,
      type: 'upload',
      action: 'Uploaded stock list',
      target: '15 stocks',
      timestamp: '3 days ago',
      icon: <Activity className="h-4 w-4" />
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Report Master',
      description: 'Generated 100+ research reports',
      icon: <FileText className="h-6 w-6" />,
      achieved: true,
      progress: 100
    },
    {
      id: 2,
      title: 'Analyst Pro',
      description: 'Analyzed 50+ stocks',
      icon: <TrendingUp className="h-6 w-6" />,
      achieved: true,
      progress: 100
    },
    {
      id: 3,
      title: 'Export Expert',
      description: 'Exported 100+ reports',
      icon: <BarChart3 className="h-6 w-6" />,
      achieved: true,
      progress: 100
    },
    {
      id: 4,
      title: 'Consistent Rater',
      description: 'Rated 25+ stocks',
      icon: <Target className="h-6 w-6" />,
      achieved: false,
      progress: 60
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-gray-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                  <p className="text-gray-600">
                    Manage your personal information and view your activity
                  </p>
                </div>
              </div>
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    {isEditing ? tempProfile.firstName + ' ' + tempProfile.lastName : profile.firstName + ' ' + profile.lastName}
                  </CardTitle>
                  <CardDescription>
                    {isEditing ? tempProfile.role : profile.role}
                  </CardDescription>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Professional Plan
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {isEditing ? tempProfile.email : profile.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {isEditing ? tempProfile.phone : profile.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {isEditing ? tempProfile.company : profile.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {isEditing ? tempProfile.location : profile.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        Member since {profile.joinDate}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Reports Generated</p>
                            <p className="text-2xl font-bold text-gray-900">{profile.reportsGenerated}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Stocks Analyzed</p>
                            <p className="text-2xl font-bold text-gray-900">{profile.stocksAnalyzed}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Target className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Avg Rating</p>
                            <p className="text-2xl font-bold text-gray-900">{profile.averageRating}/5</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Exports</p>
                            <p className="text-2xl font-bold text-gray-900">{profile.totalExports}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Bio Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          value={tempProfile.bio}
                          onChange={(e) => handleChange('bio', e.target.value)}
                          className="min-h-[100px]"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>
                        Your recent actions and interactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {activity.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {activity.action} - {activity.target}
                              </p>
                              <p className="text-xs text-gray-500">
                                {activity.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Achievements Tab */}
                <TabsContent value="achievements" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Achievements
                      </CardTitle>
                      <CardDescription>
                        Track your progress and unlock new achievements
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        {achievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className={`p-4 rounded-lg border-2 ${
                              achievement.achieved
                                ? 'border-green-200 bg-green-50'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`p-2 rounded-lg ${
                                achievement.achieved
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {achievement.icon}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {achievement.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {achievement.description}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{achievement.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    achievement.achieved ? 'bg-green-500' : 'bg-gray-400'
                                  }`}
                                  style={{ width: `${achievement.progress}%` }}
                                ></div>
                              </div>
                              {achievement.achieved && (
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                  Achieved
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile; 