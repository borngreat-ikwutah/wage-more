import { Route } from "~/app/(public)/_public";
import { Navbar } from "~/components/shared/navbar";

export function AppPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
    </main>
  );
}
