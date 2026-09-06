import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Loader2, Eye, Users, MessageSquare, TrendingUp, Mail, Phone, Calendar, Activity } from 'lucide-react';

interface AnalyticsData {
  totalNewsletterSignups: number;
  totalContactMessages: number;
  todaySignups: number;
  todayMessages: number;
  weeklySignups: number;
  weeklyMessages: number;
  recentActivity: Array<{
    type: 'newsletter' | 'contact';
    email: string;
    name?: string;
    timestamp: string;
  }>;
}

function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const [refreshTime, setRefreshTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date());
      window.location.reload(); // Auto-refresh every 30 seconds
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const chartData = [
    { name: 'Today', newsletters: data.todaySignups, contacts: data.todayMessages },
    { name: 'This Week', newsletters: data.weeklySignups, contacts: data.weeklyMessages },
    { name: 'Total', newsletters: data.totalNewsletterSignups, contacts: data.totalContactMessages }
  ];

  const pieData = [
    { name: 'Newsletter Signups', value: data.totalNewsletterSignups, color: '#3b82f6' },
    { name: 'Contact Messages', value: data.totalContactMessages, color: '#10b981' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Launch Lifestyle Analytics</h1>
            <p className="text-gray-400 mt-1">Real-time business intelligence dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Last updated</p>
            <p className="text-white font-medium">{refreshTime.toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Newsletter Signups</p>
                  <p className="text-2xl font-bold text-blue-400">{data.totalNewsletterSignups}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Contact Forms</p>
                  <p className="text-2xl font-bold text-green-400">{data.totalContactMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Today's Activity</p>
                  <p className="text-2xl font-bold text-orange-400">{data.todaySignups + data.todayMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Weekly Growth</p>
                  <p className="text-2xl font-bold text-purple-400">{data.weeklySignups + data.weeklyMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Engagement Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="newsletters" fill="#3b82f6" name="Newsletter Signups" />
                  <Bar dataKey="contacts" fill="#10b981" name="Contact Forms" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Engagement Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentActivity.length > 0 ? (
                data.recentActivity.slice(0, 10).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={activity.type === 'newsletter' ? 'default' : 'secondary'}>
                        {activity.type === 'newsletter' ? 'Newsletter' : 'Contact'}
                      </Badge>
                      <div>
                        <p className="text-white font-medium">{activity.email}</p>
                        {activity.name && <p className="text-gray-400 text-sm">{activity.name}</p>}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AnalyticsAccess() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== "LaunchLifestyle2025!") {
      setError('Invalid password');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate fetching analytics data from storage
      const mockData: AnalyticsData = {
        totalNewsletterSignups: 1,
        totalContactMessages: 0,
        todaySignups: 0,
        todayMessages: 0,
        weeklySignups: 1,
        weeklyMessages: 0,
        recentActivity: [
          {
            type: 'newsletter',
            email: 'subscriber@example.com',
            timestamp: new Date().toISOString()
          }
        ]
      };
      
      setAnalyticsData(mockData);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated && analyticsData) {
    return <AnalyticsDashboard data={analyticsData} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-center flex items-center justify-center space-x-2">
            <Eye className="h-6 w-6" />
            <span>Launch Lifestyle Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accessing...
                </>
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}