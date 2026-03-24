import React from 'react';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="relative bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      {/* Subtle top accent bar */}
      <div className="h-1 bg-gradient-to-r from-teal-400 via-cyan-500 to-green-400"></div>

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl text-white font-bold">👦</span>
            </div>
            {/* Tiny glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 blur-xl opacity-30 -z-10"></div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              NutriBuddy
            </h1>
            <p className="text-xs text-teal-600 font-medium">
              Your Partner in Child Wellness
            </p>
          </div>
        </div>

        {/* Right: User Info & Logout */}
        <div className="flex items-center gap-6">
          {/* Welcome Message */}
          <div className="hidden sm:flex items-center gap-3 text-gray-700">
            <span className="text-2xl">👋</span>
            <div>
              <p className="text-sm text-gray-600">Welcome back</p>
              <p className="font-semibold text-gray-800">{user?.name || 'Parent'}</p>
            </div>
          </div>

          {/* Mobile greeting */}
          <div className="sm:hidden flex items-center gap-2">
            <span className="text-2xl">👋</span>
            <span className="font-medium text-gray-800">{user?.name?.split(' ')[0]}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 text-rose-700 font-medium text-sm hover:from-rose-100 hover:to-pink-100 hover:border-rose-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span className="text-lg group-hover:animate-pulse">🚪</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Optional: Bottom subtle wave decoration */}
      <div className="h-2 bg-gradient-to-r from-transparent via-teal-50 to-transparent opacity-50"></div>
    </header>
  );
}
