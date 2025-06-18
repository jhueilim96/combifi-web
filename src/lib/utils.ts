import { Tables } from './database.types';

export function formatLocalDateTime(date: string | null | undefined) {
  return date
    ? new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';
}

export enum SplitParticipantType {
  ME = 'ME',
  REGISTERED_FRIEND = 'REGISTERED_FRIEND',
  EXTERNAL = 'EXTERNAL',
}

export enum SettleMode {
  HOST = 'HOST',
  PERPAX = 'PERPAX',
  FRIEND = 'FRIEND',
}

export type HostMetadata = {
  members: string[];
  hostPortion: string;
  memberAmounts: Record<string, string>;
};

export type PerPaxMetadata = {
  members: string[];
  hostPortion: string;
  numberOfPax: number;
  perPaxAmount: string;
};

export type FriendMetadata = {
  members: string[];
  hostPortion: string;
  paymentInstruction: string;
};

export type SettleMetadata = HostMetadata | PerPaxMetadata | FriendMetadata;

export function retrieveSettleMetadata<
  T extends SettleMetadata = SettleMetadata,
>(record: Tables<'one_time_split_expenses'>): T {
  let metadata: SettleMetadata;

  switch (record.settle_mode) {
    case SettleMode.HOST:
      metadata = record.settle_metadata as HostMetadata;
      break;
    case SettleMode.PERPAX:
      metadata = record.settle_metadata as PerPaxMetadata;
      break;
    case SettleMode.FRIEND:
      metadata = record.settle_metadata as FriendMetadata;
      break;
    default:
      throw new Error(`Unknown settle mode: ${record.settle_mode}`);
  }

  return metadata as T;
}
