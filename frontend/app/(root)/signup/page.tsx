import SignUpForm from '@/components/auth/SignUpForm';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your information below to create your account
          </p>
        </div>
        <SignUpForm />

        <div className="px-8 text-center text-sm text-muted-foreground">
          <div className="underline-offset-4 hover:underline">
            Already have an account?{' '}
            <Link href="/login" className="text-primary underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
