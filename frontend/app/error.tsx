'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RotateCcw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center space-y-6">
        <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
          <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>

        <p className="text-muted-foreground">
          We&apos;re sorry, but we encountered an unexpected error. Our team has been notified.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={reset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
