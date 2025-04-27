export function formatLocalDateTime(date: Date | string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-');
}

export enum SplitParticipantType {
  ME = 'ME',
  REGISTERED_FRIEND = 'REGISTERED_FRIEND',
  EXTERNAL = 'EXTERNAL',
}

export enum SplitType {
  BY_AMOUNT = 'by_amount',
  BY_PERCENTAGE = 'by_percentage',
  EQUAL = 'equal',
}

export function mapSplitTypeToDisplayName(splitType: SplitType) {
  if (splitType === SplitType.EQUAL) {
    return 'equally';
  }
  else if (splitType === SplitType.BY_AMOUNT) {
    return 'by amount';
  }
  else if (splitType === SplitType.BY_PERCENTAGE) {
    return 'by percentage';
  }
}
