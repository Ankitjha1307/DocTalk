"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ReportAnalyzer() {
  const [reports, setReports] = useState<Array<any>>([
    {
      id: 1,
      date: "2024-02-15",
      name: "Blood Test Report",
      parameters: [
        { name: "Hemoglobin", value: "10.2", unit: "g/dL", status: "low", explanation: "Possible mild anemia. Consider iron rich foods." },
        { name: "WBC Count", value: "7.5", unit: "K/µL", status: "normal", explanation: "Within normal range." },
        { name: "Platelets", value: "250", unit: "K/µL", status: "normal", explanation: "Healthy platelet count." },
      ],
    },
    {
      id: 2,
      date: "2024-01-20",
      name: "Lipid Panel",
      parameters: [
        { name: "Cholesterol", value: "200", unit: "mg/dL", status: "normal", explanation: "Optimal level." },
        { name: "Triglycerides", value: "150", unit: "mg/dL", status: "normal", explanation: "Good level." },
      ],
    },
  ]);

  const [selectedReport, setSelectedReport] = useState<any>(reports[0]);

  const chartData = [
    { date: "Jan 1", hemoglobin: 9.8 },
    { date: "Jan 15", hemoglobin: 10.0 },
    { date: "Feb 1", hemoglobin: 10.2 },
  ];

  const statusConfig = {
    normal: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    low: { icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
    high: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
    critical: { icon: AlertCircle, color: "text-red-700", bg: "bg-red-50" },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Report Analyzer</h1>
        <p className="text-muted-foreground mt-2">
          Upload and analyze your medical reports
        </p>
      </div>

      {/* Upload Section */}
      <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
        <CardContent className="pt-8">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Upload className="w-12 h-12 text-muted-foreground" />
            <div className="text-center">
              <p className="font-semibold">Drop your report here</p>
              <p className="text-sm text-muted-foreground">
                or click to select PDF files
              </p>
            </div>
            <Button>Select Files</Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List and Details */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedReport.id === report.id
                        ? "border-primary bg-primary/10"
                        : "border-transparent hover:bg-muted"
                    }`}
                  >
                    <p className="font-medium text-sm">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedReport && (
            <>
              {/* Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lab Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedReport.parameters.map((param: any, idx: number) => {
                      const config = statusConfig[param.status as keyof typeof statusConfig];
                      const Icon = config.icon;
                      return (
                        <div key={idx} className={`p-4 rounded-lg ${config.bg}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className={`w-5 h-5 ${config.color}`} />
                              <div>
                                <p className="font-semibold">{param.name}</p>
                                <p className={`text-sm font-medium ${config.color}`}>
                                  {param.status === "normal" && "Normal"}
                                  {param.status === "low" && "Low"}
                                  {param.status === "high" && "High"}
                                  {param.status === "critical" && "Critical"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{param.value}</p>
                              <p className="text-xs text-muted-foreground">{param.unit}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {param.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">History Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="hemoglobin"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
