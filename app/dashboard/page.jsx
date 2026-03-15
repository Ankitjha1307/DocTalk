"use client";

import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  FileText,
  Pill,
  Search,
  TrendingUp,
  Activity,
  Droplet,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
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
} from "recharts";

export default function Dashboard() {
  const quickActions = [
    {
      title: "Upload Lab Report",
      description: "Analyze your medical reports",
      icon: FileText,
      href: "/dashboard/reports",
      color: "bg-blue-500/20 text-blue-600",
    },
    {
      title: "Check Drug Interaction",
      description: "Ensure medicine safety",
      icon: Pill,
      href: "/dashboard/medicine-safety",
      color: "bg-green-500/20 text-green-600",
    },
    {
      title: "Medicine Database",
      description: "Search medicine info",
      icon: Search,
      href: "/dashboard/medicine-database",
      color: "bg-purple-500/20 text-purple-600",
    },
    {
      title: "Smart Reminders",
      description: "Manage your medications",
      icon: Activity,
      href: "/dashboard/reminders",
      color: "bg-orange-500/20 text-orange-600",
    },
  ];

  const healthMetrics = [
    {
      label: "Blood Pressure",
      value: "120/80",
      status: "Normal",
      trend: "stable",
      icon: Activity,
    },
    {
      label: "Cholesterol",
      value: "180 mg/dL",
      status: "Normal",
      trend: "down",
      icon: Droplet,
    },
    {
      label: "Blood Sugar",
      value: "95 mg/dL",
      status: "Normal",
      trend: "down",
      icon: TrendingUp,
    },
    {
      label: "Vitamin Levels",
      value: "Adequate",
      status: "Normal",
      trend: "up",
      icon: Activity,
    },
  ];

  const chartData = [
    { date: "Jan 1", value: 120 },
    { date: "Jan 8", value: 118 },
    { date: "Jan 15", value: 122 },
    { date: "Jan 22", value: 119 },
    { date: "Jan 29", value: 117 },
    { date: "Feb 5", value: 115 },
    { date: "Feb 12", value: 116 },
  ];

  const recentActivity = [
    { type: "report", title: "Lab Report Uploaded", date: "Today" },
    { type: "reminder", title: "Medication Reminder Set", date: "Yesterday" },
    { type: "search", title: "Searched: Aspirin", date: "2 days ago" },
    { type: "report", title: "Lab Report Analyzed", date: "1 week ago" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome Back, Ankit</h1>
        <p className="text-muted-foreground mt-2">
          Here's your health overview for today
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Health Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Health Summary</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      {metric.trend === "up" ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {metric.label}
                      </p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {metric.status}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Blood Pressure Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 pb-3 border-b last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Chat with AI Pharmacist</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ask questions about medicines and symptoms
              </p>
            </div>
            <Link href="/dashboard/ai-pharmacist">
              <Button>Start Chat</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
