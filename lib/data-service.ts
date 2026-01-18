import { Database } from '../types/supabase'
import { supabase } from './initSupabase'

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
    const {
      data: { user }
    } = await supabase.auth.getUser()
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
    const [dbResult, mockTemplates] = await Promise.all([
      supabase.from('templates').select('*'),
      Promise.resolve(createMockTemplates(36))
    ])

    if (dbResult.error) {
      console.warn('Template fetch failed, using mock data:', dbResult.error)
      return mockTemplates
    }

    const dbTemplates = dbResult.data || []
    if (dbTemplates.length === 0) return mockTemplates

    const merged = new Map<number, Template>()
    dbTemplates.forEach((template) => merged.set(template.id, template))
    mockTemplates.forEach((template) => {
      if (!merged.has(template.id)) {
        merged.set(template.id, template)
      }
    })

    return Array.from(merged.values())
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
  }
}

const TEMPLATE_NAMES = [
  'Vintage Rose',
  'Modern Minimal',
  'Luxury Gold',
  'Floral Dream',
  'Korean Style',
  'Traditional Red',
  'Olive Garden',
  'Midnight Bloom',
  'Classic Ivory',
  'Warm Terracotta',
  'Ocean Breeze',
  'Sunset Bliss'
]

const TEMPLATE_BRANCHES = ['vintage', 'modern', 'minimal', 'luxury', 'classic', 'floral', 'korean', 'traditional']
const TEMPLATE_COLORS = ['#FDE68A', '#E5E7EB', '#FEF3C7', '#FCE7F3', '#DBEAFE', '#FEE2E2', '#E0F2FE', '#E7E5E4']

const createTemplateThumbnail = (name: string, subtitle: string, color: string) => {
  const safeName = name.replace(/&/g, 'and')
  const safeSubtitle = subtitle.replace(/&/g, 'and')
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800">
      <rect width="100%" height="100%" fill="${color}"/>
      <rect x="40" y="60" width="520" height="680" rx="32" fill="rgba(255,255,255,0.6)"/>
      <text x="300" y="380" text-anchor="middle" font-size="36" font-family="Arial" fill="#374151">${safeName}</text>
      <text x="300" y="430" text-anchor="middle" font-size="20" font-family="Arial" fill="#9CA3AF">${safeSubtitle}</text>
    </svg>
  `
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const createMockTemplates = (count: number): Template[] => {
  const now = new Date().toISOString()
  return Array.from({ length: count }, (_, index) => {
    const name = TEMPLATE_NAMES[index % TEMPLATE_NAMES.length]
    const style = TEMPLATE_BRANCHES[index % TEMPLATE_BRANCHES.length]
    return {
      id: index + 1,
      name: `${name} ${index + 1}`,
      repo_branch: `theme-${style}`,
      thumbnail_url: createTemplateThumbnail(
        `${name} ${index + 1}`,
        `Theme ${style}`,
        TEMPLATE_COLORS[index % TEMPLATE_COLORS.length]
      ),
      created_at: now
    }
  })
}
