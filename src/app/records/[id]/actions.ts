'use server'

import { createSupabaseClient } from '@/lib/supabase';

export type Participant = {
  id: string;
  expense_id: string;
  name: string;
  user_id?: string;
  amount: number;
  created_at: string;
  updated_at?: string;
  is_paid: boolean;
  is_host?: boolean;
  is_deleted: boolean;
  converted_amount?: number;
  converted_currency?: string;
}

export async function getRecord(id: string, password: string) {
  if (!id || !password) {
    throw new Error('Record ID and password are required');
  }

  try {
    console.log('Fetching record with ID:', id);
    const { data , error } = await createSupabaseClient(password)
      .from('one_time_split_expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching record:', error);
      throw new Error('Access denied or record not found');
    }

    return data;
  } catch (error) {
    console.error('Error fetching record:', error);
    throw error;
  }
}

export async function getRecordParticipants(id: string, password: string) {
  if (!id || !password) {
    throw new Error('Record ID and password are required');
  }

  try {
    console.log('Fetching record participants with ID:', id);
    const { data, error } = await createSupabaseClient(password)
      .from('one_time_split_expenses_participants')
      .select('*')
      .eq('expense_id', id);

    if (error) {
      console.error('Error fetching record participants:', error);
      throw new Error('Access denied or record not found');
    }

    return data;
  } catch (error) {
    console.error('Error fetching record:', error);
    throw error;
  }
}

export async function updateRecord(id: string, password: string, content: string) {
  if (!id || !password) {
    throw new Error('Record ID and password are required');
  }

  try {
    const { error } = await createSupabaseClient(password)
      .from('personal_transactions')
      .update({ content })
      .eq('id', id);

    if (error) {
      throw new Error('Update failed');
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating record:', error);
    throw error;
  }
}
