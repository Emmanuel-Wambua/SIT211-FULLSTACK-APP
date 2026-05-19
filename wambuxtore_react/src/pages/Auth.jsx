import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f7f7f5',
    display: 'flex',
    flexDirection: 'column',
  },
  hero: {
    background: '#1a1b1f',
    padding: '64px 24px 80px',
    textAlign: 'center',
  },
  heroLabel: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: '16px',
  },
  heroTitle: {
    fontFamily: 'Oswald, sans-serif',
    fontSize: '42px',
    fontWeight: '500',
    color: '#fff',
    margin: 0,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  heroSub: {
    color: '#888',
    fontSize: '14px',
    marginTop: '12px',
  },
  cardWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '0 16px 80px',
    marginTop: '-32px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
    width: '100%',
    maxWidth: '480px',
    overflow: 'hidden',
  },
  toggle: {
    display: 'flex',
    borderBottom: '1px solid #f0f0f0',
  },
  toggleBtn: (active) => ({
    flex: 1,
    padding: '18px',
    border: 'none',
    background: active ? '#fff' : '#fafafa',
    color: active ? '#1a1b1f' : '#aaa',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderBottom: active ? '2px solid #1a1b1f' : '2px solid transparent',
    transition: 'all 0.2s ease',
  }),
  form: {
    padding: '36px 40px 40px',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#1a1b1f',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #e8e8e8',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1a1b1f',
    fontFamily: 'Montserrat, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    background: '#fafafa',
  },
  submitBtn: (loading) => ({
    width: '100%',
    padding: '14px',
    background: loading ? '#555' : '#1a1b1f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontFamily: 'Montserrat, sans-serif',
    marginTop: '8px',
    transition: 'background 0.2s',
  }),
  error: {
    background: '#fff5f5',
    border: '1px solid #ffd0d0',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#e53935',
    fontSize: '13px',
    marginBottom: '20px',
  },
  success: {
    background: '#f0faf0',
    border: '1px solid #c8e6c9',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#2e7d32',
    fontSize: '13px',
    marginBottom: '20px',
  },
  divider: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: '12px',
    margin: '20px 0',
    position: 'relative',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '13px',
    color: '#888',
  },
  switchLink: {
    color: '#1a1b1f',
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

function LoginForm({ onSuccess }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = formData.username.trim();
    if (!username || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: formData.password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user || { username }, data.access);
        onSuccess();
      } else {
        setError(data.detail || 'Invalid username or password.');
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" style={styles.form}>
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Username or Email</label>
        <input
          style={styles.input}
          name="username"
          type="text"
          placeholder="Enter your username or email"
          value={formData.username}
          onChange={handleChange}
          onFocus={(e) => (e.target.style.borderColor = '#1a1b1f')}
          onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          onFocus={(e) => (e.target.style.borderColor = '#1a1b1f')}
          onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
        />
      </div>

      <button type="submit" className="responsive-button" style={styles.submitBtn(loading)} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

function SignupForm({ onSwitch }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = formData.username.trim();
    const email = formData.email.trim().toLowerCase();
    if (!username || !email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => onSwitch(), 2000);
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" style={styles.form}>
      {error && <div style={styles.error}>{error}</div>}
      {success && (
        <div style={styles.success}>
          Account created! Redirecting to login...
        </div>
      )}

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          name="username"
          type="text"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          onFocus={(e) => (e.target.style.borderColor = '#1a1b1f')}
          onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Email Address</label>
        <input
          style={styles.input}
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          onFocus={(e) => (e.target.style.borderColor = '#1a1b1f')}
          onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          name="password"
          type="password"
          placeholder="Min 8 characters"
          value={formData.password}
          onChange={handleChange}
          onFocus={(e) => (e.target.style.borderColor = '#1a1b1f')}
          onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Confirm Password</label>
        <input
          style={styles.input}
          name="confirm"
          type="password"
          placeholder="Re-enter your password"
          value={formData.confirm}
          onChange={handleChange}
          onFocus={(e) => (e.target.style.borderColor = '#1a1b1f')}
          onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
        />
      </div>

      <button type="submit" className="responsive-button" style={styles.submitBtn(loading)} disabled={loading}>
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}

function Auth() {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  // Redirect if already logged in
  if (isLoggedIn) {
    navigate(location.state?.from || '/');
    return null;
  }

  const handleLoginSuccess = () => {
    navigate(location.state?.from || '/');
  };

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div className="auth-hero" style={styles.hero}>
        <div style={styles.heroLabel}>WambuXtore</div>
        <h1 className="auth-title" style={styles.heroTitle}>
          {activeTab === 'login' ? 'Welcome Back' : 'Join Us'}
        </h1>
        <p style={styles.heroSub}>
          {activeTab === 'login'
            ? 'Sign in to access your wishlist and orders'
            : 'Create an account to get started'}
        </p>
      </div>

      {/* Card */}
      <div className="auth-card-wrap" style={styles.cardWrap}>
        <div style={styles.card}>
          {/* Toggle */}
          <div style={styles.toggle}>
            <button
              className="auth-toggle-button"
              style={styles.toggleBtn(activeTab === 'login')}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button
              className="auth-toggle-button"
              style={styles.toggleBtn(activeTab === 'signup')}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          {activeTab === 'login' ? (
            <LoginForm onSuccess={handleLoginSuccess} />
          ) : (
            <SignupForm onSwitch={() => setActiveTab('login')} />
          )}

          {/* Switch link */}
          <div style={styles.switchText}>
            {activeTab === 'login' ? (
              <>
                Don't have an account?{' '}
                <span style={styles.switchLink} onClick={() => setActiveTab('signup')}>
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span style={styles.switchLink} onClick={() => setActiveTab('login')}>
                  Sign in
                </span>
              </>
            )}
          </div>
          <div style={{ height: '32px' }} />
        </div>
      </div>
    </div>
  );
}

export default Auth;
