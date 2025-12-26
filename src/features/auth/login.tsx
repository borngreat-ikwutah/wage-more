import { useRouter } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Loader2 } from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { checkOnboardingStatus } from "~/server/auth";

export function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      await authClient.signIn.social(
        {
          provider: "google",
        },
        {
          onSuccess: async () => {
            try {
              // Invalidate router to refresh auth state
              await router.invalidate();

              // Small delay to ensure session is properly set
              await new Promise((resolve) => setTimeout(resolve, 500));

              // Check onboarding status after successful authentication
              const onboardingStatus = await checkOnboardingStatus();

              if (onboardingStatus.needsAuth) {
                // This shouldn't happen since we just signed in, but handle it
                toast.error("Authentication failed. Please try again.");
                setIsLoading(false);
                return;
              }

              if (onboardingStatus.isCompleted) {
                // User has completed onboarding, redirect to home page
                toast.success(
                  `Welcome back${onboardingStatus.username ? `, ${onboardingStatus.username}` : ""}!`,
                );
                router.navigate({
                  to: "/",
                  replace: true, // Replace current history entry
                });
              } else {
                // User needs to complete onboarding
                toast.success(
                  "Welcome to Wagemore! Let's complete your setup.",
                );
                router.navigate({
                  to: "/onboarding",
                  replace: true, // Replace current history entry
                });
              }
            } catch (error) {
              console.error("Error checking onboarding status:", error);
              // If we can't check onboarding status, default to onboarding page
              toast.success("Welcome to Wagemore!");
              router.navigate({
                to: "/onboarding",
                replace: true,
              });
            } finally {
              setIsLoading(false);
            }
          },
          onError: (error) => {
            toast.error("Sign in failed. Please try again.");
            console.error("Auth error:", error);
            setIsLoading(false);
          },
        },
      );
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10 bg-muted">
      <Image
        src="/logo.svg"
        alt="WageMore Logo"
        layout={undefined}
        width={50}
        height={50}
      />

      <h1 className="text-2xl font-bold">Sign In to Wagemore</h1>

      <Card className="w-full max-w-[400px] p-6 md:p-10">
        <Button
          className="h-10 flex items-center justify-center gap-2 border-muted"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <Image
                src="/icons/google.png"
                alt="Google Logo"
                layout={undefined}
                width={20}
                height={20}
              />
              Sign in with Google
            </>
          )}
        </Button>
      </Card>
    </main>
  );
}
