'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { Group as GroupInterface } from '@/interface/group';

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

export type CreateGroupResult = {
  success: boolean;
  data?: {
    id: string;
    name: string;
    description: string;
    creator: {
      id: string;
      name: string;
      email: string;
    };
    members: Array<{
      email: string;
      isActive: boolean;
    }>;
    invitedUsers: Array<{
      email: string;
      invitedAt: string;
    }>;
  };
  error?: string;
};

export async function createGroup(groupData: {
  groupName: string;
  groupDescription?: string;
  members: Array<{ email: string }>;
}): Promise<CreateGroupResult> {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session?.accessToken) {
      return {
        success: false,
        error: 'You must be logged in to create a group',
      };
    }

    const response = await fetch(`${URL}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(groupData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || 'Failed to create group',
      };
    }

    return {
      success: true,
      data: result.group,
    };
  } catch (error) {
    console.error('Error creating group:', error);
    return {
      success: false,
      error: 'Failed to create group. Please try again later.',
    };
  }
}

// API response type
type ApiGroup = {
  id: string;
  name: string;
  description: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Group = GroupInterface;

export type GetUserGroupsResult = {
  success: boolean;
  data?: {
    groups: Group[];
  };
  error?: string;
};

export async function getUserGroups(): Promise<GetUserGroupsResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return {
        success: false,
        error: 'You must be logged in to view groups',
      };
    }

    const response = await fetch(`${URL}/groups`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || 'Failed to fetch groups',
      };
    }

    // Transform the API response to match the expected Group interface
    const transformedGroups: Group[] = result.groups.map((group: ApiGroup) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      members: group.memberCount || 0,
      expenses: 0, // These will need to be calculated or fetched separately
      totalAmount: 0,
      youOwe: 0,
      youAreOwed: 0,
      isActive: true,
    }));

    return {
      success: true,
      data: {
        groups: transformedGroups,
      },
    };
  } catch (error) {
    console.error('Error fetching groups:', error);
    return {
      success: false,
      error: 'Failed to fetch groups. Please try again later.',
    };
  }
}
