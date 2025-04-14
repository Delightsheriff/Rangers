'use server';

const URL = process.env.NEXT_PUBLIC_API_URL;

export async function signUp(signData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(`${URL}/auth/signup`, {
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
