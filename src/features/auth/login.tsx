import { Image } from "@unpic/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export function AuthPage() {
  const handleGoogleSignIn = () => {
    console.log("Google Sign-In Clicked");
  };

  return (
    <main className="flex min-h-svh flex-col justify-center  items-center gap-6 p-6 md:p-10 bg-muted">
      <Image
        src="/logo.svg"
        alt="WageMore Logo"
        layout={undefined}
        width={50}
        height={50}
      />

      <h1 className="text-2xl font-bold">Sign In to Wagemore</h1>

      <Card className="w-full max-w-md p-6 md:p-10">
        <Button
          className="h-10 flex items-center gap-2 border-muted"
          variant="outline"
        >
          <Image
            src="/icons/google.png"
            alt="WageMore Logo"
            layout={undefined}
            width={20}
            height={20}
          />
          Sign in with Google
        </Button>
      </Card>
    </main>
  );
}
