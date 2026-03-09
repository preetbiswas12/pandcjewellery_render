import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide loading screen after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-300 flex items-center justify-center z-50">
      {/* Background animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Loading content */}
      <div className="relative z-10 text-center">
        <div className="flex justify-center mb-8">
          {/* Animated logo/circle */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-white rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-spin"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-orange-500">P&C</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          P&C Jewellery
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow">
          Loading your premium collection...
        </p>

        {/* Loading bars */}
        <div className="flex gap-2 justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
