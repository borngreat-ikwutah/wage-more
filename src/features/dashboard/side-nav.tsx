import { Link } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";

const navItems = [
  { title: "Profile", href: "/dashboard" }, // Adjust hrefs to match your routes
  { title: "Account", href: "/dashboard/account" },
  { title: "Trading", href: "/dashboard/trading" },
  { title: "Notifications", href: "/dashboard/notifications" },
  { title: "Builder Codes", href: "/dashboard/builder-codes" },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          // This handles the "Active" state styling automatically
          activeProps={{
            className: cn(
              buttonVariants({ variant: "secondary" }), // "secondary" gives that filled look
              "bg-muted hover:bg-muted justify-start",
            ),
          }}
          inactiveProps={{
            className: cn(
              buttonVariants({ variant: "ghost" }), // "ghost" is transparent
              "hover:bg-transparent hover:underline justify-start",
            ),
          }}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start text-muted-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
