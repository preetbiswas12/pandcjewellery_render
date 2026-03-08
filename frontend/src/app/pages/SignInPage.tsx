import { useEffect } from "react";

export default function SignInPage() {
  // Redirect to Clerk's hosted Account Portal with return_back_url
  useEffect(() => {
    // Add redirect_url param to tell Clerk where to send user after sign-in
    window.location.href = "https://accounts.pandcjewellery.com/sign-in?redirect_url=https://pandcjewellery.com/";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#030213] mb-2">Redirecting to Sign In...</h2>
        <p className="text-gray-600">If you are not redirected automatically, please wait.</p>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#030213]"></div>
        </div>
      </div>
    </div>
  );
}

