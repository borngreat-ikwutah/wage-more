import { createFileRoute } from "@tanstack/react-router";
import { authMiddleware } from "~/middleware/auth-middleware";

export const Route = createFileRoute("/(public)/dashboard/home/")({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
});

function RouteComponent() {
  return <div>Hello "/(public)/dashboard/home/"!</div>;
}
