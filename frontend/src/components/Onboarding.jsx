import React, { useState } from 'react';
import step1Img from '../assets/onboarding1.png';
import step2Img from '../assets/onboarding2.png';
import step3Img from '../assets/onboarding1.png';

const steps = [
  {
    title: "Welcome to NutriBuddy!",
    desc: "Track your child’s growth and nutrition with ease. Let’s get started!",
    img: step1Img,
  },
  {
    title: "How it works",
    desc: "Upload a photo, enter age and name, and get instant health insights.",
    img: step2Img,
  },
  {
    title: "Privacy & Security",
    desc: "Your data is private and secure. Only you can access your child’s records.",
    img: step3Img,
  },
];

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else {
      localStorage.setItem("onboarded", "true");
      onDone();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-200 via-teal-200 to-blue-300 px-4 relative overflow-hidden">

      {/* Decorative Blobs */}
      <div className="absolute w-72 h-72 bg-teal-300 opacity-30 rounded-full blur-3xl top-[-50px] left-[-50px]"></div>
      <div className="absolute w-72 h-72 bg-cyan-300 opacity-30 rounded-full blur-3xl bottom-[-50px] right-[-50px]"></div>

      <div className="max-w-md w-full backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl p-10 text-center border border-white/30 transition-all duration-500">

        {/* Image */}
        <img
          key={steps[step].img}
          src={steps[step].img}
          alt="onboarding"
          className="w-52 h-52 object-contain mx-auto mb-6 drop-shadow-lg animate-fade"
        />

        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-4 text-teal-800 drop-shadow-sm tracking-wide">
          {steps[step].title}
        </h2>

        {/* Description */}
        <p className="text-gray-700 mb-10 text-lg leading-relaxed">
          {steps[step].desc}
        </p>

        {/* Button */}
        <button
          onClick={next}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold text-lg 
                     shadow-lg hover:shadow-xl active:scale-95 
                     transition-all duration-300 hover:from-teal-700 hover:to-cyan-700"
        >
          {step < steps.length - 1 ? "Next" : "Get Started"}
        </button>

        {/* Progress Dots */}
        <div className="mt-8 flex justify-center gap-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`transition-all duration-300 rounded-full ${
                i === step ? "w-5 h-5 bg-teal-600 shadow-md" : "w-3 h-3 bg-gray-400"
              }`}
            ></div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 h-2 w-full bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
