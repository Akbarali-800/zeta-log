import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, Shield, Lock, Users } from 'lucide-react';

const Home = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AuthApp
            </h1>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <Link
                  to="/user"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="px-6 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Secure Authentication
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience seamless authentication with Redux Toolkit and modern React.
            Your data is stored securely with complete control.
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              Get Started
              <ArrowRight size={20} />
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <Shield size={28} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Secure</h3>
            <p className="text-gray-600">
              Your credentials are stored securely with industry-standard practices
              and encryption protocols.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <Lock size={28} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Private</h3>
            <p className="text-gray-600">
              Your data belongs to you. We use local storage to keep your
              information under your control.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <Users size={28} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Easy to Use</h3>
            <p className="text-gray-600">
              Simple and intuitive interface that makes authentication
              straightforward for everyone.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
