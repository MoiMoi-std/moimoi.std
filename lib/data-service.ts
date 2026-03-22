import { Database } from '../types/supabase'
import { supabase } from './initSupabase'

export interface Wedding extends Omit<Database['public']['Tables']['weddings']['Row'], 'content'> {
  content: WeddingContent
  template?: Template
  package?: {
    id: number
    name: string
    price: number
    is_active: boolean
  } | null
}

export type RSVP = Database['public']['Tables']['rsvps']['Row']
export type Template = Database['public']['Tables']['templates']['Row']

export interface WeddingContent {
  groom_name?: string
  groom_role?: string
  bride_name?: string
  bride_role?: string
  groom_image?: string | null
  bride_image?: string | null
  cover_image?: string | null
  qr_image?: string | null
  groom_address?: string
  bride_address?: string
  event_date?: string
  party_time?: string
  wedding_date?: string
  lunar_date?: string
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
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('weddings')
      .select('*, template:templates(*), package:packages(id, name, price, is_active)')
      .eq('host_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching wedding:', error)
      return null
    }

    if (!data) {
      return null
    }

    const content: WeddingContent = (data.content as unknown as WeddingContent) || {}

    // Lấy expires_at từ bảng orders (source of truth) để tránh lệch dữ liệu
    const { data: latestOrder } = await supabase
      .from('orders')
      .select('expires_at, package_id')
      .eq('wedding_id', data.id)
      .eq('status', 'paid')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (latestOrder?.expires_at) {
      content.expires_at = latestOrder.expires_at
    }

    return {
      ...data,
      content
    } as Wedding
  },

  getWeddingBySlug: async (slug: string): Promise<Wedding | null> => {
    const { data, error } = await supabase.from('weddings').select('*, template:templates(*)').eq('slug', slug).single()

    if (error) return null

    return {
      ...data,
      content: (data.content as unknown as WeddingContent) || {}
    } as Wedding
  },

  createWedding: async (): Promise<Wedding | null> => {
    const {
      data: { user }
    } = await supabase.auth.getUser()
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

  updateWedding: async (
    weddingId: string,
    content: WeddingContent,
    musicId?: number | null
  ): Promise<Wedding | null> => {
    const updates: Database['public']['Tables']['weddings']['Update'] = { content: content as any }
    if (musicId !== undefined) updates.music_id = musicId
    const { data, error } = await supabase.from('weddings').update(updates).eq('id', weddingId).select().single()

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
    return data ?? []
  },

  getTemplates: async (): Promise<Template[]> => {
    try {
      const response = await fetch('/api/templates')
      if (!response.ok) {
        console.error('Templates API failed:', response.status)
        return []
      }
      const result = await response.json()
      if (result.success && result.data) {
        return result.data
      }
      return []
    } catch (error) {
      console.error('Template fetch failed:', error)
      return []
    }
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
        await supabase.from('weddings').update({ deployment_status: 'published' }).eq('id', weddingId)

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
    console.log(`Export functionality would generate an Excel file here.`)
  },

  createRSVP: async (rsvp: Database['public']['Tables']['rsvps']['Insert']): Promise<RSVP | null> => {
    const { data, error } = await supabase.from('rsvps').insert(rsvp).select().single()

    if (error) {
      console.error('Error creating RSVP:', error)
      return null
    }
    return data
  },

  updateRSVP: async (
    rsvpId: number,
    updates: Database['public']['Tables']['rsvps']['Update']
  ): Promise<RSVP | null> => {
    const { data, error } = await supabase.from('rsvps').update(updates).eq('id', rsvpId).select().single()

    if (error) {
      console.error('Error updating RSVP:', error)
      return null
    }
    return data
  }
}
