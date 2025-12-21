import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { SearchIcon, MenuIcon } from "lucide-react";
import { navbarLinks } from "~/constants";
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

export function Navbar() {
  return (
    <nav className="w-full px-4 md:px-[60px] py-6 flex justify-between items-center gap-4">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
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
      </div>

      {/* Search Bar - Hidden on mobile, shown on md+ */}
      <div className="relative w-[40%] hidden md:block">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-8 py-5! focus:outline-none shad-no-focus border border-secondary-900"
          placeholder="Search for Markets"
        />
      </div>

      {/* Desktop Navigation - Hidden on mobile, shown on lg+ */}
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

      {/* Desktop Get Started Button - Hidden on mobile */}
      <div className="hidden md:block">
        <Button asChild>
          <Link to="/login">Get Started</Link>
        </Button>
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
                  className="pl-8 !py-5 focus:outline-none shad-no-focus border border-secondary-900"
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

              {/* Mobile Get Started Button */}
              <div className="pt-4 border-t">
                <Button className="w-full">Get Started</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
