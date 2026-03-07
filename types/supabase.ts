export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  public: {
    Tables: {
      musics: {
        Row: {
          id: number
          created_at: string
          title: string
          artist: string | null
          url: string
          is_active: boolean | null
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          artist?: string | null
          url: string
          is_active?: boolean | null
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          artist?: string | null
          url?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          created_at: string
          guest_name: string
          id: number
          is_attending: boolean | null
          link: string | null
          party_size: number | null
          phone: string | null
          wedding_id: string
          wishes: string | null
        }
        Insert: {
          created_at?: string
          guest_name: string
          id?: number
          is_attending?: boolean | null
          link?: string | null
          party_size?: number | null
          phone?: string | null
          wedding_id: string
          wishes?: string | null
        }
        Update: {
          created_at?: string
          guest_name?: string
          id?: number
          is_attending?: boolean | null
          link?: string | null
          party_size?: number | null
          phone?: string | null
          wedding_id?: string
          wishes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'rsvps_wedding_id_fkey'
            columns: ['wedding_id']
            isOneToOne: false
            referencedRelation: 'weddings'
            referencedColumns: ['id']
          }
        ]
      }
      templates: {
        Row: {
          created_at: string
          id: number
          name: string
          repo_branch: string
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          repo_branch: string
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          repo_branch?: string
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      weddings: {
        Row: {
          content: Json | null
          created_at: string
          deployment_status: string | null
          host_id: string
          id: string
          music_id: number | null
          slug: string
          template_id: number | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          deployment_status?: string | null
          host_id: string
          id?: string
          music_id?: number | null
          slug: string
          template_id?: number | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          deployment_status?: string | null
          host_id?: string
          id?: string
          music_id?: number | null
          slug?: string
          template_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'weddings_template_id_fkey'
            columns: ['template_id']
            isOneToOne: false
            referencedRelation: 'templates'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'weddings_music_id_fkey'
            columns: ['music_id']
            isOneToOne: false
            referencedRelation: 'musics'
            referencedColumns: ['id']
          }
        ]
      }
      orders: {
        Row: {
          id: string
          order_code: string | null
          wedding_id: string | null
          package_id: number | null
          amount: number | null
          payment_method: string | null
          status: string | null
          payment_info: Json | null
          transaction_id: string | null
          paid_at: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_code?: string | null
          wedding_id?: string | null
          package_id?: number | null
          amount?: number | null
          payment_method?: string | null
          status?: string | null
          payment_info?: Json | null
          transaction_id?: string | null
          paid_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_code?: string | null
          wedding_id?: string | null
          package_id?: number | null
          amount?: number | null
          payment_method?: string | null
          status?: string | null
          payment_info?: Json | null
          transaction_id?: string | null
          paid_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: number
          transaction_code: string | null
          customer: string | null
          service: string | null
          amount: number | null
          payment_gateway: string | null
          status: string | null
          transaction_date: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: number
          transaction_code?: string | null
          customer?: string | null
          service?: string | null
          amount?: number | null
          payment_gateway?: string | null
          status?: string | null
          transaction_date?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          transaction_code?: string | null
          customer?: string | null
          service?: string | null
          amount?: number | null
          payment_gateway?: string | null
          status?: string | null
          transaction_date?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {}
  }
} as const
