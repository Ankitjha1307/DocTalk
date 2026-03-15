"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { X, Plus, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

export default function MedicineSafety() {
  const [medicines, setMedicines] = useState(["Ibuprofen", "Aspirin"]);
  const [newMedicine, setNewMedicine] = useState("");

  const interactions = [
    {
      pair: "Ibuprofen + Aspirin",
      severity: "DANGEROUS",
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Increased bleeding risk. Using both together can lead to severe gastrointestinal bleeding.",
      recommendation: "Use only one NSAID. Consult your doctor before taking both.",
      alternative: "Paracetamol",
    },
  ];

  const handleAddMedicine = () => {
    if (newMedicine.trim()) {
      setMedicines([...medicines, newMedicine]);
      setNewMedicine("");
    }
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
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
                placeholder="Enter medicine name..."
                value={newMedicine}
                onChange={(e) => setNewMedicine(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddMedicine()}
                className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={handleAddMedicine}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Added Medicines */}
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
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Interaction Results</h2>
        {interactions.map((interaction, idx) => (
          <Card key={idx} className={interaction.bgColor}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-lg">{interaction.pair}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                    {interaction.severity}
                  </div>
                </div>

                {/* Severity Bar */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Severity Level</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-red-600 h-full w-3/4"></div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Interaction Details</p>
                  <p className="text-sm text-muted-foreground">
                    {interaction.description}
                  </p>
                </div>

                {/* Recommendation */}
                <div className="space-y-2 p-3 rounded-lg bg-background/50 border">
                  <p className="text-sm font-medium">Recommendation</p>
                  <p className="text-sm">{interaction.recommendation}</p>
                </div>

                {/* Alternative */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Suggested Alternative</p>
                  <div className="p-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      {interaction.alternative}
                    </p>
                  </div>
                </div>

                <Button className="w-full">Consult Doctor</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* No Interactions Message */}
        {interactions.length === 0 && medicines.length >= 2 && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <p className="text-green-900">
                  No major interactions found. Always consult your doctor.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}