import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const chatbotRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setIsChatbotOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicine-search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleChatbotToggle = () => {
    setIsChatbotOpen(!isChatbotOpen);
    setIsProfileOpen(false);
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsChatbotOpen(false);
  };

  const profileMenuItems = [
    { icon: 'fa-user', label: 'My Account', path: '/my-account' },
    { icon: 'fa-folder', label: 'Health Record Locker', path: '/health-records' },
    { icon: 'fa-id-card', label: 'Emergency Health Card', path: '/emergency-card' },
    { icon: 'fa-chart-bar', label: 'AI Report Comparison', path: '/report-comparison' },
    { icon: 'fa-tags', label: 'Medicine Price Comparison', path: '/price-comparison' },
    { icon: 'fa-file-medical', label: 'Lab Reports', path: '/lab-reports' },
    { icon: 'fa-bell', label: 'Health Reminders', path: '/reminders' },
    { icon: 'fa-capsules', label: 'Medicine Tracker', path: '/medicine-tracker' },
    { icon: 'fa-sign-out-alt', label: 'Logout', path: '/logout', isLogout: true }
  ];

  const chatbotSuggestions = [
    "Explain my lab report",
    "What are the side effects of...",
    "Compare medicine prices",
    "Set a vaccination reminder",
    "Explain medical terms",
    "Find generic alternatives"
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-stethoscope text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-blue-800">DocTalk</span>
          </Link>
          
          {/* Medicine Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search medicines, symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className={`font-medium transition-colors ${
                isActive('/features') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Features
            </Link>
            <Link 
              to="/medicine-search" 
              className={`font-medium transition-colors ${
                isActive('/medicine-search') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Medicines
            </Link>
            <Link 
              to="/price-comparison" 
              className={`font-medium transition-colors ${
                isActive('/price-comparison') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Price Compare
            </Link>
          </nav>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Chatbot Button */}
            <div className="relative" ref={chatbotRef}>
              <button
                onClick={handleChatbotToggle}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <i className="fas fa-robot"></i>
                <span className="hidden lg:inline">AI Assistant</span>
              </button>
              
              {isChatbotOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800">DocTalk AI Assistant</h3>
                  <p className="text-sm text-gray-600">How can I help you today?</p>
                </div>
                
                <div className="p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {[
                      "Explain my lab report",
                      "What are the side effects of...",
                      "Compare medicine prices",
                      "Set a vaccination reminder",
                      "Explain medical terms",
                      "Find generic alternatives"
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        onClick={() => {
                          setIsChatbotOpen(false);
                          handleChatbotToggle(); // This will open the full chatbot
                          // You might want to pre-fill the input with the suggestion
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <i className="fas fa-lightbulb text-yellow-500"></i>
                          <span className="text-sm text-gray-700">{suggestion}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={handleChatbotToggle}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    Open Full Chat
                  </button>
                </div>
              </div>
            )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={handleProfileToggle}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                <i className="fas fa-user-circle text-gray-600"></i>
                <span className="hidden lg:inline text-gray-700">Profile</span>
                <i className={`fas fa-chevron-down text-gray-500 text-xs transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}></i>
              </button>
              
              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-blue-600"></i>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">John Doe</p>
                        <p className="text-sm text-gray-600">john.doe@example.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 max-h-80 overflow-y-auto">
                    {profileMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={() => setIsProfileOpen(false)}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          item.isLogout 
                            ? 'text-red-600 hover:bg-red-50 border-t border-gray-200 mt-2' 
                            : 'text-gray-700 hover:bg-blue-50'
                        }`}
                      >
                        <i className={`fas ${item.icon} w-5 text-center ${item.isLogout ? 'text-red-500' : 'text-gray-500'}`}></i>
                        <span className="flex-1">{item.label}</span>
                        {!item.isLogout && <i className="fas fa-chevron-right text-gray-400 text-xs"></i>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
        
        {/* Medicine Search Bar - Mobile */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search medicines, symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </form>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`font-medium ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/features" 
                className={`font-medium ${
                  isActive('/features') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/medicine-search" 
                className={`font-medium ${
                  isActive('/medicine-search') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Medicine Search
              </Link>
              <Link 
                to="/price-comparison" 
                className={`font-medium ${
                  isActive('/price-comparison') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Price Comparison
              </Link>
              <Link 
                to="/health-records" 
                className={`font-medium ${
                  isActive('/health-records') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Health Records
              </Link>
              <div className="pt-2 flex flex-col space-y-2">
                <button 
                  onClick={handleChatbotToggle}
                  className="py-2 bg-green-500 text-white font-medium rounded-lg text-center"
                >
                  <i className="fas fa-robot mr-2"></i>
                  AI Assistant
                </button>
                <Link 
                  to="/login" 
                  className="py-2 text-blue-600 font-medium rounded-lg border border-blue-600 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="py-2 bg-blue-600 text-white font-medium rounded-lg text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

    </header>

  );
};

export default Header;