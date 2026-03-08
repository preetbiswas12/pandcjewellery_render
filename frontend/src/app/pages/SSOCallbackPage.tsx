import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@clerk/clerk-react';

export default function SSOCallbackPage() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return;

    // If user is signed in, redirect to home
    if (isSignedIn) {
      navigate('/', { replace: true });
    } else {
      // If not signed in, go back to sign-in
      navigate('/sign-in', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#030213] mb-2">Completing Sign In...</h2>
        <p className="text-gray-600">Please wait while we authenticate your account.</p>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#030213]"></div>
        </div>
      </div>
    </div>
  );
}
