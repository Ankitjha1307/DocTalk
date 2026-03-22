"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Search } from "lucide-react";

const BASE_URL = "https://doctalk-production-a83f.up.railway.app";

export default function MedicineDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [medicineDetail, setMedicineDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setSearched(true);
    setSelectedMedicine(null);
    setMedicineDetail(null);

    try {
      const res = await fetch(
        `${BASE_URL}/api/medicine/search?q=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMedicine = async (medicine) => {
    if (selectedMedicine?.id === medicine.id) {
      setSelectedMedicine(null);
      setMedicineDetail(null);
      return;
    }

    setSelectedMedicine(medicine);
    setDetailLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/medicine/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Tell me about ${medicine.content.split("\n")[0].replace("Medicine: ", "")} - include uses, dosage, side effects, warnings and drug interactions.`,
        }),
      });
      const data = await res.json();
      setMedicineDetail(data);
    } catch (error) {
      setMedicineDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const getMedicineName = (content) => {
    const line = content.split("\n")[0];
    return line.replace("Medicine: ", "").trim();
  };

  const getMedicineType = (content) => {
    const match = content.match(/Drug Class: (.+)/);
    return match ? match[1].trim() : "Medicine";
  };

  const getMedicineUses = (content) => {
    const match = content.match(/Use: (.+)/);
    return match ? match[1].trim() : "";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Medicine Database</h1>
        <p className="text-muted-foreground mt-2">
          Search and learn about medicines
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search medicines... (e.g. Paracetamol, Ibuprofen)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary pl-12"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Results Grid */}
      {searched && (
        <>
          {loading ? (
            <p className="text-muted-foreground">Searching medicine database...</p>
          ) : searchResults.length === 0 ? (
            <p className="text-muted-foreground">No medicines found. Try another search term.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((medicine) => (
                <Card
                  key={medicine.id}
                  className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                  onClick={() => handleSelectMedicine(medicine)}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">
                        {getMedicineName(medicine.content)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {getMedicineType(medicine.content)}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {getMedicineUses(medicine.content)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Detail Panel */}
      {selectedMedicine && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{getMedicineName(selectedMedicine.content)}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {getMedicineType(selectedMedicine.content)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSelectedMedicine(null); setMedicineDetail(null); }}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {detailLoading ? (
              <p className="text-muted-foreground">Loading detailed information...</p>
            ) : medicineDetail ? (
              <>
                <div>
                  <h3 className="font-semibold mb-2">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {medicineDetail.answer}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ {medicineDetail.disclaimer}
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedMedicine.content}
                </p>
              </div>
            )}
            <Button className="w-full">Consult Doctor About This Medicine</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}