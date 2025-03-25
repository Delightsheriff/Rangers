"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center space-y-6">
        <div className="flex items-center justify-center rounded-full bg-primary/10 p-6">
          <Search className="h-12 w-12 text-primary" />
        </div>

        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold tracking-tight">
          Page Not Found
        </h2>

        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
