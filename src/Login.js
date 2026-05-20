import React, { useState } from 'react';
import { loginUser, signupUser } from './supabase';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return setError('Please fill in all fields');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    setError('');
    try {
      if (isSignup) {
        await signupUser(email, password);
        setError('✅ Account created! You can now log in.');
        setIsSignup(false);
      } else {
        const data = await loginUser(email, password);
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        
        <h1 style={{ textAlign: 'center', color: '#60a5fa', marginTop: 0 }}>✨ ContentAI</h1>
        <h2 style={{ textAlign: 'center', color: 'white', marginTop: 0 }}>
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>

        {error && (
          <div style={{ background: error.includes('✅') ? '#064e3b' : '#450a0a', color: error.includes('✅') ? '#6ee7b7' : '#fca5a5', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' }}
        />

        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={{ width: '100%', padding: '12px', paddingRight: '44px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '18px' }}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: loading ? '#475569' : '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? '⏳ Please wait...' : isSignup ? '🚀 Create Account' : '🔑 Login'}
        </button>

        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '16px', fontSize: '14px' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span
            onClick={() => { setIsSignup(!isSignup); setError(''); }}
            style={{ color: '#60a5fa', cursor: 'pointer', marginLeft: '6px' }}
          >
            {isSignup ? 'Login' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;