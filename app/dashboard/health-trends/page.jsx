"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function HealthTrends() {
  const bloodSugarData = [
    { date: "Week 1", value: 140 },
    { date: "Week 2", value: 135 },
    { date: "Week 3", value: 128 },
    { date: "Week 4", value: 125 },
    { date: "Week 5", value: 118 },
    { date: "Week 6", value: 115 },
    { date: "Week 7", value: 112 },
    { date: "Week 8", value: 110 },
  ];

  const cholesterolData = [
    { date: "Jan", ldl: 140, hdl: 35, triglycerides: 180 },
    { date: "Feb", ldl: 135, hdl: 36, triglycerides: 175 },
    { date: "Mar", ldl: 128, hdl: 40, triglycerides: 165 },
    { date: "Apr", ldl: 125, hdl: 42, triglycerides: 155 },
    { date: "May", ldl: 118, hdl: 45, triglycerides: 145 },
  ];

  const bloodPressureData = [
    { date: "Week 1", systolic: 145, diastolic: 92 },
    { date: "Week 2", systolic: 142, diastolic: 90 },
    { date: "Week 3", systolic: 140, diastolic: 88 },
    { date: "Week 4", systolic: 138, diastolic: 86 },
    { date: "Week 5", systolic: 135, diastolic: 84 },
    { date: "Week 6", systolic: 132, diastolic: 82 },
    { date: "Week 7", systolic: 130, diastolic: 81 },
  ];

  const insights = [
    {
      title: "Blood Sugar Improved",
      value: "15%",
      period: "Last 3 months",
      trend: "up",
      description: "Great progress! Your blood sugar levels have improved significantly.",
    },
    {
      title: "Weight Trend",
      value: "8 lbs",
      period: "Last 2 months",
      trend: "down",
      description: "You're making excellent progress towards your fitness goals.",
    },
    {
      title: "Cholesterol Status",
      value: "Improved",
      period: "Last 1 month",
      trend: "down",
      description: "Your cholesterol levels are trending in the right direction.",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Health Trends</h1>
        <p className="text-muted-foreground mt-2">
          Track your health analytics over time
        </p>
      </div>

      {/* AI Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        {insights.map((insight, idx) => (
          <Card key={idx} className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {insight.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">{insight.value}</p>
                  </div>
                  {insight.trend === "up" ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{insight.period}</p>
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 space-y-6 lg:space-y-0">
        {/* Blood Sugar Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Blood Sugar Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bloodSugarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Blood Sugar (mg/dL)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cholesterol Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cholesterol Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={cholesterolData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ldl"
                  stroke="#ef4444"
                  name="LDL"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="hdl"
                  stroke="#22c55e"
                  name="HDL"
                  strokeWidth={2}
                />
                <Bar dataKey="triglycerides" fill="#f59e0b" name="Triglycerides" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Blood Pressure Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Blood Pressure Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={bloodPressureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  stroke="#3b82f6"
                  name="Systolic (mmHg)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#8b5cf6"
                  name="Diastolic (mmHg)"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}