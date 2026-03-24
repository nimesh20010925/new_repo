import React, { useState } from 'react';

export default function Login({ onAuth, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Login failed');
        setIsLoading(false);
        return;
      }
      onAuth(data.token, data.user);
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-green-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -top-20 -left-20 w-64 sm:w-80 h-64 sm:h-80 bg-cyan-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-green-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-10 items-center z-10">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center px-6 lg:px-10">
          <div className="mb-6 lg:mb-8">
            <div className="flex items-center justify-center mb-4 lg:mb-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg">
                <span className="text-3xl lg:text-4xl">Boy</span>
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2 lg:mb-3">
              NutriBuddy
            </h1>
            <p className="text-lg lg:text-xl text-teal-600 font-medium">
              Your Partner in Child Wellness
            </p>
          </div>

          <div className="mb-8 lg:mb-10">
            <svg viewBox="0 0 400 400" className="w-64 lg:w-80 mx-auto drop-shadow-2xl">
              <circle cx="200" cy="180" r="70" fill="#4fd1c5" opacity="0.3" />
              <g transform="translate(200,200)">
                <path d="M-60,-40 L-40,-80 L20,-70 L50,-20 L30,30 L-10,60 L-60,40 Z" fill="#14b8a6" />
                <circle cx="0" cy="-30" r="40" fill="#1f2937" />
                <circle cx="-15" cy="-40" r="12" fill="#fff" />
                <circle cx="-15" cy="-40" r="5" fill="#1f2937" />
                <circle cx="15" cy="-40" r="10" fill="#fff" />
                <path d="M-20,0 Q0,20 20,0" stroke="#e11d48" strokeWidth="4" fill="none" />
              </g>
              <g transform="translate(150,300)">
                <circle r="20" fill="#86efac" />
                <path d="M0,-30 L-15,-10 L20,0 L-20,10 Z" fill="#22c55e" />
              </g>
              <g transform="translate(250,320)">
                <circle r="18" fill="#c4b5fd" />
                <path d="M0,-25 L-12,-8 L15,0 L-15,8 Z" fill="#8b5cf6" />
              </g>
            </svg>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 lg:mb-6">
            Welcome Back, Parent!
          </h2>
          <p className="text-gray-600 text-base lg:text-lg mb-6 lg:mb-8">
            Continue tracking your child's healthy growth journey
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span>Secure and Private</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🩺</span>
              <span>Medical-Grade Data Tools</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-500">© 2025 NutriBuddy</p>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100 w-full">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-4xl sm:text-5xl mb-2 block">👋</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Welcome Back!
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">
              Log in to continue monitoring your child's wellness
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4 sm:space-y-6">
            {/* Email */}
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl">✉️</span>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 sm:pl-14 pr-4 py-3 sm:py-4 rounded-2xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-gray-800 placeholder-gray-400 transition-all outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl">🔒</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 sm:pl-14 pr-4 py-3 sm:py-4 rounded-2xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-gray-800 placeholder-gray-400 transition-all outline-none"
              />
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-3 sm:py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing you in...
                </span>
              ) : (
                'Sign In to NutriBuddy'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              Don't have an account?{' '}
              <button
                onClick={switchToRegister}
                className="text-teal-600 font-semibold hover:text-teal-700 underline-offset-2 hover:underline"
              >
                Create one here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
