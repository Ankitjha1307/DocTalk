'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: BarChart3,
      title: 'Lab Report Translator',
      description: 'Upload reports and get simple explanations.',
    },
    {
      icon: Pill,
      title: 'Drug Interaction Checker',
      description: 'Check medicine combinations instantly.',
    },
    {
      icon: TrendingUp,
      title: 'Health Trend Tracking',
      description: 'AI-powered graphs showing improvements and risks.',
    },
    {
      icon: MessageCircle,
      title: 'AI Pharmacist',
      description: 'Ask questions about medicines and symptoms.',
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Medicine and health checkup reminders.',
    },
    {
      icon: Heart,
      title: 'Emergency Health Card',
      description: 'Instant access to critical health information.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      text: 'DocTalk helped me understand my lab reports in minutes instead of waiting days for an appointment.',
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Pharmacist',
      text: 'An excellent tool for patient education and ensuring medication safety.',
    },
    {
      name: 'Emma Davis',
      role: 'Patient',
      text: 'The medicine interaction checker gives me peace of mind when taking multiple medications.',
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

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu Items */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link
                href="#features"
                className="block px-4 py-2 hover:bg-muted rounded-lg"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="block px-4 py-2 hover:bg-muted rounded-lg"
              >
                Testimonials
              </Link>
              <Link
                href="/dashboard"
                className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Dashboard
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-6xl font-bold">
              DocTalk – Smarter Health. Faster Answers.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Understand medical reports, check medicine safety, track health trends, and manage
              healthcare records in one intelligent platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Try DocTalk
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium px-8 py-3 border border-input bg-background hover:bg-accent"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose DocTalk?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-6 border rounded-lg bg-background">
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-16">What Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="p-6 border rounded-lg bg-muted/50">
                <p className="mb-4 text-muted-foreground italic">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="mx-auto max-w-7xl text-center text-muted-foreground">
          <p>&copy; 2024 DocTalk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
