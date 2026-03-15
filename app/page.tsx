"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Pill,
  TrendingUp,
  MessageCircle,
  Bell,
  Heart,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: BarChart3,
      title: "Lab Report Translator",
      description: "Upload reports and get simple explanations.",
    },
    {
      icon: Pill,
      title: "Drug Interaction Checker",
      description: "Check medicine combinations instantly.",
    },
    {
      icon: TrendingUp,
      title: "Health Trend Tracking",
      description: "AI-powered graphs showing improvements and risks.",
    },
    {
      icon: MessageCircle,
      title: "AI Pharmacist",
      description: "Ask questions about medicines and symptoms.",
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Medicine and health checkup reminders.",
    },
    {
      icon: Heart,
      title: "Emergency Health Card",
      description: "Instant access to critical health information.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      text: "DocTalk helped me understand my lab reports in minutes instead of waiting days for an appointment.",
    },
    {
      name: "Dr. Michael Chen",
      role: "Pharmacist",
      text: "An excellent tool for patient education and ensuring medication safety.",
    },
    {
      name: "Emma Davis",
      role: "Patient",
      text: "The medicine interaction checker gives me peace of mind when taking multiple medications.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">DocTalk</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-sm hover:text-primary transition-colors">
                Testimonials
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Dashboard
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t">
              <Link
                href="#features"
                className="block py-2 text-sm hover:text-primary transition-colors"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="block py-2 text-sm hover:text-primary transition-colors"
              >
                Testimonials
              </Link>
              <Link href="/dashboard" className="block pt-2">
                <Button className="w-full">Dashboard</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                DocTalk – Smarter Health. Faster Answers.
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Understand medical reports, check medicine safety, track health trends, and manage healthcare records in one intelligent platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    Try DocTalk <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-4 text-3xl">
                  <BarChart3 className="w-12 h-12 text-primary" />
                  <Pill className="w-12 h-12 text-accent" />
                  <Heart className="w-12 h-12 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Healthcare Analytics Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to take control of your health
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-card rounded-xl p-6 border hover:shadow-lg hover:border-primary/50 transition-all"
                >
                  <Icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">What Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of people improving their health
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-card border rounded-xl p-6 space-y-4"
              >
                <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Start?</h2>
          <p className="text-lg opacity-90">
            Your journey to better health management starts here.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="gap-2">
              Access Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 sm:px-6 lg:px-8 py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                DocTalk
              </h3>
              <p className="text-sm text-muted-foreground">
                AI-powered health assistant for smarter health management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Features</Link></li>
                <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">About</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
                <li><Link href="#" className="hover:text-primary">Terms</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 DocTalk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
