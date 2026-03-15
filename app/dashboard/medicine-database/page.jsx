"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Search, ChevronDown } from "lucide-react";

export default function MedicineDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const medicines = [
    {
      id: 1,
      name: "Aspirin",
      type: "Analgesic",
      uses: "Pain relief, fever reduction, blood thinner",
      dosage: "500mg every 6 hours",
      sideEffects: "Stomach upset, allergic reactions",
      warnings: "Do not use if allergic. May interact with anticoagulants.",
      interactions: "Ibuprofen, Warfarin, Methotrexate",
    },
    {
      id: 2,
      name: "Ibuprofen",
      type: "NSAID",
      uses: "Pain relief, inflammation reduction, fever",
      dosage: "400mg every 6-8 hours",
      sideEffects: "Stomach pain, heartburn, dizziness",
      warnings: "May cause kidney problems with prolonged use.",
      interactions: "Aspirin, ACE Inhibitors, Diuretics",
    },
    {
      id: 3,
      name: "Paracetamol",
      type: "Analgesic",
      uses: "Pain relief, fever reduction",
      dosage: "500mg every 4-6 hours",
      sideEffects: "Rare. Allergic reactions possible.",
      warnings: "Avoid overdose. Can cause liver damage.",
      interactions: "Alcohol (increases liver risk)",
    },
    {
      id: 4,
      name: "Metformin",
      type: "Antidiabetic",
      uses: "Type 2 diabetes management",
      dosage: "500mg twice daily with meals",
      sideEffects: "Nausea, metallic taste, diarrhea",
      warnings: "Not for kidney disease patients.",
      interactions: "Contrast dyes, Diuretics",
    },
    {
      id: 5,
      name: "Amoxicillin",
      type: "Antibiotic",
      uses: "Bacterial infections",
      dosage: "250mg every 8 hours",
      sideEffects: "Allergic reactions, nausea, diarrhea",
      warnings: "Do not use if penicillin allergic.",
      interactions: "Oral contraceptives, Warfarin",
    },
  ];

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Medicine Database</h1>
        <p className="text-muted-foreground mt-2">
          Search and learn about medicines
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary pl-12"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      </div>

      {/* Grid of Medicine Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedicines.map((medicine) => (
          <Card
            key={medicine.id}
            className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
            onClick={() =>
              setSelectedMedicine(
                selectedMedicine?.id === medicine.id ? null : medicine
              )
            }
          >
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{medicine.name}</h3>
                <p className="text-sm text-muted-foreground">{medicine.type}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {medicine.uses}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Panel */}
      {selectedMedicine && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedMedicine.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedMedicine.type}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMedicine(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Uses */}
            <div>
              <h3 className="font-semibold mb-2">Uses</h3>
              <p className="text-sm text-muted-foreground">
                {selectedMedicine.uses}
              </p>
            </div>

            {/* Dosage */}
            <div>
              <h3 className="font-semibold mb-2">Recommended Dosage</h3>
              <p className="text-sm text-muted-foreground">
                {selectedMedicine.dosage}
              </p>
            </div>

            {/* Side Effects */}
            <div>
              <h3 className="font-semibold mb-2">Common Side Effects</h3>
              <p className="text-sm text-muted-foreground">
                {selectedMedicine.sideEffects}
              </p>
            </div>

            {/* Warnings */}
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-100">
                ⚠️ Warnings
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {selectedMedicine.warnings}
              </p>
            </div>

            {/* Drug Interactions */}
            <div>
              <h3 className="font-semibold mb-2">Known Drug Interactions</h3>
              <p className="text-sm text-muted-foreground">
                {selectedMedicine.interactions}
              </p>
            </div>

            <Button className="w-full">Consult Doctor About This Medicine</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}