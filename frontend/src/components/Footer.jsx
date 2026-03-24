import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-white border-t border-gray-100 relative">
      {/* Subtle wave decoration */}
      <div className="h-2 bg-gradient-to-r from-transparent via-teal-50 to-transparent opacity-60"></div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white font-bold">👦</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">NutriBuddy</h3>
                <p className="text-xs text-teal-600 font-medium">Your Partner in Child Wellness</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Empowering parents and health workers with AI-powered growth monitoring and early malnutrition detection.
            </p>
          </div>

          {/* Trust & Features */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold text-gray-800 mb-4">Trusted Technology</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <span>End-to-end encrypted data</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🩺</span>
                <span>Medical-grade AI analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">❤️</span>
                <span>Built with love for children</span>
              </div>
            </div>
          </div>

          {/* Copyright & Credit */}
          <div className="flex flex-col items-center md:items-end justify-between">
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-2">
                © {currentYear} NutriBuddy. All rights reserved.
              </p>
              <p className="text-xs text-gray-500">
                Built with care for parents & health workers worldwide
              </p>
            </div>

            {/* Optional: Small heart animation */}
            <div className="mt-6 flex items-center gap-2 text-pink-500">
              <span className="text-lg animate-pulse">❤️</span>
              <span className="text-xs font-medium">Made with love</span>
            </div>
          </div>
        </div>

        {/* Bottom mini-divider */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Not a substitute for professional medical advice • For research & screening support only
          </p>
        </div>
      </div>
    </footer>
  );
}
