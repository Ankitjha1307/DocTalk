'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';
import { medicineAPI } from '@/lib/api';

export default function MedicineDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mockMedicines = [
    {
      id: '1',
      name: 'Ibuprofen',
      type: 'NSAID',
      uses: 'Pain relief, fever reduction, inflammation',
      dosage: 'Adults: 200-400mg every 4-6 hours, max 1200mg/day',
      sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness'],
      warnings: ['Do not take with aspirin', 'May increase blood pressure'],
      interactions: ['Aspirin', 'Warfarin', 'ACE inhibitors'],
    },
    {
      id: '2',
      name: 'Metformin',
      type: 'Diabetes',
      uses: 'Type 2 diabetes management, blood sugar control',
      dosage: 'Adults: 500mg twice daily, increased gradually, max 2550mg/day',
      sideEffects: ['Stomach upset', 'Diarrhea', 'Metallic taste'],
      warnings: ['Avoid if allergic to metformin', 'Liver/kidney issues'],
      interactions: ['Alcohol', 'Certain contrast dyes'],
    },
    {
      id: '3',
      name: 'Lisinopril',
      type: 'ACE Inhibitor',
      uses: 'High blood pressure, heart failure',
      dosage: 'Adults: 10mg once daily, adjusted as needed, max 40mg/day',
      sideEffects: ['Dry cough', 'Dizziness', 'Low blood pressure'],
      warnings: ['Pregnancy category D', 'Potassium monitoring needed'],
      interactions: ['NSAIDs', 'Potassium supplements', 'Diuretics'],
    },
    {
      id: '4',
      name: 'Atorvastatin',
      type: 'Statin',
      uses: 'Cholesterol reduction, heart disease prevention',
      dosage: 'Adults: 10-80mg once daily',
      sideEffects: ['Muscle pain', 'Joint pain', 'Fatigue'],
      warnings: ['Monitor liver function', 'Pregnancy category X'],
      interactions: ['Erythromycin', 'Some antifungals'],
    },
    {
      id: '5',
      name: 'Aspirin',
      type: 'Anticoagulant',
      uses: 'Pain relief, fever, blood clot prevention',
      dosage: 'Adults: 325-500mg every 4-6 hours, max 4000mg/day',
      sideEffects: ['Stomach upset', 'Bleeding', 'Bruising'],
      warnings: ['Bleeding risk', 'Not for children with fever'],
      interactions: ['NSAIDs', 'Warfarin', 'Clopidogrel'],
    },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    } else {
      setMedicines([]);
    }
  }, [searchQuery]);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const results = await medicineAPI.search(query, 10);
      setMedicines(results.medicines || []);
    } catch (err) {
      console.error('[Medicine Database] Search error:', err);
      // Use mock data as fallback
      setMedicines(
        mockMedicines.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 lg:ml-64 mt-20 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Medicine Database</h1>
        <p className="text-muted-foreground">Search and learn about medicines</p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Search and Results */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Results Grid */}
          <div className="grid gap-4">
            {loading ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Searching medicines...
                </CardContent>
              </Card>
            ) : medicines.length > 0 ? (
              medicines.map((medicine) => (
                <Card
                  key={medicine.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedMedicine(medicine)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{medicine.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{medicine.type}</p>
                        <p className="text-sm line-clamp-2">{medicine.uses}</p>
                      </div>
                      <div className="ml-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        View
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : searchQuery ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No medicines found. Try a different search.
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Start typing to search for medicines
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div>
          {selectedMedicine ? (
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">{selectedMedicine.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{selectedMedicine.type}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Uses */}
                <div>
                  <h4 className="font-semibold mb-2">Uses</h4>
                  <p className="text-sm text-muted-foreground">{selectedMedicine.uses}</p>
                </div>

                {/* Dosage */}
                <div>
                  <h4 className="font-semibold mb-2">Dosage</h4>
                  <p className="text-sm text-muted-foreground">{selectedMedicine.dosage}</p>
                </div>

                {/* Side Effects */}
                <div>
                  <h4 className="font-semibold mb-2">Common Side Effects</h4>
                  <ul className="space-y-1">
                    {selectedMedicine.sideEffects?.map((effect, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
                        {effect}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Warnings */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    Warnings
                  </h4>
                  <ul className="space-y-1">
                    {selectedMedicine.warnings?.map((warning, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-orange-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactions */}
                <div>
                  <h4 className="font-semibold mb-2">Known Interactions</h4>
                  <div className="space-y-1">
                    {selectedMedicine.interactions?.map((interaction, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 bg-red-50 border border-red-200 rounded text-sm text-red-700"
                      >
                        {interaction}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                  Consult with Doctor
                </button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Select a medicine to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
