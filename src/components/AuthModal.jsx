import React, { useState } from 'react';
import { useUI } from '../contexts/UIContext';
import { useAuth } from '../contexts/AuthContext';
import OAuthButtons from './OAuthButtons';
import PasswordInput from './PasswordInput';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal } = useUI();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signup' | 'signin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    password: '',
    role: 'student', // Default role
  });

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailRegex.test(form.email)) {
      return setError('Please enter a valid email address.');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (mode === 'signup' && !form.name.trim()) {
      return setError('Please enter your full name.');
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await login(form.email, form.password);
      } else {
        await register({ 
          name: form.name, 
          email: form.email, 
          password: form.password, 
          role: form.role 
        });
      }
      closeAuthModal(); // Close modal on success
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={closeAuthModal}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-full flex text-sm font-medium text-gray-600">
              <button 
                onClick={() => setMode('signin')}
                className={`px-6 py-2 rounded-full transition-colors ${mode === 'signin' ? 'bg-white text-primary shadow-sm' : 'hover:bg-gray-200'}`}>
                Sign In
              </button>
              <button 
                onClick={() => setMode('signup')}
                className={`px-6 py-2 rounded-full transition-colors ${mode === 'signup' ? 'bg-white text-primary shadow-sm' : 'hover:bg-gray-200'}`}>
                Sign Up
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
            {mode === 'signup' ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            {mode === 'signup' ? 'Join our community of students and recruiters.' : 'Sign in to access your dashboard.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <input 
                type="text" 
                placeholder="Full Name" 
                value={form.name}
                onChange={e => update('name', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-light" 
              />
            )}
            <input 
              type="email" 
              placeholder="Email Address" 
              value={form.email}
              onChange={e => update('email', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-light" 
            />
            {mode === 'signup' && (
              <div className="flex gap-2">
                <select 
                  value={form.countryCode}
                  onChange={e => update('countryCode', e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 bg-gray-50 focus:ring-2 focus:ring-primary-light"
                >
                  <option>+91</option>
                  <option>+1</option>
                </select>
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-light" 
                />
              </div>
            )}
            <PasswordInput 
              value={form.password} 
              onChange={val => update('password', val)} 
              placeholder="Password"
            />
            
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold mt-6 hover:bg-primary-dark transition disabled:bg-opacity-70">
              {loading ? 'Processing...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="text-center text-sm text-gray-400 my-6">or {mode === 'signup' ? 'sign up' : 'sign in'} with</div>

          <OAuthButtons />

        </div>
      </div>
    </div>
  );
};

export default AuthModal;

