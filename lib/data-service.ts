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
      .maybeSingle()  

    if (error) {
      console.error('Error fetching wedding:', error)
      return null
    }

     // Kiểm tra data trước khi truy cập properties
    if (!data) {
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

    if (error || !data || data.length === 0) {
      console.warn('RSVP fetch failed or empty, using mock data:', error)
      return createMockGuests(15, weddingId)
    }
    return data
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

const createMockGuests = (count: number, weddingId: string): RSVP[] => {
  const firstNames = [
    'An',
    'Bình',
    'Chi',
    'Dũng',
    'Em',
    'Giang',
    'Hà',
    'Khánh',
    'Lan',
    'Minh',
    'Nam',
    'Oanh',
    'Phúc',
    'Quân',
    'Sơn',
    'Thảo',
    'Uyên',
    'Vinh',
    'Xuân',
    'Yến'
  ]
  const middleNames = ['Văn', 'Thị', 'Đức', 'Ngọc', 'Hữu', 'Phương', 'Thanh', 'Hoàng', 'Minh', 'Thu']
  const lastNames = [
    'Nguyễn',
    'Trần',
    'Lê',
    'Phạm',
    'Hoàng',
    'Huỳnh',
    'Phan',
    'Vũ',
    'Võ',
    'Đặng',
    'Bùi',
    'Đỗ',
    'Hồ',
    'Ngô',
    'Dương',
    'Lý'
  ]

  const wishes = [
    'Chúc mừng hạnh phúc hai bạn!',
    'Chúc hai bạn trăm năm hạnh phúc, sớm sinh quý tử.',
    'Mãi mãi bên nhau bạn nhé!',
    'Happy Wedding! Chúc mừng ngày trọng đại.',
    'Rất tiếc không thể tham dự, chúc hai bạn hạnh phúc.',
    '',
    'Chúc mừng đám cưới!'
  ]

  return Array.from({ length: count }, (_, index) => {
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const middleName = middleNames[Math.floor(Math.random() * middleNames.length)]
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const fullName = `${lastName} ${middleName} ${firstName} - ${['Bạn cấp 3', 'Đồng nghiệp', 'Họ hàng', 'Bạn đại học'][Math.floor(Math.random() * 4)]}`
    const isAttending = Math.random() > 0.2 // 80% attending
    const hasPhone = Math.random() > 0.1 // 90% have phone

    return {
      id: index + 1000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      wedding_id: weddingId,
      guest_name: fullName,
      phone: hasPhone
        ? `09${Math.floor(Math.random() * 100000000)
            .toString()
            .padStart(8, '0')}`
        : null,
      email: null,
      party_size: Math.floor(Math.random() * 3) + 1, // 1-4 people
      is_attending: isAttending,
      wishes: wishes[Math.floor(Math.random() * wishes.length)],
      dietary_restrictions: null
    }
  })
}
