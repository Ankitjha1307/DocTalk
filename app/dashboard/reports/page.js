'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { reportAPI } from '@/lib/api';

export default function ReportAnalyzer() {
  const [reports, setReports] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setError(null);

    try {
      const result = await reportAPI.uploadReport(file);
      setReports((prev) => [...prev, { ...result, status: 'analyzed' }]);
      setError(null);
    } catch (err) {
      console.error('[Reports] Upload error:', err);
      setError(`Failed to upload report: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const mockReport = {
    id: 'report-1',
    filename: 'Lab Report - Jan 2024.pdf',
    uploadedAt: new Date().toLocaleDateString(),
    parameters: [
      {
        name: 'Hemoglobin',
        value: 10.2,
        unit: 'g/dL',
        status: 'low',
        normal: '13.5-17.5',
        explanation: 'Possible mild anemia. Consider iron rich foods or supplementation.',
      },
      {
        name: 'Blood Glucose',
        value: 95,
        unit: 'mg/dL',
        status: 'normal',
        normal: '70-100',
        explanation: 'Normal fasting blood glucose level.',
      },
      {
        name: 'Cholesterol',
        value: 180,
        unit: 'mg/dL',
        status: 'normal',
        normal: '< 200',
        explanation: 'Desirable cholesterol level.',
      },
      {
        name: 'HDL Cholesterol',
        value: 45,
        unit: 'mg/dL',
        status: 'low',
        normal: '> 40 (male), > 50 (female)',
        explanation: 'HDL is below optimal level. Increase aerobic exercise.',
      },
      {
        name: 'LDL Cholesterol',
        value: 115,
        unit: 'mg/dL',
        status: 'normal',
        normal: '< 130',
        explanation: 'LDL cholesterol is at acceptable levels.',
      },
      {
        name: 'Triglycerides',
        value: 150,
        unit: 'mg/dL',
        status: 'normal',
        normal: '< 150',
        explanation: 'Triglycerides are within normal range.',
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'low':
        return 'bg-yellow-500/20 text-yellow-700';
      case 'high':
        return 'bg-red-500/20 text-red-700';
      case 'critical':
        return 'bg-red-700/20 text-red-900';
      default:
        return 'bg-green-500/20 text-green-700';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'normal') return <CheckCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <main className="flex-1 lg:ml-64 mt-20 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Lab Report Analyzer</h1>
        <p className="text-muted-foreground">Upload and analyze your medical reports</p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto">
                <X className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-8">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Lab Report</h3>
                <p className="text-muted-foreground mb-4">
                  {isDragActive
                    ? 'Drop your PDF here...'
                    : 'Drag and drop your PDF report or click to select'}
                </p>
                <Button disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Select File'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Result */}
          {selectedReport || reports.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Report Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    Report: {mockReport.filename}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Uploaded: {mockReport.uploadedAt}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Lab Parameters:</h4>
                  {mockReport.parameters.map((param, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{param.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Normal Range: {param.normal}
                          </p>
                        </div>
                        <span
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            param.status
                          )}`}
                        >
                          {getStatusIcon(param.status)}
                          {param.status.charAt(0).toUpperCase() + param.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-lg font-bold mb-2">
                        {param.value} {param.unit}
                      </p>
                      <p className="text-sm text-muted-foreground">{param.explanation}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-2">AI Recommendation</p>
                  <p className="text-sm text-blue-800">
                    Based on your report, consider increasing iron intake through diet or
                    supplements, and incorporate more cardio exercise to improve HDL cholesterol
                    levels. Consult your doctor for personalized advice.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Recent Reports */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {reports.length > 0 ? (
                reports.map((report, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedReport(report)}
                    className="w-full text-left p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{report.filename}</p>
                        <p className="text-xs text-muted-foreground">{report.uploadedAt}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No reports uploaded yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
