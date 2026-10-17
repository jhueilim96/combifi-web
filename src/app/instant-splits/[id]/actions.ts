'use server';

import { Tables } from '@/lib/database.types';
import {
  InsertParticipantInput,
  UpdateParticipantInput,
} from '@/lib/validations';
import { InstantSplitDetailedView } from '@/lib/viewTypes';

// The split, its participants and the host's payment methods all come from
// the Worker, which checks the code itself (pennywise-worker
// src/instantSplitWeb.ts). The anon key no longer reads or writes these
// tables. Worker errors come back as { success: false, data: { code } }.
async function worker<T>(endpoint: string, body?: unknown): Promise<T> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WORKER_BASE_URL}${endpoint}`,
    body === undefined
      ? { cache: 'no-store' }
      : {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          cache: 'no-store',
        }
  );
  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.success) {
    throw new Error(
      json?.data?.code ?? json?.data?.message ?? 'Request failed'
    );
  }
  return json.data as T;
}

type Participant = Tables<'one_time_split_expenses_participants'>;

async function openSplit(
  id: string,
  password: string
): Promise<InstantSplitDetailedView & { participants: Participant[] }> {
  try {
    return await worker(`/instant-splits/${id}/open`, { code: password });
  } catch (error) {
    console.error('Error opening split:', error);
    throw new Error('Access denied or record not found');
  }
}

export async function getRecord(
  id: string,
  password: string
): Promise<InstantSplitDetailedView> {
  if (!id || !password) {
    throw new Error('Record ID and password are required');
  }

  try {
    const record: InstantSplitDetailedView & { participants?: Participant[] } =
      await openSplit(id, password);
    delete record.participants;

    // Handle transaction images - fetch signed URLs
    if (record.transaction_images && record.transaction_images.length > 0) {
      for (const image of record.transaction_images) {
        if (image.image_key) {
          const response = await getFileSignedURL(image.image_key);
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
            paymentMethod.image_key!
          );
          paymentMethod.image_url = response.data.shareUrl;
          paymentMethod.image_expired_at = response.data.expiredAt;
        }
      }
    }

    return record as InstantSplitDetailedView;
  } catch (error) {
    console.error('Error fetching record:', error);
    throw error;
  }
}

// Only date, description, amount, currency and the host's name are returned.
type InstantSplitPublicData = Partial<Tables<'one_time_split_expenses'>>;

export async function getPublicRecord(
  id: string
): Promise<InstantSplitPublicData> {
  if (!id) {
    throw new Error('Record ID is required');
  }

  try {
    return await worker<InstantSplitPublicData>(
      `/instant-splits/${id}/preview`
    );
  } catch (error) {
    console.error('Error fetching record:', error);
    throw new Error('Access denied or record not found');
  }
}

export async function getParticipantRecords(
  id: string,
  password: string
): Promise<Participant[]> {
  if (!id || !password) {
    throw new Error('Record ID and password are required');
  }
  try {
    return (await openSplit(id, password)).participants ?? [];
  } catch {
    // A wrong code reads as no participants; the page reports it.
    return [];
  }
}

// The Worker checks the code, refuses the host's row, stamps updated_at (so
// every app version pulls the change) and notifies the host when paid.
async function saveParticipant(
  id: string,
  password: string,
  participantId: string | null,
  data: InsertParticipantInput | UpdateParticipantInput
) {
  try {
    await worker(`/instant-splits/${id}/participants`, {
      code: password,
      participantId,
      name: data.name,
      amount: parseFloat(data.amount),
      currency: data.currency,
      isPaid: data.markAsPaid,
      paymentMethodMetadata: data.paymentMethodMetadata ?? null,
    });
  } catch (error) {
    console.error('[DEBUG] saveParticipant - Worker error:', error);
    throw new Error(
      `Save failed: ${error instanceof Error ? error.message : 'unknown'}`
    );
  }
  return { success: true };
}

export async function insertParticipantRecord(
  id: string,
  password: string,
  data: InsertParticipantInput
) {
  if (!id || !password) {
    throw new Error('Record ID and password are required');
  }
  return saveParticipant(id, password, null, data);
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
  return saveParticipant(id, password, participantId, data);
}

async function getPaymentMethodImageUrl(imageKey: string) {
  try {
    // Get signed URL from backend
    const response = await request(`/users/QR/${imageKey}/share`);
    if (!response.success) {
      throw new Error('Failed to get shared URL');
    }
    return response;
  } catch (error) {
    console.error('Error fetching payment method image URL:', error);
    throw error;
  }
}

async function getFileSignedURL(key: string) {
  try {
    // Get signed URL from backend
    const response = await request(`/files/${key}/share`);
    if (!response.success) {
      throw new Error('Failed to get shared URL');
    }
    return response;
  } catch (error) {
    console.error('Error getting file signed URL:', error);
    return null;
  }
}

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${process.env.NEXT_PUBLIC_WORKER_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
