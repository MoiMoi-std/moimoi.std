import dynamic from 'next/dynamic'
import { Wedding } from '@/lib/data-service'

// Props chuẩn mà mọi Template đều phải nhận
export interface TemplateProps {
  wedding: Wedding
  guestName?: string
  rsvpId?: number
}

// Map 'repo_branch' từ DB với Component giao diện tương ứng
export const Templates: Record<
  string,
  {
    GeneralView: React.ComponentType<TemplateProps>
    GuestView: React.ComponentType<TemplateProps>
  }
> = {
  default: {
    GeneralView: dynamic(() => import('./DefaultTheme/GeneralView')),
    GuestView: dynamic(() => import('./DefaultTheme/GuestView'))
  },
  'theme-vintage': {
    GeneralView: dynamic(() => import('./ThemeVintage/GeneralView')),
    GuestView: dynamic(() => import('./ThemeVintage/GuestView'))
  },
  'theme-modern': {
    GeneralView: dynamic(() => import('./ThemeModern/GeneralView')),
    GuestView: dynamic(() => import('./ThemeModern/GuestView'))
  },
  'theme-luxury': {
    GeneralView: dynamic(() => import('./ThemeLuxury/GeneralView')),
    GuestView: dynamic(() => import('./ThemeLuxury/GuestView'))
  }
}

// Helper: lấy template theo branch, fallback về 'default'
export function getTemplate(branch?: string | null) {
  if (branch && Templates[branch]) {
    return Templates[branch]
  }
  return Templates['default']
}
