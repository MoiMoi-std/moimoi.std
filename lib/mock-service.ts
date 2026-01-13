export interface Wedding {
  id: string
  host_id: string
  template_id: string
  content: {
    groom_name: string
    bride_name: string
    wedding_date: string
    wedding_time: string
    address: string
    map_url: string
    images: string[]
    bank_name: string
    account_number: string
    account_name: string
  }
  slug: string
  deployment_status: 'draft' | 'building' | 'published' | 'failed'
  repo_branch?: string
}

export interface RSVP {
  id: string
  wedding_id: string
  guest_name: string
  phone: string
  wishes: string
  is_attending: boolean
  party_size: number
  created_at: string
}

export interface Template {
  id: string
  name: string
  thumbnail_url: string
  repo_branch: string
}

const MOCK_TEMPLATES: Template[] = [
  {
    id: 'tpl_01',
    name: 'Vintage Theme',
    thumbnail_url: 'https://via.placeholder.com/300x200?text=Vintage',
    repo_branch: 'theme-vintage'
  },
  {
    id: 'tpl_02',
    name: 'Modern Theme',
    thumbnail_url: 'https://via.placeholder.com/300x200?text=Modern',
    repo_branch: 'theme-modern'
  }
]

const MOCK_WEDDING: Wedding = {
  id: 'wed_123',
  host_id: 'user_001',
  template_id: 'tpl_01',
  content: {
    groom_name: 'Minh Tuan',
    bride_name: 'Thu Hien',
    wedding_date: '2023-12-25',
    wedding_time: '18:00',
    address: 'Grand Palace, 142/18 Cong Hoa, Tan Binh, TP.HCM',
    map_url: 'https://maps.google.com',
    images: [
      'https://via.placeholder.com/400x300?text=Wedding+1',
      'https://via.placeholder.com/400x300?text=Wedding+2'
    ],
    bank_name: 'Vietcombank',
    account_number: '999988887777',
    account_name: 'NGUYEN MINH TUAN'
  },
  slug: 'tuan-hien',
  deployment_status: 'draft',
  repo_branch: 'theme-vintage'
}

const MOCK_RSVPS: RSVP[] = [
  {
    id: 'rsvp_1',
    wedding_id: 'wed_123',
    guest_name: 'Nguyen Van A',
    phone: '0909123456',
    wishes: 'Chuc mung hanh phuc!',
    is_attending: true,
    party_size: 2,
    created_at: '2023-10-01T10:00:00Z'
  },
  {
    id: 'rsvp_2',
    wedding_id: 'wed_123',
    guest_name: 'Tran Thi B',
    phone: '0909654321',
    wishes: '',
    is_attending: false,
    party_size: 0,
    created_at: '2023-10-02T11:30:00Z'
  }
]

export const mockService = {
  getWedding: async (): Promise<Wedding> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...MOCK_WEDDING }), 500)
    })
  },

  updateWedding: async (data: Partial<Wedding>): Promise<Wedding> => {
    return new Promise((resolve) => {
      // In a real app, we would merge data here
      console.log('Updating wedding:', data)
      setTimeout(() => resolve({ ...MOCK_WEDDING, ...data }), 800)
    })
  },

  getRSVPs: async (): Promise<RSVP[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_RSVPS]), 600)
    })
  },

  getTemplates: async (): Promise<Template[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_TEMPLATES]), 400)
    })
  },

  deployWedding: async (): Promise<{ success: boolean; status: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, status: 'published' })
      }, 2000)
    })
  },

  exportRSVPs: async (): Promise<void> => {
    return new Promise((resolve) => {
      console.log('Exporting RSVPs...')
      setTimeout(() => {
        alert('Mock: Downloaded rsvps.xlsx')
        resolve()
      }, 1000)
    })
  }
}
