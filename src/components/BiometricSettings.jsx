import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Fingerprint,
  Check,
  AlertCircle,
  Trash2,
  Loader,
} from 'lucide-react';
import {
  isBiometricAvailable,
  registerBiometric,
  removeBiometric,
} from '../utils/biometric';

const BiometricSettings = () => {
  const user = useSelector((state) => state.auth.user);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    const available = await isBiometricAvailable();
    setIsAvailable(available);

    if (user?.email && available) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find(u => u.email === user.email);
      setIsEnrolled(!!currentUser?.biometricCredentials);
    }
  };

  const handleEnrollBiometric = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const credential = await registerBiometric(user.email);

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.email === user.email);

      if (userIndex !== -1) {
        users[userIndex].biometricCredentials = credential;
        localStorage.setItem('users', JSON.stringify(users));
        setIsEnrolled(true);
        setMessage({
          type: 'success',
          text: 'Biometric authentication enabled successfully!',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to enroll biometric',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBiometric = () => {
    if (window.confirm('Are you sure you want to remove biometric authentication?')) {
      try {
        removeBiometric(user.email);
        setIsEnrolled(false);
        setMessage({
          type: 'success',
          text: 'Biometric authentication removed',
        });
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to remove biometric',
        });
      }
    }
  };

  if (!isAvailable) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle size={24} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Biometric Not Available
            </h3>
            <p className="text-gray-600">
              Your device doesn't support biometric authentication. Try using a device with
              Face ID, Touch ID, or Windows Hello.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Fingerprint size={24} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Biometric Authentication
          </h3>
          <p className="text-gray-600 text-sm">
            {isEnrolled
              ? 'Biometric authentication is enabled for your account'
              : 'Set up biometric authentication for faster, more secure login'}
          </p>
        </div>
      </div>

      {message.text && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="flex gap-3">
        {!isEnrolled ? (
          <button
            onClick={handleEnrollBiometric}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <Fingerprint size={18} />
                Enable Biometric
              </>
            )}
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-lg">
              <Check size={18} className="text-green-600" />
              <span className="text-green-700 font-medium">Enabled</span>
            </div>
            <button
              onClick={handleRemoveBiometric}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200"
            >
              <Trash2 size={18} />
              Remove
            </button>
          </>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Biometric authentication uses your device's built-in
          security features (Face ID, Touch ID, Windows Hello, etc.). Your biometric data
          is never stored on our servers.
        </p>
      </div>
    </div>
  );
};

export default BiometricSettings;
