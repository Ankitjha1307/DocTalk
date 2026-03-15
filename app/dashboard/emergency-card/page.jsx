"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import {
  AlertCircle,
  Edit2,
  Heart,
  Phone,
  AlertTriangle,
  Pill,
  User,
} from "lucide-react";

export default function EmergencyHealthCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [cardData, setCardData] = useState({
    fullName: "Ankit Kumar Jha",
    dateOfBirth: "1995-06-15",
    bloodType: "O+",
    allergies: "Penicillin, Sulfa drugs",
    medications: "Metformin 500mg daily, Aspirin 75mg daily",
    conditions: "Type 2 Diabetes, Hypertension",
    emergencyContact1: {
      name: "Sarah Jha",
      relation: "Spouse",
      phone: "+1 (555) 123-4567",
    },
    emergencyContact2: {
      name: "Dr. Michael Smith",
      relation: "Primary Doctor",
      phone: "+1 (555) 987-6543",
    },
    insurance: "Blue Cross Insurance | Policy: ABC123456",
    additionalNotes: "Vegetarian diet, prefers morning appointments",
  });

  const [formData, setFormData] = useState(cardData);

  const handleSave = () => {
    setCardData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(cardData);
    setIsEditing(false);
  };

  const displayData = isEditing ? formData : cardData;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Emergency Health Card</h1>
          <p className="text-muted-foreground mt-2">
            Critical health information accessible anytime
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit2 className="w-4 h-4" />
            Edit Card
          </Button>
        )}
      </div>

      {/* Alert */}
      <Card className="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
        <CardContent className="pt-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-900 dark:text-red-100">
            <p className="font-semibold">Important:</p>
            <p>
              Keep this information up to date. Emergency responders rely on
              accurate health information.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Card */}
      {isEditing ? (
        // Edit Mode
        <Card>
          <CardHeader>
            <CardTitle>Edit Emergency Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Blood Type</label>
                <input
                  type="text"
                  value={formData.bloodType}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodType: e.target.value })
                  }
                  className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Allergies</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                  className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Current Medications</label>
              <textarea
                value={formData.medications}
                onChange={(e) =>
                  setFormData({ ...formData, medications: e.target.value })
                }
                className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Medical Conditions</label>
              <textarea
                value={formData.conditions}
                onChange={(e) =>
                  setFormData({ ...formData, conditions: e.target.value })
                }
                className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Emergency Contact 1 - Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact1.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact1: {
                        ...formData.emergencyContact1,
                        name: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Emergency Contact 1 - Phone
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContact1.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact1: {
                        ...formData.emergencyContact1,
                        phone: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // View Mode
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="text-lg font-semibold">{displayData.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="text-lg font-semibold">{displayData.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Type</p>
                <p className="text-lg font-semibold text-red-600">
                  {displayData.bloodType}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Critical Health Info */}
          <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
                <AlertTriangle className="w-5 h-5" />
                Critical Health Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  Allergies
                </p>
                <p className="text-red-700 dark:text-red-300 font-semibold">
                  {displayData.allergies}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  Medical Conditions
                </p>
                <p className="text-red-700 dark:text-red-300">
                  {displayData.conditions}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{displayData.medications}</p>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold">{displayData.emergencyContact1.name}</p>
                <p className="text-sm text-muted-foreground">
                  {displayData.emergencyContact1.relation}
                </p>
                <p className="text-primary font-medium">
                  {displayData.emergencyContact1.phone}
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold">{displayData.emergencyContact2.name}</p>
                <p className="text-sm text-muted-foreground">
                  {displayData.emergencyContact2.relation}
                </p>
                <p className="text-primary font-medium">
                  {displayData.emergencyContact2.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Insurance */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Insurance Information</p>
              <p className="font-semibold mt-2">{displayData.insurance}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}