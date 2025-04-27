import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import HeroIllustration from './HeroIllustration';

function Hero() {

  
  return (
    <section className="container  px-6 grid items-center gap-6 py-12 md:grid-cols-2 md:py-24">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          Split expenses with friends <span className="text-primary">hassle-free</span>
        </h2>
        <p className="text-muted-foreground md:text-lg">
          The easiest way to share bills, track group expenses, and settle debts with roommates,
          trips, and friends.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/signup" className="bouncing">
            <Button size="lg" className="gap-4 ">
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>
          </Link>
          <Link href="/#how-it-works">
            <Button size="lg" variant="outline">
              See how it works
            </Button>
          </Link>
        </div>
      </div>
      <div className="hidden md:block">
        <HeroIllustration />
      </div>
    </section>
  );
}

export default Hero;
