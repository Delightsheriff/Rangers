'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from './auth';
import { Group, GroupDetails } from '@/interface/group';

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

    // The API now returns the data in the correct format, no transformation needed
    return {
      success: true,
      data: {
        groups: result.groups,
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
      method: 'POST',
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

    // The API now returns the data in the correct format, no transformation needed
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

export type CreateExpenseResult = {
  success: boolean;
  data?: {
    id: string;
    name: string;
    description: string;
    amount: number;
    date: string;
    groupId: string;
    paidBy: Array<{
      userId: string;
      amountPaid: number;
      paidAt: string;
    }>;
  };
  error?: string;
};

export async function createExpense(expenseData: {
  groupId: string;
  description: string;
  amount: number;
  paidBy: Array<{
    userId: string;
    amountPaid: number;
  }>;
}): Promise<CreateExpenseResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return {
        success: false,
        error: 'You must be logged in to create an expense',
      };
    }

    const response = await fetch(`${URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(expenseData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || 'Failed to create expense',
      };
    }

    // Revalidate the groups page to refresh the data
    revalidatePath('/dashboard/groups');
    revalidatePath(`/dashboard/groups/${expenseData.groupId}`);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error creating expense:', error);
    return {
      success: false,
      error: 'Failed to create expense. Please try again later.',
    };
  }
}

export type DashboardOverviewResult = {
  success: boolean;
  data?: {
    totalGroups: number;
    totalMembers: number;
    totalAmount: number;
    userBalance: number;
    recentExpenses: Array<{
      _id: string;
      name: string;
      description: string;
      amount: number;
      date: string;
      groupId: {
        _id: string;
        name: string;
      };
      paidBy: Array<{
        userId: string;
        amountPaid: number;
        paidAt: string;
      }>;
    }>;
    pendingInvitations: Array<{
      _id: string;
      name: string;
      creator: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    }>;
  };
  error?: string;
};

export async function getDashboardOverview(): Promise<DashboardOverviewResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return {
        success: false,
        error: 'You must be logged in to view dashboard',
      };
    }

    const response = await fetch(`${URL}/overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    console.log(response);

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || 'Failed to fetch dashboard data',
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      success: false,
      error: 'Failed to fetch dashboard data. Please try again later.',
    };
  }
}
