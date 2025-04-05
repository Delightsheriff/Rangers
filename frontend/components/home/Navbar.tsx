import React from "react";
import { CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Navbar() {
  return (
    <header className="border-b p-4">
      <div className="flex h-16 justify-between">
        <div className="flex items-center gap-2">
          <CircleDollarSign size="34" />
          <h1 className="text-4xl font-bold">
            <Link href="/">SplitWise</Link></h1>
        </div>
        <nav className="flex items-center gap-6">
          <Button asChild variant="default">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/login">Log In</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
