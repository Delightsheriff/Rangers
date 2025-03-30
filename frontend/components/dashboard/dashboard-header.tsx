"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileNav from "@/components/dashboard/mobile-nav";

export default function DashboardHeader() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="mr-2 md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 md:hidden">
            <MobileNav onNavItemClick={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <div className="rounded-full bg-primary p-1 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span>SplitWise</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <form className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 rounded-full bg-muted pl-8 md:w-80"
            />
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="grid gap-2 p-2">
                <div className="flex items-start gap-2 rounded-lg p-2 hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>TS</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">
                      <span className="font-semibold">Taylor</span> added
                      &quot;`Dinner at Seafood Palace&quot; ($145.75)
                    </p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg p-2 hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">
                      <span className="font-semibold">Morgan</span> requested
                      $58.50 for &quot;Airport Taxi&quot;
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg p-2 hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>JL</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">
                      <span className="font-semibold">Jordan</span> settled up
                      with you ($120.00)
                    </p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer justify-center"
                asChild
              >
                <Link href="/notifications">View all notifications</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="Alex Johnson"
                  />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium">Alex Johnson</p>
                  <p className="text-xs text-muted-foreground">
                    alex@example.com
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/help")}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/")}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
