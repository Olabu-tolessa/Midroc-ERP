import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
  created_at: string;
  updated_at: string;
}

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const userService = {
  // Get all active users from database
  async getActiveUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveUsers:', error);
      return [];
    }
  },

  // Get pending user registrations
  async getPendingUsers(): Promise<PendingUser[]> {
    try {
      const { data, error } = await supabase
        .from('pending_users')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPendingUsers:', error);
      return [];
    }
  },

  // Create new user directly (admin created)
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    department: string;
  }): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        return { success: false, message: 'User with this email already exists' };
      }

      // Create user record
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: userData.name,
          email: userData.email,
          role: userData.role,
          department: userData.department,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return { success: false, message: 'Failed to create user' };
      }

      return { 
        success: true, 
        message: 'User created successfully!',
        user: data
      };
    } catch (error) {
      console.error('Error in createUser:', error);
      return { success: false, message: 'An error occurred while creating the user' };
    }
  },

  // Approve pending user
  async approveUser(userId: string): Promise<{ success: boolean; message?: string }> {
    try {
      // Get pending user details
      const { data: pendingUser, error: fetchError } = await supabase
        .from('pending_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError || !pendingUser) {
        return { success: false, message: 'Pending user not found' };
      }

      // Create approved user
      const { error: createError } = await supabase
        .from('users')
        .insert([{
          name: pendingUser.name,
          email: pendingUser.email,
          role: pendingUser.role,
          department: pendingUser.department,
        }]);

      if (createError) {
        console.error('Error creating approved user:', createError);
        return { success: false, message: 'Failed to approve user' };
      }

      // Update pending user status
      const { error: updateError } = await supabase
        .from('pending_users')
        .update({ status: 'approved' })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating pending user status:', updateError);
      }

      return { success: true, message: 'User approved successfully!' };
    } catch (error) {
      console.error('Error in approveUser:', error);
      return { success: false, message: 'An error occurred while approving the user' };
    }
  },

  // Reject pending user
  async rejectUser(userId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase
        .from('pending_users')
        .update({ status: 'rejected' })
        .eq('id', userId);

      if (error) {
        console.error('Error rejecting user:', error);
        return { success: false, message: 'Failed to reject user' };
      }

      return { success: true, message: 'User registration rejected' };
    } catch (error) {
      console.error('Error in rejectUser:', error);
      return { success: false, message: 'An error occurred while rejecting the user' };
    }
  },

  // Delete user
  async deleteUser(userId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: 'Failed to delete user' };
      }

      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return { success: false, message: 'An error occurred while deleting the user' };
    }
  },

  // Update user
  async updateUser(userId: string, updates: Partial<User>): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        console.error('Error updating user:', error);
        return { success: false, message: 'Failed to update user' };
      }

      return { success: true, message: 'User updated successfully' };
    } catch (error) {
      console.error('Error in updateUser:', error);
      return { success: false, message: 'An error occurred while updating the user' };
    }
  }
};
