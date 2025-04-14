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
      // Check for specific error conditions
      if (response.status === 406 && result.message === 'Email in use') {
        throw new Error('This email is already in use. Please use another one or log in.');
      }

      console.log('Error:', result);
      throw new Error(result.message || result.error || 'Something went wrong!');
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error during sign up:', error);
    throw new Error('Sign up failed. Please try again later.');
  }
}
