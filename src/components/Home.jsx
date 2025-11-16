import { useState, useEffect } from 'react';

const DocTalkLanding = ({onOpenChatbot,onOpenFileUpload}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 ">


      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <button
          onClick={onOpenChatbot}
          className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-2xl group"
          style={{ width: '60px', height: '60px' }}
        >
          <i className="fas fa-robot text-xl"></i>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            <i className="fas fa-plus"></i>
          </div>
        </button>

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 mb-6">
              <span className="text-sm font-medium">Team: Code Blooded | NerdsRoom × Build with Gemini Hackathon</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smarter Health. <span className="text-blue-200">Faster Answers.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Your AI-Powered Health Navigator
            </p>
            <p className="text-lg mb-10 max-w-2xl mx-auto text-blue-100">
              DocTalk simplifies healthcare for everyone. Understand medical reports, access reliable medicine information, track health trends, and stay prepared with reminders—all in one secure platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"    onClick={onOpenFileUpload}>
                Try DocTalk Free
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problems We Solve Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Problems We Solve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Healthcare challenges that affect millions, solved with intelligent technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: 'fa-pills', 
                title: 'Medication Management', 
                desc: 'Managing multiple medications is a constant challenge for patients and caregivers.' 
              },
              { 
                icon: 'fa-calendar-times', 
                title: 'Forgotten Health Actions', 
                desc: 'Important appointments, vaccinations, and emergency preparations are often overlooked.' 
              },
              { 
                icon: 'fa-file-medical', 
                title: 'Confusing Lab Reports', 
                desc: 'Users feel anxious and unsure about their health when faced with complex medical jargon.' 
              },
              { 
                icon: 'fa-chart-line', 
                title: 'Scattered Health Data', 
                desc: 'Tracking health trends over time is difficult with records spread across various sources.' 
              },
              { 
                icon: 'fa-info-circle', 
                title: 'Unreliable Medicine Info', 
                desc: 'Finding accurate and trustworthy information about medications is challenging.' 
              },
              { 
                icon: 'fa-clinic-medical', 
                title: 'The Healthcare Maze', 
                desc: 'Navigating the complex healthcare system can be overwhelming and confusing.' 
              }
            ].map((problem, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <i className={`fas ${problem.icon} text-blue-600 text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{problem.title}</h3>
                <p className="text-gray-600">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">DocTalk Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare tools designed to simplify your health journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Current Features */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                Available Today
              </h3>
              
              <div className="space-y-6">
                {[
                  { 
                    icon: 'fa-file-medical-alt', 
                    title: 'Report Reader & Translator', 
                    desc: 'Simple explanations, color-coded insights, and local sensitive data processing.' 
                  },
                  { 
                    icon: 'fa-chart-bar', 
                    title: 'AI Report Comparison & Trends', 
                    desc: 'Tracks improvements, worsening conditions, and provides insightful graphs.' 
                  },
                  { 
                    icon: 'fa-capsules', 
                    title: 'Medicine Information Search', 
                    desc: 'Details on purpose, dosage, side effects, interactions, and alternatives.' 
                  },
                  { 
                    icon: 'fa-robot', 
                    title: 'Smart Medical Chatbot', 
                    desc: 'Explains reports, medicines, and symptoms (non-diagnostic guidance).' 
                  },
                  { 
                    icon: 'fa-bell', 
                    title: 'Vaccination & Health Reminders', 
                    desc: 'Personalized reminders based on age, gender, and health needs.' 
                  },
                  { 
                    icon: 'fa-lock', 
                    title: 'Health Record Locker', 
                    desc: 'Secure storage for reports, prescriptions, and family profiles with PDF export.' 
                  },
                  { 
                    icon: 'fa-id-card', 
                    title: 'Emergency Health Card', 
                    desc: 'Quick access to blood group, allergies, medications, and emergency contacts.' 
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${feature.icon} text-blue-600`}></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-1">{feature.title}</h4>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Future Features */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                Coming Soon
              </h3>
              
              <div className="space-y-6">
                {[
                  { 
                    icon: 'fa-user-md', 
                    title: 'Find Doctors', 
                    desc: 'Connect with healthcare professionals based on your needs and location.' 
                  },
                  { 
                    icon: 'fa-calendar-check', 
                    title: 'Appointment Booking', 
                    desc: 'Schedule doctor appointments directly through the platform.' 
                  },
                  { 
                    icon: 'fa-hospital', 
                    title: 'OPD Slot Booking', 
                    desc: 'Book outpatient department slots with ease.' 
                  },
                  { 
                    icon: 'fa-tags', 
                    title: 'Medicine Price Comparison', 
                    desc: 'Compare prices for brand, generic, online, and offline options.' 
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 opacity-70">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${feature.icon} text-gray-600`}></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-1">{feature.title}</h4>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Robust Tech Stack</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with modern technologies for performance, security, and scalability
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { name: 'Frontend', tech: 'React / Next.js', icon: 'fa-code' },
              { name: 'Backend', tech: 'Node.js + Express', icon: 'fa-server' },
              { name: 'Database', tech: 'MongoDB / Firebase', icon: 'fa-database' },
              { name: 'AI Layer', tech: 'Gemini API', icon: 'fa-brain' },
              { name: 'Authentication', tech: 'Google Auth / OTP', icon: 'fa-user-shield' },
              { name: 'Hosting', tech: 'Vercel / Render', icon: 'fa-cloud' }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`fas ${item.icon} text-blue-600 text-xl`}></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600">{item.tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">DocTalk: Unique Value & Impact</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Transforming healthcare experiences with intelligent technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="fas fa-chart-line mr-3 text-blue-200"></i>
                AI-Powered Health Tracking
              </h3>
              <p className="text-blue-100">
                Continuous analysis of past reports for trends, improvements, and risk flags.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="fas fa-laptop-medical mr-3 text-blue-200"></i>
                Comprehensive Web Platform
              </h3>
              <p className="text-blue-100">
                All your health needs for reports, medicines, reminders, and emergency info in one place.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="fas fa-shield-alt mr-3 text-blue-200"></i>
                Privacy-First Design
              </h3>
              <p className="text-blue-100">
                Sensitive information is processed locally, ensuring data never leaves your device.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="fas fa-heartbeat mr-3 text-blue-200"></i>
                Our Impact
              </h3>
              <ul className="text-blue-100 list-disc list-inside space-y-2">
                <li>Reduces confusion and anxiety around medical data</li>
                <li>Empowers users with informed health decisions</li>
                <li>Encourages proactive and preventive healthcare</li>
                <li>Ensures unparalleled data privacy and security</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Section */}
      <section id="business" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Sustainable Growth: Business Model</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A sustainable approach to delivering value while ensuring accessibility
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: 'fa-layer-group', 
                title: 'Freemium Model', 
                desc: 'Basic features are free, with premium subscriptions unlocking advanced insights, trend tracking, and extended health records.' 
              },
              { 
                icon: 'fa-cubes', 
                title: 'Subscription Tiers', 
                desc: 'Tiered options for family profiles, longer report history, and additional reminder functionalities.' 
              },
              { 
                icon: 'fa-handshake', 
                title: 'Strategic Partnerships', 
                desc: 'Collaborations with clinics, telemedicine platforms, pharmacies, and health insurance providers.' 
              },
              { 
                icon: 'fa-ad', 
                title: 'Non-Intrusive Ads', 
                desc: 'Carefully curated, health-related advertisements that are verified and safe for users.' 
              }
            ].map((model, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <i className={`fas ${model.icon} text-blue-600 text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{model.title}</h3>
                <p className="text-gray-600">{model.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Clarity and Control for Your Health Journey
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            From reports and medicines to reminders and emergency info, DocTalk brings clarity and control to your health journey. It's the platform people will naturally turn to for informed, confident, and timely healthcare decisions.
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg text-lg">
            Start Your Health Journey Today
          </button>
        </div>
      </section>

    </div>
  );
};

export default DocTalkLanding;