import { profileUpdateSchema, ProfileUpdateInput } from './validations/profile';
import { ZodError } from 'zod';

const URL = process.env.NEXT_PUBLIC_API_URL;

if (!URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

export async function updateProfile(data: ProfileUpdateInput, userId: string, accessToken: string) {
  try {
    // Validate the input data
    const validatedData = profileUpdateSchema.parse(data);

    const response = await fetch(`${URL}/auth/update/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(validatedData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to update profile',
      };
    }

    return {
      success: true,
      message: result.message,
      data: {
        user: result.updated,
      },
    };
  } catch (error) {
    console.error('Error updating profile:', error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      };
    }

    return {
      success: false,
      message: 'An error occurred while updating your profile',
    };
  }
}
