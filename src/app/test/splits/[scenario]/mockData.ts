import { InstantSplitDetailedView } from '@/lib/viewTypes';
import { Tables } from '@/lib/database.types';

// This file is only imported by server components, so it won't be bundled in the client

type Participant = Tables<'one_time_split_expenses_participants'>;

interface MockScenario {
  record: InstantSplitDetailedView;
  participants: Participant[];
  description: string;
}

// Base mock data to extend
const baseRecord: InstantSplitDetailedView = {
  id: 'mock-base',
  amount: 100,
  emoji: '🍽️',
  converted_amount: null,
  converted_currency: null,
  created_at: new Date().toISOString(),
  currency: 'MYR',
  date: new Date().toISOString(),
  description: 'Dinner at Restaurant',
  is_deleted: false,
  link: null,
  notes: null,
  settle_metadata: {
    members: [],
    hostPortion: '0',
    paymentInstruction: 'Pay your share',
  },
  settle_mode: 'FRIEND',
  status: 'active',
  updated_at: new Date().toISOString(),
  user_id: 'mock-user-id',
  name: 'John Doe',
  payment_methods: [
    {
      label: 'DuitNow QR',
      type: 'IMAGE',
      image_url: 'https://placehold.co/400x400/png?text=QR+Code',
      image_key: 'mock-qr-key',
      image_expired_at: null,
      is_primary: true,
      details: null,
    },
    {
      label: 'Maybank',
      type: 'TEXT',
      image_url: null,
      image_key: null,
      image_expired_at: null,
      is_primary: false,
      details: '1234-5678-9012\nJohn Doe',
    },
  ],
  transaction_images: [],
};

const baseParticipant: Participant = {
  id: 'p-1',
  expense_id: 'mock-base',
  amount: 25,
  converted_amount: null,
  converted_currency: null,
  created_at: new Date().toISOString(),
  is_deleted: false,
  is_host: false,
  is_paid: false,
  name: 'Alice',
  payment_method_metadata: null,
  updated_at: null,
  user_id: null,
};

// ============================================================================
// MOCK SCENARIOS
// ============================================================================

export const MOCK_SCENARIOS: Record<string, MockScenario> = {
  // Default scenario
  default: {
    description: 'Default split with basic data',
    record: baseRecord,
    participants: [
      {
        ...baseParticipant,
        id: 'p-1',
        name: 'Alice',
        amount: 25,
        is_paid: false,
      },
      { ...baseParticipant, id: 'p-2', name: 'Bob', amount: 30, is_paid: true },
      {
        ...baseParticipant,
        id: 'p-3',
        name: 'Charlie',
        amount: 45,
        is_paid: false,
      },
    ],
  },

  // Long text scenario
  'long-text': {
    description: 'Long names, descriptions, notes, and payment instructions',
    record: {
      ...baseRecord,
      id: 'mock-long-text',
      name: 'Muhammad Abdullah bin Ahmad Rizwan Al-Farouq',
      description:
        'Team celebration dinner at the fancy rooftop restaurant with extended family members, friends, and colleagues from the office',
      notes:
        'Line 1: Please pay before end of month.\nLine 2: Include your name in the transfer reference.\nLine 3: Contact me on WhatsApp if you have any issues.\nLine 4: My number is +60 12-345 6789.\nLine 5: Payment deadline is 31st January 2025.\nLine 6: Late payments will incur a small fee.\nLine 7: Please keep your receipt for reference.\nLine 8: Screenshot your transfer confirmation.\nLine 9: Send the screenshot to me via WhatsApp.\nLine 10: I will mark your payment as received.\nLine 11: If you have any questions, feel free to ask.\nLine 12: Thank you for joining the dinner!\nLine 13: Hope you enjoyed the food.\nLine 14: We should do this again sometime.\nLine 15: Let me know if you want to organize next time.\nLine 16: I can share the restaurant contact if needed.\nLine 17: They do catering for events too.\nLine 18: Great for birthday parties and celebrations.\nLine 19: Anyway, please pay soon!\nLine 20: Thanks again everyone!',
      settle_metadata: {
        members: [],
        hostPortion: '0',
        paymentInstruction:
          'Step 1: Open your banking app\nStep 2: Go to Transfer section\nStep 3: Select DuitNow or Instant Transfer\nStep 4: Enter account number: 1234-5678-9012\nStep 5: Bank: Maybank\nStep 6: Account name: Muhammad Abdullah\nStep 7: Enter your share amount\nStep 8: In reference field, put your name\nStep 9: Double check all details\nStep 10: Confirm the transfer\nStep 11: Take a screenshot\nStep 12: Send screenshot to WhatsApp\nStep 13: Wait for confirmation from me\nStep 14: I will update the payment status\nStep 15: If transfer fails, try again\nStep 16: Or contact me for alternative methods\nStep 17: Cash payment also accepted\nStep 18: Meet me at office if paying cash\nStep 19: Payment must be made within 7 days\nStep 20: Thank you for your cooperation!',
      },
      amount: 2500.5,
    },
    participants: [
      {
        ...baseParticipant,
        id: 'p-1',
        name: 'Sarah Elizabeth Montgomery-Richardson III',
        amount: 125.5,
        is_paid: true,
        payment_method_metadata: {
          label: 'DuitNow QR',
          type: 'IMAGE',
          paidAt: new Date().toISOString(),
        },
      },
      {
        ...baseParticipant,
        id: 'p-2',
        name: 'Christopher Alexander Benjamin Thompson Jr.',
        amount: 350.75,
        is_paid: false,
      },
      {
        ...baseParticipant,
        id: 'p-3',
        name: 'Alexandra Victoria Katherine Windsor-Mountbatten',
        amount: 500.25,
        is_paid: true,
        payment_method_metadata: {
          label: 'Maybank',
          type: 'TEXT',
          paidAt: new Date().toISOString(),
        },
      },
    ],
  },

  // High amount scenario
  'high-amount': {
    description: 'Very high amounts',
    record: {
      ...baseRecord,
      id: 'mock-high-amount',
      amount: 99999.99,
      description: 'Company retreat expenses',
    },
    participants: [
      {
        ...baseParticipant,
        id: 'p-1',
        name: 'Finance Dept',
        amount: 25000.5,
        is_paid: false,
      },
      {
        ...baseParticipant,
        id: 'p-2',
        name: 'Marketing Dept',
        amount: 35000.25,
        is_paid: true,
      },
      {
        ...baseParticipant,
        id: 'p-3',
        name: 'Engineering Dept',
        amount: 39999.24,
        is_paid: false,
      },
    ],
  },

  // Small amount scenario
  'small-amount': {
    description: 'Very small amounts',
    record: {
      ...baseRecord,
      id: 'mock-small-amount',
      amount: 0.5,
      description: 'Split a candy bar',
    },
    participants: [
      {
        ...baseParticipant,
        id: 'p-1',
        name: 'Kid A',
        amount: 0.17,
        is_paid: false,
      },
      {
        ...baseParticipant,
        id: 'p-2',
        name: 'Kid B',
        amount: 0.17,
        is_paid: false,
      },
      {
        ...baseParticipant,
        id: 'p-3',
        name: 'Kid C',
        amount: 0.16,
        is_paid: false,
      },
    ],
  },

  // Per-pax mode
  perpax: {
    description: 'Per-pax split mode with fixed amount per person',
    record: {
      ...baseRecord,
      id: 'mock-perpax',
      settle_mode: 'PERPAX',
      settle_metadata: {
        members: [],
        hostPortion: '0',
        numberOfPax: 5,
        perPaxAmount: '100.00',
      },
      amount: 500,
      description: 'Group lunch - fixed per person',
    },
    participants: [
      {
        ...baseParticipant,
        id: 'p-1',
        name: 'Person 1',
        amount: 100,
        is_paid: true,
      },
      {
        ...baseParticipant,
        id: 'p-2',
        name: 'Person 2',
        amount: 100,
        is_paid: false,
      },
      {
        ...baseParticipant,
        id: 'p-3',
        name: 'Person 3',
        amount: 100,
        is_paid: false,
      },
    ],
  },

  // Host mode
  host: {
    description: 'Host mode - predefined participant list',
    record: {
      ...baseRecord,
      id: 'mock-host',
      settle_mode: 'HOST',
      settle_metadata: {
        members: ['Guest 1', 'Guest 2', 'Guest 3', 'Guest 4', 'Guest 5'],
        hostPortion: '0',
        memberAmounts: {
          'Guest 1': '50',
          'Guest 2': '75',
          'Guest 3': '60',
          'Guest 4': '55',
          'Guest 5': '60',
        },
      },
      amount: 300,
      description: 'Birthday party - host managed',
    },
    participants: [
      {
        ...baseParticipant,
        id: 'p-1',
        name: 'Guest 1',
        amount: 50,
        is_paid: true,
        is_host: false,
      },
      {
        ...baseParticipant,
        id: 'p-2',
        name: 'Guest 2',
        amount: 75,
        is_paid: false,
        is_host: false,
      },
      {
        ...baseParticipant,
        id: 'p-3',
        name: 'Guest 3',
        amount: 60,
        is_paid: true,
        is_host: false,
      },
      {
        ...baseParticipant,
        id: 'p-4',
        name: 'Guest 4',
        amount: 55,
        is_paid: false,
        is_host: false,
      },
      {
        ...baseParticipant,
        id: 'p-5',
        name: 'Guest 5',
        amount: 60,
        is_paid: false,
        is_host: false,
      },
    ],
  },

  // Many participants
  'many-participants': {
    description: 'Split with many participants',
    record: {
      ...baseRecord,
      id: 'mock-many',
      amount: 1000,
      description: 'Office party with many attendees',
    },
    participants: Array.from({ length: 15 }, (_, i) => ({
      ...baseParticipant,
      id: `p-${i + 1}`,
      name: `Participant ${i + 1}`,
      amount: Math.round((1000 / 15) * 100) / 100,
      is_paid: i % 3 === 0, // Every 3rd person has paid
    })),
  },

  // No participants yet
  'no-participants': {
    description: 'New split with no participants yet',
    record: {
      ...baseRecord,
      id: 'mock-no-participants',
      amount: 200,
      description: 'New dinner split',
    },
    participants: [],
  },

  // All paid
  'all-paid': {
    description: 'All participants have paid',
    record: {
      ...baseRecord,
      id: 'mock-all-paid',
      amount: 150,
      description: 'Completed split - everyone paid',
    },
    participants: [
      {
        ...baseParticipant,
        id: 'p-1',
        name: 'Alice',
        amount: 50,
        is_paid: true,
        payment_method_metadata: {
          label: 'DuitNow QR',
          type: 'IMAGE',
          paidAt: new Date().toISOString(),
        },
      },
      {
        ...baseParticipant,
        id: 'p-2',
        name: 'Bob',
        amount: 50,
        is_paid: true,
        payment_method_metadata: {
          label: 'Maybank',
          type: 'TEXT',
          paidAt: new Date().toISOString(),
        },
      },
      {
        ...baseParticipant,
        id: 'p-3',
        name: 'Charlie',
        amount: 50,
        is_paid: true,
        payment_method_metadata: {
          label: 'DuitNow QR',
          type: 'IMAGE',
          paidAt: new Date().toISOString(),
        },
      },
    ],
  },

  // Different currencies
  usd: {
    description: 'USD currency',
    record: {
      ...baseRecord,
      id: 'mock-usd',
      currency: 'USD',
      amount: 250,
      description: 'US Dollar split',
    },
    participants: [
      {
        ...baseParticipant,
        id: 'p-1',
        name: 'Alice',
        amount: 125,
        is_paid: false,
      },
      {
        ...baseParticipant,
        id: 'p-2',
        name: 'Bob',
        amount: 125,
        is_paid: false,
      },
    ],
  },

  sgd: {
    description: 'SGD currency',
    record: {
      ...baseRecord,
      id: 'mock-sgd',
      currency: 'SGD',
      amount: 180,
      description: 'Singapore Dollar split',
    },
    participants: [
      {
        ...baseParticipant,
        id: 'p-1',
        name: 'Alice',
        amount: 90,
        is_paid: false,
      },
      { ...baseParticipant, id: 'p-2', name: 'Bob', amount: 90, is_paid: true },
    ],
  },
};

// Get all scenario keys for listing
export const SCENARIO_KEYS = Object.keys(MOCK_SCENARIOS);

// Get scenario by key
export function getMockScenario(key: string): MockScenario | null {
  return MOCK_SCENARIOS[key] || null;
}
