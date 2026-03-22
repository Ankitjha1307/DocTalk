"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Upload } from "lucide-react";

const BASE_URL = "https://doctalk-production-a83f.up.railway.app";

export default function ReportAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      setError("Only PDF, JPG, JPEG, PNG files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.");
      return;
    }

    setFileName(file.name);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BASE_URL}/api/report/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setError(data.message || "Failed to analyze report.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const urgencyColor = {
    routine: "bg-green-50 border-green-200 text-green-900",
    soon: "bg-yellow-50 border-yellow-200 text-yellow-900",
    urgent: "bg-orange-50 border-orange-200 text-orange-900",
    emergency: "bg-red-50 border-red-200 text-red-900",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Report Analyzer</h1>
        <p className="text-muted-foreground mt-2">
          Upload your medical reports for AI-powered analysis
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
                Supports PDF, JPG, JPEG, PNG (max 10MB)
              </p>
            </div>
            <label className="cursor-pointer">
              <Button as="span" disabled={loading}>
                {loading ? "Analyzing..." : "Select File"}
              </Button>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
            {fileName && (
              <p className="text-sm text-muted-foreground">
                Selected: {fileName}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800 text-sm">❌ {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              🔍 AI is analyzing your report... This may take a moment.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Urgency Level */}
          <Card className={`border ${urgencyColor[result.urgency_level] || urgencyColor.routine}`}>
            <CardContent className="pt-6">
              <p className="font-semibold text-lg">
                Urgency Level:{" "}
                <span className="capitalize">{result.urgency_level || "Routine"}</span>
              </p>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {result.summary || "No summary available."}
              </p>
            </CardContent>
          </Card>

          {/* Abnormal Values */}
          {result.abnormal_values && (
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
              <CardHeader>
                <CardTitle className="text-yellow-900 dark:text-yellow-100">
                  ⚠️ Abnormal Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 whitespace-pre-wrap">
                  {result.abnormal_values}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Term Explanations */}
          {result.term_explanations && (
            <Card>
              <CardHeader>
                <CardTitle>📖 Medical Terms Explained</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {result.term_explanations}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Questions for Doctor */}
          {result.questions_for_doctor && (
            <Card>
              <CardHeader>
                <CardTitle>💬 Questions to Ask Your Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {result.questions_for_doctor}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <CardContent className="pt-6">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                ℹ️ {result.disclaimer}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
