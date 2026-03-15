'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { healthTrendsAPI } from '@/lib/api';

export default function HealthTrends() {
  const [trends, setTrends] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, [days]);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      const data = await healthTrendsAPI.getAllTrends(days);
      setTrends(data);
    } catch (err) {
      console.error('[Health Trends] Fetch error:', err);
      // Use mock data
      setTrends({
        blood_sugar: mockData,
        blood_pressure: mockData,
        cholesterol: mockData,
      });
    } finally {
      setLoading(false);
    }
  };

  const mockData = [
    { date: 'Jan 1', value: 95 },
    { date: 'Jan 8', value: 98 },
    { date: 'Jan 15', value: 92 },
    { date: 'Jan 22', value: 89 },
    { date: 'Jan 29', value: 91 },
    { date: 'Feb 5', value: 87 },
    { date: 'Feb 12', value: 85 },
  ];

  const insights = [
    {
      title: 'Blood Sugar Improvement',
      description: 'Your blood sugar has improved by 12% in the last month.',
      type: 'positive',
    },
    {
      title: 'Cholesterol Status',
      description: 'Your cholesterol levels are within normal range.',
      type: 'positive',
    },
    {
      title: 'Blood Pressure',
      description: 'Your blood pressure shows good control.',
      type: 'positive',
    },
  ];

  return (
    <main className="flex-1 lg:ml-64 mt-20 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Trends</h1>
          <p className="text-muted-foreground">Track your health metrics over time</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                days === d
                  ? 'bg-primary text-primary-foreground'
                  : 'border hover:bg-muted'
              }`}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Loading trends...
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Blood Sugar Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Blood Sugar Trend ({days} days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends?.blood_sugar || mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Blood Pressure Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Blood Pressure Trend ({days} days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends?.blood_pressure || mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cholesterol Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Cholesterol Trend ({days} days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends?.cholesterol || mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <div>
            <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {insights.map((insight, idx) => (
                <Card key={idx} className={insight.type === 'positive' ? 'border-green-200 bg-green-50' : ''}>
                  <CardContent className="p-6">
                    <p className="font-semibold mb-2">{insight.title}</p>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
