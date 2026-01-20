export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  public: {
    Tables: {
      package_templates: {
        Row: {
          id: number
          package_id: number
          template_id: number
          created_at: string
        }
        Insert: {
          id?: number
          package_id: number
          template_id: number
          created_at?: string
        }
        Update: {
          id?: number
          package_id?: number
          template_id?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'package_templates_package_id_fkey'
            columns: ['package_id']
            isOneToOne: false
            referencedRelation: 'packages'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'package_templates_template_id_fkey'
            columns: ['template_id']
            isOneToOne: false
            referencedRelation: 'templates'
            referencedColumns: ['id']
          }
        ]
      }
      packages: {
        Row: {
          id: number
          name: string
          price: number
          original_price: number | null
          duration_months: number
          max_rsvps: number | null
          features: Json | null
          promotion_end_date: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          price: number
          original_price?: number | null
          duration_months?: number
          max_rsvps?: number | null
          features?: Json | null
          promotion_end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          price?: number
          original_price?: number | null
          duration_months?: number
          max_rsvps?: number | null
          features?: Json | null
          promotion_end_date?: string | null
          created_at?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          created_at: string
          guest_name: string
          id: number
          is_attending: boolean | null
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
          slug: string
          template_id: number | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          deployment_status?: string | null
          host_id: string
          id?: string
          slug: string
          template_id?: number | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          deployment_status?: string | null
          host_id?: string
          id?: string
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
          }
        ]
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
