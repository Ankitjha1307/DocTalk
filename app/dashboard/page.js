'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Pill,
  Search,
  TrendingUp,
  Activity,
  Droplet,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useState, useEffect } from 'react';
import { dashboardAPI, healthTrendsAPI } from '@/lib/api';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryData, trendsData] = await Promise.all([
        dashboardAPI.getSummary(),
        healthTrendsAPI.getAllTrends(30),
      ]);
      setSummary(summaryData);
      setTrends(trendsData);
    } catch (err) {
      console.error('[Dashboard] Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Upload Lab Report',
      description: 'Analyze your medical reports',
      icon: FileText,
      href: '/dashboard/reports',
      color: 'bg-blue-500/20 text-blue-600',
    },
    {
      title: 'Check Drug Interaction',
      description: 'Ensure medicine safety',
      icon: Pill,
      href: '/dashboard/medicine-safety',
      color: 'bg-green-500/20 text-green-600',
    },
    {
      title: 'Medicine Database',
      description: 'Search medicine info',
      icon: Search,
      href: '/dashboard/medicine-database',
      color: 'bg-purple-500/20 text-purple-600',
    },
    {
      title: 'Smart Reminders',
      description: 'Manage your medications',
      icon: Activity,
      href: '/dashboard/reminders',
      color: 'bg-orange-500/20 text-orange-600',
    },
  ];

  const defaultHealthMetrics = [
    {
      label: 'Blood Pressure',
      value: '120/80',
      status: 'Normal',
      trend: 'stable',
      icon: Activity,
    },
    {
      label: 'Cholesterol',
      value: '180 mg/dL',
      status: 'Normal',
      trend: 'down',
      icon: Droplet,
    },
    {
      label: 'Blood Sugar',
      value: '95 mg/dL',
      status: 'Normal',
      trend: 'down',
      icon: TrendingUp,
    },
    {
      label: 'Vitamin Levels',
      value: 'Adequate',
      status: 'Normal',
      trend: 'up',
      icon: Activity,
    },
  ];

  const defaultChartData = [
    { date: 'Jan 1', value: 120 },
    { date: 'Jan 8', value: 118 },
    { date: 'Jan 15', value: 122 },
    { date: 'Jan 22', value: 119 },
    { date: 'Jan 29', value: 117 },
    { date: 'Feb 5', value: 115 },
    { date: 'Feb 12', value: 116 },
  ];

  const healthMetrics = summary?.health_metrics || defaultHealthMetrics;
  const chartData = trends?.blood_pressure || defaultChartData;
  const recentActivity = summary?.recent_activity || [];

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg m-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1 lg:ml-64 mt-20 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your health overview.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${action.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Health Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Health Summary</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            const trendColor = metric.trend === 'up' ? 'text-green-600' : 'text-red-600';
            return (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    {metric.trend === 'up' ? (
                      <ArrowUp className={`w-4 h-4 ${trendColor}`} />
                    ) : (
                      <ArrowDown className={`w-4 h-4 ${trendColor}`} />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold mb-1">{metric.value}</p>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-700 rounded-full">
                    {metric.status}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Blood Pressure Trend (30 days)</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  Loading chart...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0f172a"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">Blood Sugar</p>
                <p className="text-sm text-blue-800">Your blood sugar has improved by 12% in the last month.</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-900 mb-2">Medications</p>
                <p className="text-sm text-green-800">All medicines are compatible. No interactions detected.</p>
              </div>
              <Link
                href="/dashboard/ai-pharmacist"
                className="block w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-center hover:bg-primary/90 transition-colors"
              >
                Chat with AI Pharmacist
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading activity...</p>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent activity.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
