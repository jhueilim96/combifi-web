export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      friends: {
        Row: {
          created_at: string;
          friend_id: string;
          id: string;
          is_deleted: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          friend_id: string;
          id: string;
          is_deleted?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          friend_id?: string;
          id?: string;
          is_deleted?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'friends_friend_id_fkey';
            columns: ['friend_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'friends_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      group_categories: {
        Row: {
          created_at: string;
          emoji: string;
          group_id: string | null;
          id: string;
          is_active: boolean;
          is_archived: boolean;
          is_deleted: boolean;
          is_expense: boolean;
          is_system: boolean;
          name: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          emoji: string;
          group_id?: string | null;
          id: string;
          is_active?: boolean;
          is_archived?: boolean;
          is_deleted?: boolean;
          is_expense: boolean;
          is_system: boolean;
          name: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          emoji?: string;
          group_id?: string | null;
          id?: string;
          is_active?: boolean;
          is_archived?: boolean;
          is_deleted?: boolean;
          is_expense?: boolean;
          is_system?: boolean;
          name?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'group_categories_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_categories_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      group_participants: {
        Row: {
          created_at: string;
          group_id: string;
          id: string;
          is_deleted: boolean;
          name: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          group_id: string;
          id: string;
          is_deleted?: boolean;
          name: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          group_id?: string;
          id?: string;
          is_deleted?: boolean;
          name?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'group_participants_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_participants_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      group_transaction_participants: {
        Row: {
          converted_amount: number | null;
          converted_amount_for_group: number | null;
          converted_currency: string | null;
          converted_currency_for_group: string | null;
          created_at: string;
          expense_id: string;
          group_id: string;
          id: string;
          is_deleted: boolean;
          is_host: boolean | null;
          is_paid: boolean;
          name: string;
          owed_amount: number;
          paid_amount: number;
          participant_id: string;
          updated_at: string | null;
        };
        Insert: {
          converted_amount?: number | null;
          converted_amount_for_group?: number | null;
          converted_currency?: string | null;
          converted_currency_for_group?: string | null;
          created_at?: string;
          expense_id: string;
          group_id: string;
          id: string;
          is_deleted?: boolean;
          is_host?: boolean | null;
          is_paid: boolean;
          name: string;
          owed_amount: number;
          paid_amount: number;
          participant_id: string;
          updated_at?: string | null;
        };
        Update: {
          converted_amount?: number | null;
          converted_amount_for_group?: number | null;
          converted_currency?: string | null;
          converted_currency_for_group?: string | null;
          created_at?: string;
          expense_id?: string;
          group_id?: string;
          id?: string;
          is_deleted?: boolean;
          is_host?: boolean | null;
          is_paid?: boolean;
          name?: string;
          owed_amount?: number;
          paid_amount?: number;
          participant_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'group_transaction_participants_expense_id_fkey';
            columns: ['expense_id'];
            isOneToOne: false;
            referencedRelation: 'group_transactions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_transaction_participants_expense_id_fkey';
            columns: ['expense_id'];
            isOneToOne: false;
            referencedRelation: 'v_group_transaction_participants';
            referencedColumns: ['transaction_id'];
          },
          {
            foreignKeyName: 'group_transaction_participants_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_transaction_participants_participant_id_fkey';
            columns: ['participant_id'];
            isOneToOne: false;
            referencedRelation: 'group_participants';
            referencedColumns: ['id'];
          },
        ];
      };
      group_transactions: {
        Row: {
          amount: number;
          category_id: string;
          converted_amount: number;
          converted_currency: string;
          created_at: string;
          currency: string;
          date: string;
          description: string;
          file_name: string | null;
          group_id: string;
          id: string;
          is_deleted: boolean;
          notes: string | null;
          participant_id: string;
          settle_metadata: Json | null;
          settle_mode: string;
          status: string | null;
          tx_type: string;
          updated_at: string | null;
        };
        Insert: {
          amount: number;
          category_id: string;
          converted_amount: number;
          converted_currency: string;
          created_at?: string;
          currency: string;
          date: string;
          description: string;
          file_name?: string | null;
          group_id: string;
          id: string;
          is_deleted?: boolean;
          notes?: string | null;
          participant_id: string;
          settle_metadata?: Json | null;
          settle_mode: string;
          status?: string | null;
          tx_type: string;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          category_id?: string;
          converted_amount?: number;
          converted_currency?: string;
          created_at?: string;
          currency?: string;
          date?: string;
          description?: string;
          file_name?: string | null;
          group_id?: string;
          id?: string;
          is_deleted?: boolean;
          notes?: string | null;
          participant_id?: string;
          settle_metadata?: Json | null;
          settle_mode?: string;
          status?: string | null;
          tx_type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'group_transactions_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'group_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_transactions_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_transactions_participant_id_fkey';
            columns: ['participant_id'];
            isOneToOne: false;
            referencedRelation: 'group_participants';
            referencedColumns: ['id'];
          },
        ];
      };
      groups: {
        Row: {
          created_at: string;
          currency: string;
          emoji: string;
          id: string;
          is_archived: boolean;
          is_deleted: boolean;
          name: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          currency: string;
          emoji: string;
          id: string;
          is_archived: boolean;
          is_deleted?: boolean;
          name: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          currency?: string;
          emoji?: string;
          id?: string;
          is_archived?: boolean;
          is_deleted?: boolean;
          name?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'groups_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      one_time_split_expenses: {
        Row: {
          amount: number;
          category_id: string;
          converted_amount: number | null;
          converted_currency: string | null;
          created_at: string;
          currency: string;
          date: string;
          description: string;
          file_name: string | null;
          id: string;
          is_deleted: boolean;
          link: string | null;
          notes: string | null;
          password: string | null;
          settle_metadata: Json | null;
          settle_mode: string;
          status: string | null;
          tx_type: string | null;
          updated_at: string | null;
          user_id: string;
          file_url: string | null;
          profiles: {
            name: string | null;
            payment_methods: {
              provider: string;
              image_url: string | null;
              image_key: string | null;
              image_expired_at: number | null;
              label: string;
              details: string | null;
              type: string;
            }[];
          };
        };
        Insert: {
          amount: number;
          category_id: string;
          converted_amount?: number | null;
          converted_currency?: string | null;
          created_at?: string;
          currency: string;
          date: string;
          description: string;
          file_name?: string | null;
          id: string;
          is_deleted?: boolean;
          link?: string | null;
          notes?: string | null;
          password?: string | null;
          settle_metadata?: Json | null;
          settle_mode: string;
          status?: string | null;
          tx_type?: string | null;
          updated_at?: string | null;
          user_id: string;
          file_url?: string | null;
          profiles: {
            name: string | null;
            payment_methods: {
              provider: string;
              image_url: string | null;
              image_key: string | null;
              image_expired_at: number | null;
              is_primary: boolean;
            }[];
          };
        };
        Update: {
          amount?: number;
          category_id?: string;
          converted_amount?: number | null;
          converted_currency?: string | null;
          created_at?: string;
          currency?: string;
          date?: string;
          description?: string;
          file_name?: string | null;
          id?: string;
          is_deleted?: boolean;
          link?: string | null;
          notes?: string | null;
          password?: string | null;
          settle_metadata?: Json | null;
          settle_mode?: string;
          status?: string | null;
          tx_type?: string | null;
          updated_at?: string | null;
          user_id?: string;
          file_url?: string | null;
          profiles: {
            name: string | null;
            payment_methods: {
              provider: string;
              image_url: string | null;
              image_key: string | null;
              image_expired_at: number | null;
              is_primary: boolean;
            }[];
          };
        };
        Relationships: [
          {
            foreignKeyName: 'one_time_split_expenses_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'personal_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'one_time_split_expenses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      one_time_split_expenses_participants: {
        Row: {
          amount: number;
          converted_amount: number | null;
          converted_currency: string | null;
          created_at: string;
          expense_id: string;
          id: string;
          is_deleted: boolean;
          is_host: boolean | null;
          is_paid: boolean;
          name: string;
          payment_method_metadata: Json | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          amount: number;
          converted_amount?: number | null;
          converted_currency?: string | null;
          created_at?: string;
          expense_id: string;
          id?: string;
          is_deleted?: boolean;
          is_host?: boolean | null;
          is_paid?: boolean;
          name: string;
          payment_method_metadata?: Json | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          converted_amount?: number | null;
          converted_currency?: string | null;
          created_at?: string;
          expense_id?: string;
          id?: string;
          is_deleted?: boolean;
          is_host?: boolean | null;
          is_paid?: boolean;
          name?: string;
          payment_method_metadata?: Json | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'shared_expense_participation_expense_id_fkey';
            columns: ['expense_id'];
            isOneToOne: false;
            referencedRelation: 'one_time_split_expenses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'shared_expense_participation_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      payment_methods: {
        Row: {
          created_at: string;
          details: string | null;
          id: string;
          image_expired_at: number | null;
          image_key: string | null;
          image_url: string | null;
          is_active: boolean;
          is_deleted: boolean;
          is_primary: boolean;
          label: string | null;
          provider: string | null;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          details?: string | null;
          id?: string;
          image_expired_at?: number | null;
          image_key?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          is_deleted?: boolean;
          is_primary?: boolean;
          label?: string | null;
          provider?: string | null;
          type?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          details?: string | null;
          id?: string;
          image_expired_at?: number | null;
          image_key?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          is_deleted?: boolean;
          is_primary?: boolean;
          label?: string | null;
          provider?: string | null;
          type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payment_methods_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      personal_categories: {
        Row: {
          created_at: string;
          emoji: string;
          id: string;
          is_active: boolean;
          is_archived: boolean;
          is_deleted: boolean;
          is_expense: boolean;
          is_system: boolean;
          name: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          emoji: string;
          id?: string;
          is_active?: boolean;
          is_archived?: boolean;
          is_deleted?: boolean;
          is_expense: boolean;
          is_system: boolean;
          name: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          emoji?: string;
          id?: string;
          is_active?: boolean;
          is_archived?: boolean;
          is_deleted?: boolean;
          is_expense?: boolean;
          is_system?: boolean;
          name?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'personal_categories_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      personal_transactions: {
        Row: {
          amount: number;
          category_id: string;
          converted_amount: number;
          converted_currency: string;
          created_at: string;
          currency: string;
          date: string;
          description: string;
          file_name: string | null;
          id: string;
          is_deleted: boolean;
          notes: string | null;
          tx_type: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          category_id: string;
          converted_amount?: number;
          converted_currency?: string;
          created_at?: string;
          currency: string;
          date: string;
          description: string;
          file_name?: string | null;
          id: string;
          is_deleted?: boolean;
          notes?: string | null;
          tx_type?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          category_id?: string;
          converted_amount?: number;
          converted_currency?: string;
          created_at?: string;
          currency?: string;
          date?: string;
          description?: string;
          file_name?: string | null;
          id?: string;
          is_deleted?: boolean;
          notes?: string | null;
          tx_type?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'personal_expenses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'personal_transactions_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'personal_categories';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          currency: string | null;
          id: string;
          is_deleted: boolean;
          monthly_total_budget: number | null;
          name: string | null;
          qr_expired_at: number | null;
          qr_key: string | null;
          qr_url: string | null;
          updated_at: string;
          walkthrough_progress: Json;
        };
        Insert: {
          created_at?: string;
          currency?: string | null;
          id: string;
          is_deleted?: boolean;
          monthly_total_budget?: number | null;
          name?: string | null;
          qr_expired_at?: number | null;
          qr_key?: string | null;
          qr_url?: string | null;
          updated_at?: string;
          walkthrough_progress?: Json;
        };
        Update: {
          created_at?: string;
          currency?: string | null;
          id?: string;
          is_deleted?: boolean;
          monthly_total_budget?: number | null;
          name?: string | null;
          qr_expired_at?: number | null;
          qr_key?: string | null;
          qr_url?: string | null;
          updated_at?: string;
          walkthrough_progress?: Json;
        };
        Relationships: [];
      };
      subscription_invites: {
        Row: {
          accepted_at: string | null;
          accepted_by: string | null;
          created_at: string | null;
          expires_at: string;
          id: string;
          invited_by: string;
          status: string;
          subscription_id: string;
          updated_at: string | null;
        };
        Insert: {
          accepted_at?: string | null;
          accepted_by?: string | null;
          created_at?: string | null;
          expires_at: string;
          id?: string;
          invited_by: string;
          status?: string;
          subscription_id: string;
          updated_at?: string | null;
        };
        Update: {
          accepted_at?: string | null;
          accepted_by?: string | null;
          created_at?: string | null;
          expires_at?: string;
          id?: string;
          invited_by?: string;
          status?: string;
          subscription_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'subscription_invites_subscription_id_fkey';
            columns: ['subscription_id'];
            isOneToOne: false;
            referencedRelation: 'subscriptions';
            referencedColumns: ['id'];
          },
        ];
      };
      subscription_members: {
        Row: {
          accepted_at: string | null;
          created_at: string | null;
          id: string;
          invited_at: string | null;
          invited_by: string | null;
          removed_at: string | null;
          role: string;
          status: string;
          subscription_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          accepted_at?: string | null;
          created_at?: string | null;
          id?: string;
          invited_at?: string | null;
          invited_by?: string | null;
          removed_at?: string | null;
          role?: string;
          status?: string;
          subscription_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          accepted_at?: string | null;
          created_at?: string | null;
          id?: string;
          invited_at?: string | null;
          invited_by?: string | null;
          removed_at?: string | null;
          role?: string;
          status?: string;
          subscription_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscription_members_subscription_id_fkey';
            columns: ['subscription_id'];
            isOneToOne: false;
            referencedRelation: 'subscriptions';
            referencedColumns: ['id'];
          },
        ];
      };
      subscriptions: {
        Row: {
          cancelled_at: string | null;
          created_at: string | null;
          expires_at: string | null;
          id: string;
          max_members: number;
          plan_display_name: string | null;
          product_id: string;
          rc_customer_id: string;
          rc_original_transaction_id: string | null;
          status: string;
          tier: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          cancelled_at?: string | null;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          max_members?: number;
          plan_display_name?: string | null;
          product_id: string;
          rc_customer_id: string;
          rc_original_transaction_id?: string | null;
          status?: string;
          tier?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          cancelled_at?: string | null;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          max_members?: number;
          plan_display_name?: string | null;
          product_id?: string;
          rc_customer_id?: string;
          rc_original_transaction_id?: string | null;
          status?: string;
          tier?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_currency_periods: {
        Row: {
          created_at: string;
          currency: string;
          effective_at: string;
          id: string;
          is_deleted: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          currency: string;
          effective_at?: string;
          id?: string;
          is_deleted?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          currency?: string;
          effective_at?: string;
          id?: string;
          is_deleted?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_currency_period_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_transaction_images: {
        Row: {
          created_at: string;
          id: string;
          image_key: string;
          image_size: number;
          is_active: boolean;
          is_deleted: boolean;
          transaction_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          image_key: string;
          image_size: number;
          is_active?: boolean;
          is_deleted?: boolean;
          transaction_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_key?: string;
          image_size?: number;
          is_active?: boolean;
          is_deleted?: boolean;
          transaction_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_transaction_images_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      user_payment_methods_view: {
        Row: {
          created_at: string | null;
          id: string | null;
          image_expired_at: number | null;
          image_key: string | null;
          image_url: string | null;
          is_active: boolean | null;
          is_primary: boolean | null;
          provider: string | null;
          type: string | null;
          updated_at: string | null;
          user_id: string | null;
          user_name: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'payment_methods_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      v_group_transaction_participants: {
        Row: {
          amount: number | null;
          category_id: string | null;
          converted_amount: number | null;
          converted_currency: string | null;
          creator_name: string | null;
          creator_participant_id: string | null;
          currency: string | null;
          date: string | null;
          description: string | null;
          file_name: string | null;
          group_id: string | null;
          gtp_id: string | null;
          is_host: boolean | null;
          is_paid: boolean | null;
          name: string | null;
          notes: string | null;
          owed_amount: number | null;
          paid_amount: number | null;
          participant_id: string | null;
          participant_name: string | null;
          settle_metadata: Json | null;
          settle_mode: string | null;
          status: string | null;
          transaction_converted_amount: number | null;
          transaction_converted_currency: string | null;
          transaction_created_at: string | null;
          transaction_id: string | null;
          transaction_is_deleted: boolean | null;
          transaction_updated_at: string | null;
          tx_type: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'group_transaction_participants_participant_id_fkey';
            columns: ['participant_id'];
            isOneToOne: false;
            referencedRelation: 'group_participants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_transactions_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'group_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_transactions_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_transactions_participant_id_fkey';
            columns: ['creator_participant_id'];
            isOneToOne: false;
            referencedRelation: 'group_participants';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      get_groups_for_user: { Args: { user_id: string }; Returns: string[] };
      get_header: { Args: { item: string }; Returns: string };
      get_user_entitlement: { Args: { p_user_id: string }; Returns: Json };
      pull: {
        Args: {
          current_user_id: string;
          last_pulled_at: number;
          one_time_split_expenses_meta: Json;
        };
        Returns: Json;
      };
      pull1: {
        Args: {
          current_user_id: string;
          group_pre_join_meta: Json;
          last_pulled_at: number;
          one_time_split_expenses_meta: Json;
        };
        Returns: Json;
      };
      pull2: {
        Args: {
          current_user_id: string;
          group_pre_join_meta: Json;
          last_pulled_at: number;
          one_time_split_expenses_meta: Json;
        };
        Returns: Json;
      };
      pull3: {
        Args: {
          current_user_id: string;
          group_pre_join_meta: Json;
          last_pulled_at: number;
          one_time_split_expenses_meta: Json;
        };
        Returns: Json;
      };
      pull4: {
        Args: {
          current_user_id: string;
          group_pre_join_meta: Json;
          last_pulled_at: number;
          one_time_split_expenses_meta: Json;
        };
        Returns: Json;
      };
      pull5: {
        Args: {
          current_user_id: string;
          group_pre_join_meta: Json;
          last_pulled_at: number;
          one_time_split_expenses_meta: Json;
        };
        Returns: Json;
      };
      push: { Args: { changes: Json }; Returns: undefined };
      push1: { Args: { changes: Json }; Returns: undefined };
      push3: { Args: { changes: Json }; Returns: undefined };
      push4: { Args: { changes: Json }; Returns: undefined };
      push5: { Args: { changes: Json }; Returns: undefined };
      update_instant_split_status: {
        Args: { eps?: number; p_expense_id: string };
        Returns: {
          amount: number;
          currency: string;
          description: string;
          id: string;
          status: string;
          user_id: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
