"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { X, Plus, CheckCircle } from "lucide-react";

const BASE_URL = "https://doctalk-production-a83f.up.railway.app";

export default function MedicineSafety() {
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState("");
  const [interactionResult, setInteractionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleAddMedicine = () => {
    if (newMedicine.trim() && !medicines.includes(newMedicine.trim())) {
      setMedicines([...medicines, newMedicine.trim()]);
      setNewMedicine("");
      setInteractionResult(null);
      setChecked(false);
    }
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
    setInteractionResult(null);
    setChecked(false);
  };

  const handleCheckInteractions = async () => {
    if (medicines.length < 2) {
      alert("Please add at least 2 medicines to check interactions.");
      return;
    }
    setLoading(true);
    setChecked(true);

    try {
      const res = await fetch(`${BASE_URL}/api/medicine/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicines }),
      });
      const data = await res.json();
      setInteractionResult(data);
    } catch (error) {
      setInteractionResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Drug Interaction Checker</h1>
        <p className="text-muted-foreground mt-2">
          Check for potential medicine interactions
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter medicine name (e.g. Aspirin, Warfarin)..."
                value={newMedicine}
                onChange={(e) => setNewMedicine(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddMedicine()}
                className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={handleAddMedicine}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {medicines.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {medicines.map((medicine, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/20"
                  >
                    <span className="text-sm font-medium">{medicine}</span>
                    <button
                      onClick={() => handleRemoveMedicine(index)}
                      className="p-1 hover:bg-primary/20 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {medicines.length >= 2 && (
              <Button
                onClick={handleCheckInteractions}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Checking Interactions..." : "Check Interactions"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {checked && !loading && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Interaction Results</h2>

          {interactionResult ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Analysis: {interactionResult.medicines?.join(" + ")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {interactionResult.analysis}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ {interactionResult.disclaimer}
                  </p>
                </div>

                <Button className="w-full">Consult Doctor</Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="text-green-900">
                    Could not fetch interactions. Please try again.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Analyzing drug interactions with AI...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
