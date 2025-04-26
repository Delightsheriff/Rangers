'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { updateProfile } from '@/lib/profile-action';
import { profileUpdateSchema } from '@/lib/validations/profile';
import { ZodError, ZodIssue } from 'zod';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with session data
  useEffect(() => {
    if (session?.user) {
      setFirstName(session.user.firstName || '');
      setLastName(session.user.lastName || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const validateForm = () => {
    try {
      profileUpdateSchema.parse({ firstName, lastName });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    if (!session?.user?._id || !session?.accessToken) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    setIsLoading(true);

    try {
      const result = await updateProfile(
        {
          firstName,
          lastName,
        },
        session.user._id,
        session.accessToken,
      );

      if (result.success) {
        await update({
          ...session,
          user: {
            ...session?.user,
            ...(result?.data?.user ?? {}),
          },
        });
        toast.success(result.message);
      } else {
        if (result.errors) {
          // Handle validation errors from the server
          const newErrors: Record<string, string> = {};
          result.errors.forEach((err: ZodIssue) => {
            const path = err.path[0] as string;
            newErrors[path] = err.message;
          });
          setErrors(newErrors);
          toast.error('Please fix the validation errors');
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 p-2">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">My Profile</h2>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src="/placeholder.svg?height=96&width=96"
              alt={`${firstName} ${lastName}`}
            />
            <AvatarFallback className="text-2xl">{`${firstName.charAt(0)}${lastName.charAt(
              0,
            )}`}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h2 className="text-xl font-bold">{`${firstName} ${lastName}`}</h2>
            <p className="text-muted-foreground">{email}</p>
          </div>
        </div>
        <Card>
          <form onSubmit={handleSavePersonal}>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription className="mb-4">Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled className="bg-muted" />
              </div>
            </CardContent>
            <CardFooter className="mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
