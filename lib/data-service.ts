import { supabase } from './initSupabase'
import { Database } from '../types/supabase'

export interface Wedding extends Omit<Database['public']['Tables']['weddings']['Row'], 'content'> {
  content: WeddingContent
  template?: Template
}

export type RSVP = Database['public']['Tables']['rsvps']['Row']
export type Template = Database['public']['Tables']['templates']['Row']

export interface WeddingContent {
  groom_name?: string
  bride_name?: string
  wedding_date?: string
  wedding_time?: string
  address?: string
  map_url?: string
  images?: string[]
  bank_name?: string
  account_number?: string
  account_name?: string
  [key: string]: any
}

export const dataService = {
  getWedding: async (): Promise<Wedding | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('weddings')
      .select('*, template:templates(*)')
      .eq('host_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching wedding:', error)
      return null
    }

    return {
      ...data,
      content: (data.content as unknown as WeddingContent) || {}
    } as Wedding
  },

  createWedding: async (): Promise<Wedding | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Call API to bypass RLS
    const response = await fetch('/api/create-wedding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host_id: user.id })
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Failed to create wedding:', err)
      throw new Error(err.error || 'Failed to create')
    }
    const data = await response.json()

    return {
      ...data,
      content: (data.content as unknown as WeddingContent) || {}
    } as Wedding
  },

  updateWedding: async (weddingId: string, content: WeddingContent): Promise<Wedding | null> => {
    const { data, error } = await supabase
      .from('weddings')
      .update({ content: content })
      .eq('id', weddingId)
      .select()
      .single()

    if (error) {
      console.error('Error updating wedding:', error)
      throw error
    }

    return {
      ...data,
      content: (data.content as unknown as WeddingContent) || {}
    } as Wedding
  },

  updateWeddingTemplate: async (weddingId: string, templateId: number): Promise<void> => {
    const { error } = await supabase.from('weddings').update({ template_id: templateId }).eq('id', weddingId)
    if (error) {
      console.error('Error updating template:', error)
      throw error
    }
  },

  getRSVPs: async (weddingId: string): Promise<RSVP[]> => {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching RSVPs:', error)
      return []
    }
    return data
  },

  getTemplates: async (): Promise<Template[]> => {
    const { data, error } = await supabase.from('templates').select('*')
    if (error) {
      console.error('Error fetching templates:', error)
      return []
    }
    return data
  },

  deployWedding: async (
    weddingId: string,
    templateBranch: string = 'theme-vintage'
  ): Promise<{ success: boolean; status: string }> => {
    try {
      const response = await fetch('/api/trigger-deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weddingId, templateBranch })
      })

      if (response.ok) {
        await supabase
          .from('weddings')
          .update({ deployment_status: 'published' })
          .eq('id', weddingId)

        return { success: true, status: 'building' }
      } else {
        console.error('Deploy failed')
        return { success: false, status: 'failed' }
      }
    } catch (e) {
      return { success: false, status: 'failed' }
    }
  },

  exportRSVPs: async (weddingId: string): Promise<void> => {
    console.log(`Exporting RSVPs for ${weddingId}`)
    alert('Export functionality would generate an Excel file here.')
  }
}
