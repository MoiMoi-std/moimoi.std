import dynamic from 'next/dynamic'
import { Wedding } from '@/lib/data-service'

// Props chuẩn mà mọi Template đều phải nhận
export interface TemplateProps {
  wedding: Wedding
  guestName?: string
  rsvpId?: number
  disableSplash?: boolean
  musicUrl?: string
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
  },
  'theme-nature': {
    GeneralView: dynamic(() => import('./ThemeNature/GeneralView')),
    GuestView: dynamic(() => import('./ThemeNature/GuestView'))
  },
  'theme-cherry-blossom': {
    GeneralView: dynamic(() => import('./ThemeCherryBlossom/GeneralView')),
    GuestView: dynamic(() => import('./ThemeCherryBlossom/GuestView'))
  },
  'theme-minimalist': {
    GeneralView: dynamic(() => import('./ThemeMinimalist/GeneralView')),
    GuestView: dynamic(() => import('./ThemeMinimalist/GuestView'))
  },
  'theme-royal': {
    GeneralView: dynamic(() => import('./ThemeRoyal/GeneralView')),
    GuestView: dynamic(() => import('./ThemeRoyal/GuestView'))
  },
  'theme-boho': {
    GeneralView: dynamic(() => import('./ThemeBoho/GeneralView')),
    GuestView: dynamic(() => import('./ThemeBoho/GuestView'))
  },
  'theme-ocean': {
    GeneralView: dynamic(() => import('./ThemeOcean/GeneralView')),
    GuestView: dynamic(() => import('./ThemeOcean/GuestView'))
  },
  'theme-golden-hour': {
    GeneralView: dynamic(() => import('./ThemeGoldenHour/GeneralView')),
    GuestView: dynamic(() => import('./ThemeGoldenHour/GuestView'))
  },
  'theme-art-deco': {
    GeneralView: dynamic(() => import('./ThemeArtDeco/GeneralView')),
    GuestView: dynamic(() => import('./ThemeArtDeco/GuestView'))
  },
  'theme-provence': {
    GeneralView: dynamic(() => import('./ThemeProvence/GeneralView')),
    GuestView: dynamic(() => import('./ThemeProvence/GuestView'))
  },
  'theme-midnight': {
    GeneralView: dynamic(() => import('./ThemeMidnight/GeneralView')),
    GuestView: dynamic(() => import('./ThemeMidnight/GuestView'))
  },
  'theme-oriental': {
    GeneralView: dynamic(() => import('./ThemeOriental/GeneralView')),
    GuestView: dynamic(() => import('./ThemeOriental/GuestView'))
  },
  'theme-rustic': {
    GeneralView: dynamic(() => import('./ThemeRustic/GeneralView')),
    GuestView: dynamic(() => import('./ThemeRustic/GuestView'))
  },
  'theme-pastel': {
    GeneralView: dynamic(() => import('./ThemePastel/GeneralView')),
    GuestView: dynamic(() => import('./ThemePastel/GuestView'))
  }
}

// Helper: lấy template theo branch, fallback về 'default'
export function getTemplate(branch?: string | null) {
  if (branch && Templates[branch]) {
    return Templates[branch]
  }
  return Templates['default']
}
