"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { FileArchive, Plus, Download, X, Eye } from "lucide-react";

export default function HealthRecords() {
  const [records, setRecords] = useState([
    {
      id: 1,
      title: "Blood Test Report",
      date: "2024-02-15",
      type: "Lab Report",
      doctor: "Dr. Johnson",
    },
    {
      id: 2,
      title: "Vaccination Certificate",
      date: "2024-01-10",
      type: "Vaccination",
      doctor: "General Hospital",
    },
    {
      id: 3,
      title: "Prescription - Metformin",
      date: "2024-01-05",
      type: "Prescription",
      doctor: "Dr. Smith",
    },
    {
      id: 4,
      title: "ECG Report",
      date: "2023-12-20",
      type: "Test Report",
      doctor: "Cardiac Center",
    },
  ]);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleDeleteRecord = (id) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const recordTypes = {
    "Lab Report": "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    "Vaccination":
      "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    "Prescription": "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    "Test Report": "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Records</h1>
          <p className="text-muted-foreground mt-2">
            Manage and store your medical documents
          </p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Upload Record
        </Button>
      </div>

      {/* Records Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map((record) => (
          <Card
            key={record.id}
            className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => setSelectedRecord(record)}
          >
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <FileArchive className="w-5 h-5 text-muted-foreground" />
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      recordTypes[record.type]
                    }`}
                  >
                    {record.type}
                  </span>
                </div>
                <div>
                  <p className="font-semibold truncate">{record.title}</p>
                  <p className="text-sm text-muted-foreground">{record.doctor}</p>
                  <p className="text-xs text-muted-foreground mt-1">{record.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedRecord.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedRecord.date} • {selectedRecord.doctor}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                <div className="text-center space-y-4">
                  <FileArchive className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Document preview would appear here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedRecord.title}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Document Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{selectedRecord.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{selectedRecord.date}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Provider</p>
                    <p className="font-medium">{selectedRecord.doctor}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => {
                    handleDeleteRecord(selectedRecord.id);
                    setSelectedRecord(null);
                  }}
                >
                  <X className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Upload Health Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Record Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Blood Test Report"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Record Type</label>
                <select className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Lab Report</option>
                  <option>Vaccination</option>
                  <option>Prescription</option>
                  <option>Test Report</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Provider/Doctor</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Dr. Smith"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Drop your file here or click to select
                </p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Upload</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}