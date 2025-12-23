import { redirect, useRouter } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { Image } from "@unpic/react";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Loader2 } from "lucide-react"; // or your preferred loading icon
import { authClient } from "~/lib/auth-client";

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
            await router.invalidate();
            toast.success("Welcome to Wagemore");
            redirect({
              to: "/",
            });
          },
          onError: (error) => {
            toast.error("Sign in failed. Please try again.");
            console.error("Auth error:", error);
            setIsLoading(false); // Reset loading on error
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
