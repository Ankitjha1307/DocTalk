'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Phone, AlertCircle, Edit2, Save, X } from 'lucide-react';
import { emergencyCardAPI } from '@/lib/api';

export default function EmergencyCard() {
  const [cardData, setCardData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchCardData();
  }, []);

  const fetchCardData = async () => {
    try {
      const data = await emergencyCardAPI.getCard();
      setCardData(data);
      setEditData(data);
    } catch (err) {
      console.error('[Emergency Card] Fetch error:', err);
      // Use mock data
      const mockData = {
        name: 'John Doe',
        dob: '1985-06-15',
        bloodType: 'O+',
        allergies: ['Penicillin', 'Peanuts'],
        medications: [
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
        ],
        medicalConditions: ['Type 2 Diabetes', 'Hypertension'],
        emergencyContacts: [
          { name: 'Sarah Doe', relationship: 'Spouse', phone: '+1-555-0101' },
          { name: 'Dr. James Smith', relationship: 'Doctor', phone: '+1-555-0202' },
        ],
        insurance: {
          provider: 'Blue Cross',
          policyNumber: 'BC123456789',
          groupNumber: 'GRP987654',
        },
      };
      setCardData(mockData);
      setEditData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await emergencyCardAPI.updateCard(editData);
      setCardData(editData);
      setIsEditing(false);
      alert('Emergency card updated successfully');
    } catch (err) {
      console.error('[Emergency Card] Update error:', err);
      setError(`Failed to update card: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 lg:ml-64 mt-20 p-4 sm:p-6 lg:p-8">
        <p className="text-muted-foreground">Loading emergency card...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 lg:ml-64 mt-20 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Emergency Health Card</h1>
          <p className="text-muted-foreground">Critical health information for emergencies</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
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

      {cardData && (
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                    />
                  ) : (
                    <p className="mt-1 text-lg font-semibold">{cardData.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.dob || ''}
                      onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                    />
                  ) : (
                    <p className="mt-1">{cardData.dob}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Health Information */}
          <Card className="border-2 border-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Critical Health Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Blood Type</label>
                <p className="mt-1 text-2xl font-bold text-red-600">{cardData.bloodType}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Allergies</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={(editData.allergies || []).join(', ')}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        allergies: e.target.value.split(',').map((a) => a.trim()),
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    placeholder="Comma separated"
                  />
                ) : (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {cardData.allergies?.map((allergy, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        {allergy}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cardData.medications?.map((med, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <p className="font-semibold">{med.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {med.dosage} • {med.frequency}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Medical Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {cardData.medicalConditions?.map((condition, idx) => (
                  <span key={idx} className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm">
                    {condition}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cardData.emergencyContacts?.map((contact, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                  </div>
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
                    <Phone className="w-4 h-4" />
                    {contact.phone}
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Insurance Information */}
          <Card>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Provider</label>
                <p className="mt-1 font-semibold">{cardData.insurance?.provider}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Policy Number</label>
                <p className="mt-1 font-semibold">{cardData.insurance?.policyNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Group Number</label>
                <p className="mt-1 font-semibold">{cardData.insurance?.groupNumber}</p>
              </div>
            </CardContent>
          </Card>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-4">
              <Button onClick={handleSaveChanges} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
