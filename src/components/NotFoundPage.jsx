import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        
        {/* Animated 404 Graphic */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-800 opacity-90">
            404
          </div>
          
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Oops! The page you're looking for seems to have taken a sick day. 
            Don't worry, our medical team is on it!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          <Link
            to="/"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
              <i className="fas fa-home text-blue-600 text-xl"></i>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Home</h3>
            <p className="text-sm text-gray-600">Return to the homepage</p>
          </Link>

          <Link
            to="/features"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
              <i className="fas fa-star text-green-600 text-xl"></i>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Features</h3>
            <p className="text-sm text-gray-600">Explore our features</p>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
              <i className="fas fa-arrow-left text-purple-600 text-xl"></i>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Go Back</h3>
            <p className="text-sm text-gray-600">Return to previous page</p>
          </button>
        </div>

        {/* Emergency Help Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-ambulance text-red-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Need Immediate Help?</h3>
          </div>
          <p className="text-gray-600 mb-4">
            If you're experiencing a medical emergency, please contact emergency services immediately.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <a
              href="tel:108"
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <i className="fas fa-phone"></i>
              <span>Emergency: 108</span>
            </a>
            <a
              href="tel:102"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <i className="fas fa-ambulance"></i>
              <span>Ambulance: 102</span>
            </a>
          </div>
        </div>


        {/* Team Credit */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Built with ❤️ by <span className="font-semibold">Team Code Blooded | NerdsRoom</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;