import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t px-6">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 SplitWise. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/terms" className="text-sm font-medium hover:underline">
            Terms
          </Link>
          <Link href="/policy" className="text-sm font-medium hover:underline">
            Privacy
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
