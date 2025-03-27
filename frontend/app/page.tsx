import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold">Welcome to SplitWise</h1>
      <p className="mt-2 text-gray-500">
        (AI-generated name, subject to team approval)
      </p>

      <p className="mt-6 text-lg">Effortless expense splitting for groups.</p>

      <div className="mt-6 flex gap-4">
        <Button asChild variant="default">
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/auth/login">Log In</Link>
        </Button>
      </div>
    </div>
  );
}
