'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
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

export type AddMemberResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function addMemberToGroup(groupId: string, email: string): Promise<AddMemberResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return {
        success: false,
        error: 'You must be logged in to add members to a group',
      };
    }

    const response = await fetch(`${URL}/groups/${groupId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || 'Failed to add member to group',
      };
    }

    // Revalidate the groups page to refresh the data
    revalidatePath('/dashboard/groups');

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error('Error adding member to group:', error);
    return {
      success: false,
      error: 'Failed to add member to group. Please try again later.',
    };
  }
}

export type LeaveGroupResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function leaveGroup(groupId: string): Promise<LeaveGroupResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return {
        success: false,
        error: 'You must be logged in to leave a group',
      };
    }

    const response = await fetch(`${URL}/groups/${groupId}/leave`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || 'Failed to leave group',
      };
    }

    // Revalidate the groups page to refresh the data
    revalidatePath('/dashboard/groups');

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error('Error leaving group:', error);
    return {
      success: false,
      error: 'Failed to leave group. Please try again later.',
    };
  }
}

export type DeleteGroupResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function deleteGroup(groupId: string): Promise<DeleteGroupResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return {
        success: false,
        error: 'You must be logged in to delete a group',
      };
    }

    const response = await fetch(`${URL}/groups/${groupId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || 'Failed to delete group',
      };
    }

    // Revalidate the groups page to refresh the data
    revalidatePath('/dashboard/groups');

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error('Error deleting group:', error);
    return {
      success: false,
      error: 'Failed to delete group. Please try again later.',
    };
  }
}

export type GroupMember = {
  id: string | null;
  name: string | null;
  email: string;
  isActive: boolean;
  joinedAt: string;
};

export type GroupInvite = {
  email: string;
  invitedAt: string;
};

export type GroupDetails = {
  id: string;
  name: string;
  description: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  members: GroupMember[];
  invitedUsers: GroupInvite[];
  createdAt: string;
  updatedAt: string;
};

export type GetGroupDetailsResult = {
  success: boolean;
  data?: {
    group: GroupDetails;
  };
  error?: string;
};

export async function getGroupDetails(groupId: string): Promise<GetGroupDetailsResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return {
        success: false,
        error: 'You must be logged in to view group details',
      };
    }

    const response = await fetch(`${URL}/groups/${groupId}`, {
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
        error: result.message || result.error || 'Failed to fetch group details',
      };
    }

    return {
      success: true,
      data: {
        group: result.group,
      },
    };
  } catch (error) {
    console.error('Error fetching group details:', error);
    return {
      success: false,
      error: 'Failed to fetch group details. Please try again later.',
    };
  }
}
