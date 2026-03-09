import { RouterProvider } from "react-router";
import { ClerkProvider } from "@clerk/clerk-react";
import { router } from "./routes";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

export default function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      signInFallbackRedirectUrl="https://pandcjewellery.com/"
      signUpFallbackRedirectUrl="https://pandcjewellery.com/"
      afterSignOutUrl="https://pandcjewellery.com/"
    >
      <RouterProvider router={router} />
    </ClerkProvider>
  );
}