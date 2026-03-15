'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { medicineAPI } from '@/lib/api';

export default function MedicineSafety() {
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState('');
  const [interactions, setInteractions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await medicineAPI.search(query, 5);
      setSearchResults(results.medicines || []);
    } catch (err) {
      console.error('[Medicine Safety] Search error:', err);
      setError('Failed to search medicines');
    } finally {
      setSearching(false);
    }
  };

  const addMedicine = (medicine) => {
    if (medicines.find((m) => m.id === medicine.id)) {
      setError('Medicine already added');
      return;
    }
    setMedicines((prev) => [...prev, medicine]);
    setNewMedicine('');
    setSearchResults([]);
    setError(null);
  };

  const removeMedicine = (id) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const checkInteractions = async () => {
    if (medicines.length < 2) {
      setError('Add at least 2 medicines to check interactions');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const medicineIds = medicines.map((m) => m.id);
      const result = await medicineAPI.checkInteractions(medicineIds);
      setInteractions(result);
    } catch (err) {
      console.error('[Medicine Safety] Check error:', err);
      setError(`Failed to check interactions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'safe':
        return 'bg-green-500/20 text-green-700 border-green-300';
      case 'mild':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-300';
      case 'moderate':
        return 'bg-orange-500/20 text-orange-700 border-orange-300';
      case 'dangerous':
        return 'bg-red-500/20 text-red-700 border-red-300';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-300';
    }
  };

  const getSeverityIcon = (severity) => {
    if (severity?.toLowerCase() === 'safe') return <CheckCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  const mockMedicines = [
    { id: '1', name: 'Ibuprofen', type: 'Painkiller' },
    { id: '2', name: 'Aspirin', type: 'Anticoagulant' },
    { id: '3', name: 'Metformin', type: 'Diabetes' },
    { id: '4', name: 'Paracetamol', type: 'Painkiller' },
    { id: '5', name: 'Lisinopril', type: 'Blood Pressure' },
  ];

  const mockInteraction = {
    pairs: [
      {
        medicine1: 'Ibuprofen',
        medicine2: 'Aspirin',
        severity: 'Dangerous',
        interaction: 'Increased bleeding risk',
        recommendation: 'Do not combine. Use Paracetamol instead.',
        alternative: 'Paracetamol',
      },
    ],
    summary: 'Found 1 significant interaction',
    safeCount: 0,
    warningCount: 1,
  };

  return (
    <main className="flex-1 lg:ml-64 mt-20 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Medicine Safety Checker</h1>
        <p className="text-muted-foreground">Check for drug interactions before taking medicines</p>
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
        {/* Medicine Input */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Medicines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search and add medicines..."
                  value={newMedicine}
                  onChange={(e) => {
                    setNewMedicine(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 border rounded-lg bg-background shadow-lg z-10 max-h-48 overflow-y-auto">
                    {searchResults.map((medicine) => (
                      <button
                        key={medicine.id}
                        onClick={() => addMedicine(medicine)}
                        className="w-full text-left px-4 py-3 hover:bg-muted border-b last:border-b-0 transition-colors"
                      >
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm text-muted-foreground">{medicine.type}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Mock Results */}
                {newMedicine && searchResults.length === 0 && !searching && (
                  <div className="absolute top-full left-0 right-0 mt-1 border rounded-lg bg-background shadow-lg z-10 max-h-48 overflow-y-auto">
                    {mockMedicines
                      .filter(
                        (m) =>
                          m.name.toLowerCase().includes(newMedicine.toLowerCase()) &&
                          !medicines.find((med) => med.id === m.id)
                      )
                      .slice(0, 5)
                      .map((medicine) => (
                        <button
                          key={medicine.id}
                          onClick={() => addMedicine(medicine)}
                          className="w-full text-left px-4 py-3 hover:bg-muted border-b last:border-b-0 transition-colors"
                        >
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-sm text-muted-foreground">{medicine.type}</p>
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Selected Medicines */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Medicines ({medicines.length})</p>
                {medicines.length > 0 ? (
                  <div className="space-y-2">
                    {medicines.map((medicine) => (
                      <div
                        key={medicine.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-sm text-muted-foreground">{medicine.type}</p>
                        </div>
                        <button
                          onClick={() => removeMedicine(medicine.id)}
                          className="p-1 hover:bg-muted rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No medicines added yet
                  </p>
                )}
              </div>

              <Button
                onClick={checkInteractions}
                disabled={medicines.length < 2 || loading}
                className="w-full"
              >
                {loading ? 'Checking Interactions...' : 'Check for Interactions'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Sidebar */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Interaction Results</CardTitle>
            </CardHeader>
            <CardContent>
              {!interactions && medicines.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Add medicines to check interactions
                </p>
              ) : interactions ? (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">{interactions.summary}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-600 font-medium">Safe</p>
                      <p className="text-2xl font-bold text-green-700">
                        {interactions.safeCount}
                      </p>
                    </div>
                    <div className="flex-1 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-600 font-medium">Warnings</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {interactions.warningCount}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Click check button to analyze
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Results */}
      {interactions && interactions.pairs && interactions.pairs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Interaction Details</h2>
          <div className="space-y-4">
            {interactions.pairs.map((pair, idx) => (
              <Card key={idx} className={`border-2 ${getSeverityColor(pair.severity)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-lg">
                        {pair.medicine1} + {pair.medicine2}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full font-semibold">
                      {getSeverityIcon(pair.severity)}
                      {pair.severity}
                    </div>
                  </div>

                  <p className="text-sm mb-4">{pair.interaction}</p>

                  <div className="bg-white/50 p-3 rounded-lg mb-4">
                    <p className="text-sm font-semibold mb-2">Recommendation:</p>
                    <p className="text-sm">{pair.recommendation}</p>
                  </div>

                  {pair.alternative && (
                    <div className="p-3 bg-green-100/50 border border-green-300 rounded-lg">
                      <p className="text-sm font-semibold text-green-900 mb-1">
                        Suggested Alternative:
                      </p>
                      <p className="text-sm text-green-900">{pair.alternative}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
