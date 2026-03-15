'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus, X, Edit2, Check, AlertCircle } from 'lucide-react';
import { remindersAPI } from '@/lib/api';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [todayReminders, setTodayReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    medicineName: '',
    time: '08:00',
    frequency: 'daily',
    notes: '',
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const [today, all] = await Promise.all([
        remindersAPI.getTodayReminders(),
        remindersAPI.getReminders(),
      ]);
      setTodayReminders(today.reminders || []);
      setReminders(all.reminders || []);
    } catch (err) {
      console.error('[Reminders] Fetch error:', err);
      setError('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReminder = async () => {
    if (!formData.medicineName.trim()) {
      setError('Medicine name is required');
      return;
    }

    try {
      await remindersAPI.createReminder(formData);
      setFormData({
        medicineName: '',
        time: '08:00',
        frequency: 'daily',
        notes: '',
      });
      setShowModal(false);
      await fetchReminders();
    } catch (err) {
      console.error('[Reminders] Create error:', err);
      setError(`Failed to create reminder: ${err.message}`);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await remindersAPI.deleteReminder(id);
      await fetchReminders();
    } catch (err) {
      console.error('[Reminders] Delete error:', err);
      setError('Failed to delete reminder');
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await remindersAPI.markAsCompleted(id);
      await fetchReminders();
    } catch (err) {
      console.error('[Reminders] Mark complete error:', err);
      setError('Failed to mark reminder as completed');
    }
  };

  const mockReminders = [
    {
      id: '1',
      medicineName: 'Metformin',
      time: '08:00',
      frequency: 'daily',
      dosage: '500mg',
      nextDue: 'Today 8:00 AM',
      status: 'pending',
    },
    {
      id: '2',
      medicineName: 'Lisinopril',
      time: '20:00',
      frequency: 'daily',
      dosage: '10mg',
      nextDue: 'Today 8:00 PM',
      status: 'pending',
    },
    {
      id: '3',
      medicineName: 'Vitamin D',
      time: '09:00',
      frequency: 'once',
      dosage: '1000 IU',
      nextDue: 'Tomorrow 9:00 AM',
      status: 'pending',
    },
  ];

  return (
    <main className="flex-1 lg:ml-64 mt-20 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medicine Reminders</h1>
          <p className="text-muted-foreground">Stay on top of your medication schedule</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Reminder
        </Button>
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

      {/* Today's Reminders */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Reminders</h2>
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Loading reminders...
            </CardContent>
          </Card>
        ) : todayReminders.length > 0 || mockReminders.length > 0 ? (
          <div className="grid gap-4">
            {(todayReminders.length > 0 ? todayReminders : mockReminders).map((reminder) => (
              <Card key={reminder.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Bell className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{reminder.medicineName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {reminder.time} • {reminder.frequency}
                        </p>
                        {reminder.dosage && (
                          <p className="text-sm text-muted-foreground">Dosage: {reminder.dosage}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMarkCompleted(reminder.id)}
                        className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                        title="Mark as completed"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No reminders for today
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Reminders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Reminders</h2>
        {reminders.length > 0 ? (
          <div className="space-y-2">
            {reminders.slice(0, 5).map((reminder) => (
              <Card key={reminder.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{reminder.medicineName}</p>
                      <p className="text-sm text-muted-foreground">
                        {reminder.time} • {reminder.nextDue}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No upcoming reminders
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Create New Reminder</CardTitle>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Medicine Name</label>
                <input
                  type="text"
                  value={formData.medicineName}
                  onChange={(e) =>
                    setFormData({ ...formData, medicineName: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter medicine name"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="daily">Daily</option>
                  <option value="twice_daily">Twice Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="once">Once</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add notes..."
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCreateReminder}
                  className="flex-1"
                >
                  Create Reminder
                </Button>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
