'use server';

const URL = process.env.NEXT_PUBLIC_API_URL;

if (!URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

export type SignUpResult = {
  success: boolean;
  data?: { message: string; userId: string };
  error?: string;
};

export async function signUp(signData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<SignUpResult> {
  try {
    const response = await fetch(`${URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || 'Something went wrong!',
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error during sign up:', error);
    return {
      success: false,
      error: 'Sign up failed. Please try again later.',
    };
  }
}
