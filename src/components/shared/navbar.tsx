import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { SearchIcon, MenuIcon, User, LogOut } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { navbarLinks } from "~/constants";
// import { getCurrentUser } from "~/server/user"; // Preserving your imports
import { authClient } from "~/lib/auth-client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeSwitcher } from "./theme-switcher";
import { toast } from "sonner";
import { Route } from "~/app/(public)/_public";

// --- Data for the Tags/Categories ---
const categories = [
  { name: "All", href: "/" },
  { name: "For You", href: "/for-you" },
  { name: "Politics", href: "/politics" },
  { name: "Sports", href: "/sports" },
  { name: "Crypto", href: "/crypto" },
  { name: "Global Elections", href: "/elections" },
  { name: "Mentions", href: "/mentions" },
  { name: "Creators", href: "/creators" },
  { name: "Pop Culture", href: "/pop-culture" },
  { name: "Business", href: "/business" },
  { name: "Science", href: "/science" },
];

export function Navbar() {
  const navigate = useNavigate();
  const router = useRouter();
  const { user: userResponse, authenticated } = Route.useLoaderData();

  const isLoading = router.state.isLoading;
  const isAuthenticated = authenticated ?? false;
  const user = userResponse ?? null;

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.invalidate();
            toast.success("Signed out successfully");
            navigate({ to: "/" });
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    // Changed <nav> to <header> to contain both rows
    <header className="w-full flex flex-col border-b border-white/5 bg-transparent sticky top-0 z-50 backdrop-blur-md">
      {/* --- TOP ROW: Logo, Search, Auth --- */}
      <div className="w-full px-4 md:px-[60px] py-4 flex justify-between items-center gap-4">
        {/* Logo Section */}
        <Link className="flex items-center gap-2" to="/">
          <Image
            src="/logo.svg"
            alt="WageMore Logo"
            layout="constrained" // 'undefined' layout can cause issues, switched to constrained
            width={30}
            height={30}
          />
          <h1 className="font-bold text-shadow-white text-base mt-0.5 hidden sm:block">
            WAGEMORE
          </h1>
        </Link>

        {/* Search Bar - Hidden on mobile, shown on md+ */}
        <div className="relative w-[40%] hidden md:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
          <Input
            className="pl-8 py-2 h-10 focus:outline-none shad-no-focus border border-secondary-900 bg-secondary/50 rounded-lg"
            placeholder="Search for Markets"
          />
        </div>

        {/* Desktop Links (Optional - usually replaced by the tags row in this design, but keeping if you need them) */}
        <div className="lg:flex items-center gap-6 hidden">
          {navbarLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-normal hover:underline hover:text-gray-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-2">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="." className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link to="/login">Get Started</Link>
            </Button>
          )}
          <ThemeSwitcher />
        </div>

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Navigate through WageMore</SheetDescription>
              </SheetHeader>

              <div className="flex flex-col space-y-6 mt-6 px-6">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                  <Input
                    className="pl-8 py-2"
                    placeholder="Search for Markets"
                  />
                </div>
                <div className="flex flex-col space-y-4">
                  {categories.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-base font-normal hover:text-gray-400 transition-colors p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                {/* Mobile Auth Logic Omitted for Brevity - Same as before */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* --- BOTTOM ROW: Tags/Categories --- */}
      <div className="w-full overflow-x-auto no-scrollbar border-t border-white/5">
        <div className="flex items-center px-4 md:px-[60px] min-w-max">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              // Active state styling logic
              activeProps={{
                className: "text-blue-400 border-b-2 border-blue-400",
              }}
              inactiveProps={{
                className:
                  "text-muted-foreground hover:text-foreground border-transparent border-b-2 hover:border-white/20",
              }}
              className="py-3 px-1 mr-6 text-sm font-medium transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
