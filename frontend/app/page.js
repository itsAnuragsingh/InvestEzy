'use client';
import { Typewriter } from 'react-simple-typewriter';
import { IntroNav } from './navbar/page';
import Dashboard from './dashboard/page';

export default function HomePage() {
  return (
    
    
       
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white text-center px-4">
       
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
        Welcome to <span className="text-blue-600">InvestEzy</span>
      </h1>
      <IntroNav />

      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 h-16 mb-8">
        <Typewriter
          words={[
            'Track your investments easily',
            'Compare mutual funds like a pro',
            'Buy and sell in one click',
            'No jargon. Just smart insights',
          ]}
          loop={0}
          cursor
          cursorStyle="_"
          typeSpeed={70}
          deleteSpeed={40}
          delaySpeed={1500}

        />
      </h2>

      <button className="mt-4 bg-green-500 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg transition duration-200">
        Get Started
      </button>

      <p className="mt-10 text-sm text-gray-500">
        Built for your parents, friends, and you — no finance degree needed.
      </p>
    </div>
  );
}
