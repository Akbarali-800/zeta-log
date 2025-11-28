import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signIn, signInWithBiometric } from '../redux/slices/authSlice';
import { Fingerprint, Loader } from 'lucide-react';
import { isBiometricAvailable, authenticateWithBiometric } from '../utils/biometric';
import '../styles/auth.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [biometricEmail, setBiometricEmail] = useState('');
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const supported = await isBiometricAvailable();
    setIsBiometricSupported(supported);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      dispatch(signIn({ email, password }));
      navigate('/user');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleBiometricLogin = async () => {
    setError('');
    setBiometricLoading(true);

    try {
      if (!biometricEmail) {
        setError('Please enter your email address');
        setBiometricLoading(false);
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === biometricEmail);

      if (!user) {
        setError('Email not found');
        setBiometricLoading(false);
        return;
      }

      if (!user.biometricCredentials) {
        setError('No biometric credentials registered for this account');
        setBiometricLoading(false);
        return;
      }

      await authenticateWithBiometric(biometricEmail);

      dispatch(signInWithBiometric({ email: biometricEmail }));
      navigate('/user');
    } catch (err) {
      setError(err.message || 'Biometric authentication failed');
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        {isBiometricSupported && (
          <div className="biometric-divider">
            <span>or</span>
          </div>
        )}

        {isBiometricSupported && (
          <div className="biometric-section">
            <div className="form-group">
              <label htmlFor="biometric-email">Email for Biometric</label>
              <input
                type="email"
                id="biometric-email"
                value={biometricEmail}
                onChange={(e) => setBiometricEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <button
              type="button"
              onClick={handleBiometricLogin}
              disabled={biometricLoading}
              className="biometric-button"
            >
              {biometricLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Fingerprint size={18} />
                  Sign In with Biometric
                </>
              )}
            </button>
          </div>
        )}

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
