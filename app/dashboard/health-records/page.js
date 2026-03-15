'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, X, AlertCircle, FileText } from 'lucide-react';
import { healthRecordsAPI } from '@/lib/api';

export default function HealthRecords() {
  const [records, setRecords] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await healthRecordsAPI.getRecords();
      setRecords(data.records || []);
    } catch (err) {
      console.error('[Health Records] Fetch error:', err);
      // Use mock data
      setRecords(mockRecords);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const recordType = file.name.includes('lab') ? 'lab_report' : 'medical_document';
      const result = await healthRecordsAPI.uploadRecord(file, recordType);
      setRecords((prev) => [...prev, result]);
    } catch (err) {
      console.error('[Health Records] Upload error:', err);
      setError(`Failed to upload record: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png'] },
  });

  const handleDeleteRecord = async (id) => {
    try {
      await healthRecordsAPI.deleteRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('[Health Records] Delete error:', err);
      setError('Failed to delete record');
    }
  };

  const mockRecords = [
    {
      id: '1',
      filename: 'Lab Report - January 2024.pdf',
      type: 'Lab Report',
      uploadedAt: '2024-01-15',
      size: '2.4 MB',
    },
    {
      id: '2',
      filename: 'Vaccination Certificate.pdf',
      type: 'Vaccination',
      uploadedAt: '2024-01-10',
      size: '1.1 MB',
    },
    {
      id: '3',
      filename: 'Prescription - December 2023.pdf',
      type: 'Prescription',
      uploadedAt: '2023-12-20',
      size: '0.8 MB',
    },
    {
      id: '4',
      filename: 'Health Check Report.pdf',
      type: 'Health Check',
      uploadedAt: '2023-12-01',
      size: '3.2 MB',
    },
  ];

  const recordTypes = ['all', 'Lab Report', 'Vaccination', 'Prescription', 'Health Check'];

  const filteredRecords = records.filter(
    (record) => filterType === 'all' || record.type === filterType
  );

  const getTypeColor = (type) => {
    const colors = {
      'Lab Report': 'bg-blue-100 text-blue-700',
      'Vaccination': 'bg-green-100 text-green-700',
      'Prescription': 'bg-purple-100 text-purple-700',
      'Health Check': 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <main className="flex-1 lg:ml-64 mt-20 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Health Records</h1>
        <p className="text-muted-foreground">Store and manage your medical documents</p>
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

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Upload Area and Records */}
        <div className="lg:col-span-3 space-y-6">
          {/* Upload Area */}
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
                <h3 className="text-lg font-semibold mb-2">Upload Medical Document</h3>
                <p className="text-muted-foreground mb-4">
                  {isDragActive
                    ? 'Drop your file here...'
                    : 'Drag and drop PDF or image files or click to select'}
                </p>
                <Button disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Select Files'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Records Grid */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Your Records</h2>
            {loading ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Loading records...
                </CardContent>
              </Card>
            ) : filteredRecords.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredRecords.map((record) => (
                  <Card key={record.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold line-clamp-2">{record.filename}</p>
                          <p className="text-xs text-muted-foreground">{record.size}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(record.type)}`}>
                          {record.type}
                        </span>
                        <p className="text-xs text-muted-foreground">{record.uploadedAt}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No records uploaded yet
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar - Filter */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Filter by Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recordTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    filterType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {type === 'all' ? 'All Records' : type}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{records.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Latest Upload</p>
                <p className="text-sm font-medium">
                  {records.length > 0 ? records[0].uploadedAt : 'Never'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
