'use server'

import { Tables } from '@/lib/database.types';
import { createSupabaseClient } from '@/lib/supabase';
import { QueryData } from '@supabase/supabase-js';

const instantSplitsWithProfileQuery = (id: string, password: string) => createSupabaseClient(password)
      .from('one_time_split_expenses')
      .select('amount,category_id,converted_amount,converted_currency,created_at,currency,date,description,file_name,id,is_deleted,link,notes,settle_metadata,settle_mode,status,updated_at,user_id,' + 
        'profiles (name)')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

type InstantSplitsWithProfile = QueryData<typeof instantSplitsWithProfileQuery>

export async function getRecord(id: string, password: string): Promise<InstantSplitsWithProfile>{
  if (!id || !password) {
    throw new Error('Record ID and password are required');
  }

  try {
    console.log('Fetching record with ID:', id);
    // Always exclude password
    const {data, error} = await instantSplitsWithProfileQuery(id, password);
    
    if (error) {
      console.error('Error fetching record:', error);
      throw new Error('Access denied or record not found');
    }

    if (!data) {
      throw new Error('Record not found');
    }

    return data as InstantSplitsWithProfile;
  } catch (error) {
    console.error('Error fetching record:', error);
    throw error;
  }
}

export async function getParticipantRecords(id: string, password: string): Promise<Tables<'one_time_split_expenses_participants'>[]>{
  if (!id || !password) {
    throw new Error('Record ID and password are required');
  }

  try {
    console.log('Fetching record participants with ID:', id);
    const { data, error } = await createSupabaseClient(password)
      .from('one_time_split_expenses_participants')
      .select('*')
      .eq('expense_id', id)
      .eq('is_deleted', false)

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

export async function insertParticipantRecord(id: string, password: string, data: {amount: string, name: string}) {
  if (!id || !password) {
    throw new Error('Record ID and password are required');
  }

  try {
    // Update the participant record with the new amount
    const { error } = await createSupabaseClient(password)
      .from('one_time_split_expenses_participants')
      .insert({
          amount: parseFloat(data.amount),
          expense_id: id,
          is_host: false,
          is_paid: true,
          name: data.name,
        })

    if (error) {
      throw new Error('Update failed');
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating record:', error);
    throw error;
  }
}

export async function updateParticipantRecord(id: string, password: string, participantId: string, data: {amount: string, name: string, markAsPaid: boolean}) {
  if (!id || !password || !participantId) {
    throw new Error('Record ID, password, and participant ID are required');
  }

  try {
    // Update the participant record with the new amount
    const { error } = await createSupabaseClient(password)
      .from('one_time_split_expenses_participants')
      .update({
          amount: parseFloat(data.amount),
          is_paid: data.markAsPaid,
          name: data.name,
        })
      .eq('id', participantId)
      .eq('expense_id', id)
      .eq('is_deleted', false)

    if (error) {
      throw new Error('Update failed');
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating record:', error);
    throw error;
  }
}

