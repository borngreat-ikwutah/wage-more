import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { SearchIcon, MenuIcon, User, LogOut } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { navbarLinks } from "~/constants";
import { getCurrentUser } from "~/server/user";
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

export function Navbar() {
  const navigate = useNavigate();
  const router = useRouter();
  const getCurrentUserFn = useServerFn(getCurrentUser);

  // Use React Query to cache user data
  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUserFn(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const isAuthenticated = userResponse?.authenticated ?? false;
  const user = userResponse?.user ?? null;

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
    <nav className="w-full px-4 md:px-[60px] py-6 flex justify-between items-center gap-4">
      {/* Logo Section */}
      <Link className="flex items-center gap-2" to="/">
        <Image
          src="/logo.svg"
          alt="WageMore Logo"
          layout={undefined}
          width={30}
          height={30}
        />
        <h1 className="font-bold text-shadow-white text-base mt-0.5">
          WAGEMORE
        </h1>
      </Link>

      {/* Search Bar - Hidden on mobile, shown on md+ */}
      <div className="relative w-[40%] hidden md:block">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-8 py-5! focus:outline-none shad-no-focus border border-secondary-900"
          placeholder="Search for Markets"
        />
      </div>

      <div className="lg:flex items-center gap-6 hidden mt-[0.5px]">
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

      {/* Desktop Auth Section - Hidden on mobile */}
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
          <Button asChild>
            <Link to="/login">Get Started</Link>
          </Button>
        )}
        <ThemeSwitcher />
      </div>

      {/* Mobile Menu - Sheet Component */}
      <div className="lg:hidden">
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
              {/* Mobile Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                <Input
                  className="pl-8 py-5! focus:outline-none shad-no-focus border border-secondary-900"
                  placeholder="Search for Markets"
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-4">
                {navbarLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-base font-normal hover:text-gray-400 transition-colors p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t">
                {isLoading ? (
                  <div className="w-full h-10 bg-gray-200 animate-pulse rounded" />
                ) : isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.image || ""}
                          alt={user.name || ""}
                        />
                        <AvatarFallback>
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="..">Dashboard</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" asChild>
                    <Link to="/login">Get Started</Link>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
