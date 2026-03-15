"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Clock, Plus, X, Check } from "lucide-react";

export default function Reminders() {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      medicine: "Metformin",
      time: "8:00 AM",
      frequency: "Daily",
      notes: "Take with breakfast",
      completed: false,
    },
    {
      id: 2,
      medicine: "Aspirin",
      time: "12:00 PM",
      frequency: "Daily",
      notes: "After lunch",
      completed: true,
    },
    {
      id: 3,
      medicine: "Vitamin D",
      time: "6:00 PM",
      frequency: "Daily",
      notes: "Evening dose",
      completed: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    medicine: "",
    time: "09:00",
    frequency: "Daily",
    notes: "",
  });

  const todaysReminders = reminders.filter((r) =>
    r.frequency.includes("Daily")
  );
  const upcomingReminders = reminders.slice(3);

  const handleAddReminder = () => {
    if (formData.medicine.trim()) {
      setReminders([
        ...reminders,
        {
          id: reminders.length + 1,
          ...formData,
          completed: false,
        },
      ]);
      setFormData({
        medicine: "",
        time: "09:00",
        frequency: "Daily",
        notes: "",
      });
      setShowModal(false);
    }
  };

  const toggleReminder = (id) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reminders</h1>
          <p className="text-muted-foreground mt-2">
            Manage your medicine and health reminders
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Reminder
        </Button>
      </div>

      {/* Today's Reminders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Today's Reminders</h2>
        <div className="space-y-3">
          {todaysReminders.map((reminder) => (
            <Card key={reminder.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        reminder.completed
                          ? "bg-green-600 border-green-600"
                          : "border-muted-foreground hover:border-primary"
                      }`}
                    >
                      {reminder.completed && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <div>
                      <p
                        className={`font-semibold ${
                          reminder.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        Take {reminder.medicine}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {reminder.time}
                        </span>
                        <span>{reminder.frequency}</span>
                        {reminder.notes && <span>• {reminder.notes}</span>}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Reminders</h2>
          <div className="space-y-3">
            {upcomingReminders.map((reminder) => (
              <Card key={reminder.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{reminder.medicine}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {reminder.time}
                        </span>
                        <span>{reminder.frequency}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Reminder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Reminder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Medicine Name</label>
                <input
                  type="text"
                  value={formData.medicine}
                  onChange={(e) =>
                    setFormData({ ...formData, medicine: e.target.value })
                  }
                  className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Aspirin"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                  className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Daily</option>
                  <option>Twice Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  placeholder="e.g., Take with food"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddReminder}
                  className="flex-1"
                >
                  Create Reminder
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
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