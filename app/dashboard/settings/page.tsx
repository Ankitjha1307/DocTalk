"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Lock, User, Eye, LogOut } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    medicineReminders: true,
    weeklyReport: true,
    twoFactor: false,
    privateProfile: true,
  });

  const handleToggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const sections = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          key: "emailNotifications",
          label: "Email Notifications",
          description: "Receive updates via email",
        },
        {
          key: "pushNotifications",
          label: "Push Notifications",
          description: "Get push alerts on your device",
        },
        {
          key: "medicineReminders",
          label: "Medicine Reminders",
          description: "Receive reminder notifications",
        },
        {
          key: "weeklyReport",
          label: "Weekly Health Report",
          description: "Get weekly health summary",
        },
      ],
    },
    {
      title: "Security",
      icon: Lock,
      items: [
        {
          key: "twoFactor",
          label: "Two-Factor Authentication",
          description: "Add extra security to your account",
        },
        {
          key: "privateProfile",
          label: "Private Profile",
          description: "Keep your health data private",
        },
      ],
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
              AJ
            </div>
            <div className="flex-1">
              <p className="font-semibold">Ankit Kumar Jha</p>
              <p className="text-sm text-muted-foreground">ankit.jha@example.com</p>
            </div>
            <Button variant="outline">Change Avatar</Button>
          </div>
          <div className="border-t pt-4 grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value="ankit.jha@example.com"
                disabled
                className="w-full px-3 py-2 mt-1 rounded-lg border bg-muted focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 mt-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <Button>Update Profile</Button>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      {sections.map((section, idx) => {
        const Icon = section.icon;
        return (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                      settings[item.key as keyof typeof settings]
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        settings[item.key as keyof typeof settings]
                          ? "translate-x-5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Privacy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Privacy & Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your health data is encrypted and secure. We never share your
            information with third parties without your consent.
          </p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              Download My Data
            </Button>
            <Button variant="outline" className="w-full">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <Button
            variant="destructive"
            className="gap-2 w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>DocTalk v1.0.0</p>
        <p>
          <a href="#" className="hover:text-primary">
            Privacy Policy
          </a>
          {" • "}
          <a href="#" className="hover:text-primary">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
}
