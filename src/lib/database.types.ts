export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      friends: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          is_deleted: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id: string
          is_deleted?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          is_deleted?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      one_time_split_expenses: {
        Row: {
          amount: number
          category_id: string
          converted_amount: number | null
          converted_currency: string | null
          created_at: string
          currency: string
          date: string
          description: string
          file_name: string | null
          id: string
          is_deleted: boolean
          link: string | null
          notes: string | null
          settle_metadata: Json | null
          settle_mode: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category_id: string
          converted_amount?: number | null
          converted_currency?: string | null
          created_at?: string
          currency: string
          date: string
          description: string
          file_name?: string | null
          id: string
          is_deleted?: boolean
          link?: string | null
          notes?: string | null
          settle_metadata?: Json | null
          settle_mode: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string
          converted_amount?: number | null
          converted_currency?: string | null
          created_at?: string
          currency?: string
          date?: string
          description?: string
          file_name?: string | null
          id?: string
          is_deleted?: boolean
          link?: string | null
          notes?: string | null
          settle_metadata?: Json | null
          settle_mode?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "one_time_split_expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "personal_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_expense_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      one_time_split_expenses_participants: {
        Row: {
          amount: number
          converted_amount: number | null
          converted_currency: string | null
          created_at: string
          expense_id: string
          id: string
          is_deleted: boolean
          is_host: boolean | null
          is_paid: boolean
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          converted_amount?: number | null
          converted_currency?: string | null
          created_at?: string
          expense_id: string
          id?: string
          is_deleted?: boolean
          is_host?: boolean | null
          is_paid?: boolean
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          converted_amount?: number | null
          converted_currency?: string | null
          created_at?: string
          expense_id?: string
          id?: string
          is_deleted?: boolean
          is_host?: boolean | null
          is_paid?: boolean
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_expense_participation_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "one_time_split_expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_expense_participation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_categories: {
        Row: {
          created_at: string
          emoji: string
          id: string
          is_deleted: boolean
          is_expense: boolean
          is_system: boolean
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          is_deleted?: boolean
          is_expense: boolean
          is_system: boolean
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          is_deleted?: boolean
          is_expense?: boolean
          is_system?: boolean
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_transactions: {
        Row: {
          amount: number
          category_id: string
          converted_amount: number
          converted_currency: string
          created_at: string
          currency: string
          date: string
          description: string
          file_name: string | null
          id: string
          is_deleted: boolean
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category_id: string
          converted_amount?: number
          converted_currency?: string
          created_at?: string
          currency: string
          date: string
          description: string
          file_name?: string | null
          id: string
          is_deleted?: boolean
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string
          converted_amount?: number
          converted_currency?: string
          created_at?: string
          currency?: string
          date?: string
          description?: string
          file_name?: string | null
          id?: string
          is_deleted?: boolean
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "personal_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          currency: string
          id: string
          name: string | null
          qr_expired_at: number | null
          qr_key: string | null
          qr_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id: string
          name?: string | null
          qr_expired_at?: number | null
          qr_key?: string | null
          qr_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          name?: string | null
          qr_expired_at?: number | null
          qr_key?: string | null
          qr_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_header: {
        Args: { item: string }
        Returns: string
      }
      pull: {
        Args: {
          one_time_split_expenses_meta: Json
          last_pulled_at: number
          current_user_id: string
        }
        Returns: Json
      }
      pull5: {
        Args: {
          last_pulled_at: number
          current_user_id: string
          one_time_split_expenses_meta: Json
        }
        Returns: Json
      }
      push: {
        Args: { changes: Json }
        Returns: undefined
      }
      push1: {
        Args: { changes: Json }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
