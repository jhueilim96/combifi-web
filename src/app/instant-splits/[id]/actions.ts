'use server';

import { Tables } from '@/lib/database.types';
import { createSupabaseClient } from '@/lib/supabase';
import { QueryData } from '@supabase/supabase-js';
import {
  InsertParticipantInput,
  UpdateParticipantInput,
} from '@/lib/validations';
import { InstantSplitDetailedView } from '@/lib/viewTypes';

export async function getRecord(
  id: string,
  password: string
): Promise<InstantSplitDetailedView> {
  if (!id || !password) {
    throw new Error('Record ID and password are required');
  }

  try {
    // Note: view_instant_split_details is a custom view - regenerate types to remove 'as any'
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const { data, error } = await (createSupabaseClient(password) as any)
      /* eslint-enable @typescript-eslint/no-explicit-any */
      .from('view_instant_split_details')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching record:', error);
      throw new Error('Access denied or record not found');
    }

    if (!data) {
      throw new Error('Record not found');
    }

    const record = data as unknown as InstantSplitDetailedView;

    // Handle transaction images - fetch signed URLs
    if (record.transaction_images && record.transaction_images.length > 0) {
      for (const image of record.transaction_images) {
        if (image.image_key) {
          const response = await getFileSignedURL(image.image_key, password);
          if (response) {
            image.image_url = response.data.shareUrl;
          }
        }
      }
    }

    // Handle payment methods image URLs - refresh if expired
    if (record.payment_methods && record.payment_methods.length > 0) {
      for (const paymentMethod of record.payment_methods) {
        if (
          paymentMethod.image_expired_at &&
          new Date(paymentMethod.image_expired_at) < new Date()
        ) {
          const response = await getPaymentMethodImageUrl(
            paymentMethod.image_key!,
            password
          );
          paymentMethod.image_url = response.data.shareUrl;
          paymentMethod.image_expired_at = response.data.expiredAt;
        }
      }
    }

    return record;
  } catch (error) {
    console.error('Error fetching record:', error);
    throw error;
  }
}

const getInstantSplitPublicDataQuery = (id: string) =>
  createSupabaseClient('', true)
    .from('one_time_split_expenses')
    .select('date,description,amount,currency,' + 'profiles (name)')
    .eq('id', id)
    .eq('is_deleted', false)
    .single();

type InstantSplitPublicData = QueryData<typeof getInstantSplitPublicDataQuery>;

export async function getPublicRecord(
  id: string
): Promise<InstantSplitPublicData> {
  if (!id) {
    throw new Error('Record ID is required');
  }

  try {
    // console.log('Fetching record with ID:', id);
    const { data, error } = await getInstantSplitPublicDataQuery(id);

    if (error) {
      console.error('Error fetching record:', error);
      throw new Error('Access denied or record not found');
    }

    if (!data) {
      throw new Error('Record not found');
    }

    return data as InstantSplitPublicData;
  } catch (error) {
    console.error('Error fetching record:', error);
    throw error;
  }
}

export async function getParticipantRecords(
  id: string,
  password: string
): Promise<Tables<'one_time_split_expenses_participants'>[]> {
  if (!id || !password) {
    throw new Error('Record ID and password are required');
  }

  try {
    // console.log('Fetching record participants with ID:', id);
    const { data, error } = await createSupabaseClient(password)
      .from('one_time_split_expenses_participants')
      .select('*')
      .eq('expense_id', id)
      .eq('is_deleted', false);

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

export async function insertParticipantRecord(
  id: string,
  password: string,
  data: InsertParticipantInput
) {
  if (!id || !password) {
    throw new Error('Record ID and password are required');
  }

  try {
    // Create client and establish anonymous session for RLS policy
    const supabaseClient = createSupabaseClient(password);

    // Update the participant record with the new amount
    const { error } = await supabaseClient
      .from('one_time_split_expenses_participants')
      .insert({
        amount: parseFloat(data.amount),
        expense_id: id,
        converted_amount: parseFloat(data.amount),
        converted_currency: data.currency,
        is_host: false,
        is_paid: data.markAsPaid,
        name: data.name,
        payment_method_metadata: data.paymentMethodMetadata,
      });

    if (error) {
      console.error('[DEBUG] insertParticipantRecord - Supabase error:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(`Insert failed: ${error.message} (Code: ${error.code})`);
    }

    console.log('[DEBUG] insertParticipantRecord - Success');
    return { success: true };
  } catch (error) {
    console.error('[DEBUG] insertParticipantRecord - Caught error:', error);
    throw error;
  }
}

export async function updateParticipantRecord(
  id: string,
  password: string,
  participantId: string,
  data: UpdateParticipantInput
) {
  if (!id || !password || !participantId) {
    throw new Error('Record ID, password, and participant ID are required');
  }

  try {
    // Create client and establish anonymous session for RLS policy
    const supabaseClient = createSupabaseClient(password);

    // Update the participant record with the new amount
    const { error } = await supabaseClient
      .from('one_time_split_expenses_participants')
      .update({
        amount: parseFloat(data.amount),
        is_paid: data.markAsPaid,
        name: data.name,
        converted_amount: parseFloat(data.amount),
        converted_currency: data.currency,
        payment_method_metadata: data.paymentMethodMetadata,
      })
      .eq('id', participantId)
      .eq('expense_id', id)
      .eq('is_deleted', false);

    if (error) {
      console.error('[DEBUG] updateParticipantRecord - Supabase error:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(`Update failed: ${error.message} (Code: ${error.code})`);
    }

    console.log('[DEBUG] updateParticipantRecord - Success');
    return { success: true };
  } catch (error) {
    console.error('[DEBUG] updateParticipantRecord - Caught error:', error);
    throw error;
  }
}

async function getPaymentMethodImageUrl(imageKey: string, password: string) {
  try {
    // Get signed URL from backend
    const response = await request(`/users/QR/${imageKey}/share`, password);
    if (!response.success) {
      throw new Error('Failed to get shared URL');
    }
    return response;
  } catch (error) {
    console.error('Error fetching payment method image URL:', error);
    throw error;
  }
}

async function getFileSignedURL(key: string, password: string) {
  try {
    // Get signed URL from backend
    const response = await request(`/files/${key}/share`, password);
    if (!response.success) {
      throw new Error('Failed to get shared URL');
    }
    return response;
  } catch (error) {
    console.error('Error getting file signed URL:', error);
    return null;
  }
}

async function request(
  endpoint: string,
  password: string,
  options: RequestInit = {}
) {
  const {
    data: { session },
  } = await createSupabaseClient(password).auth.signInAnonymously();
  const url = `${process.env.NEXT_PUBLIC_WORKER_BASE_URL}${endpoint}`;
  // console.log('session', session);
  const headers = {
    ...(session?.access_token && {
      Authorization: `Bearer ${session.access_token}`,
    }),
  };
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
