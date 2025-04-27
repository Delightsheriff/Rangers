import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>
        <SignInForm />

        <div className="px-8 text-center text-sm text-muted-foreground">
          <div className="underline-offset-4 hover:underline">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
