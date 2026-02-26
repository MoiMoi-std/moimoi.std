import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/initSupabase'
import { Plan } from '@/lib/plan-store'

function durationLabel(months: number): string {
  if (months < 12) return `${months} tháng`
  const years = months / 12
  return Number.isInteger(years) ? `${years} năm` : `${months} tháng`
}

function parseFeatures(raw: unknown): { features: string[]; notIncluded: string[]; description?: string; highlight?: boolean } {
  if (!raw) return { features: [], notIncluded: [] }

  // Array of strings → treat all as features
  if (Array.isArray(raw)) {
    return { features: raw.map(String), notIncluded: [] }
  }

  // Object with known keys
  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>
    const features = Array.isArray(obj.features) ? obj.features.map(String) : []
    const notIncluded = Array.isArray(obj.notIncluded)
      ? obj.notIncluded.map(String)
      : Array.isArray(obj.not_included)
      ? (obj.not_included as unknown[]).map(String)
      : []
    const description = typeof obj.description === 'string' ? obj.description : undefined
    const highlight = typeof obj.highlight === 'boolean' ? obj.highlight : undefined
    return { features, notIncluded, description, highlight }
  }

  return { features: [], notIncluded: [] }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true })

  if (error) {
    console.error('Fetch packages error:', error)
    return res.status(500).json({ error: 'Không thể tải danh sách gói' })
  }

  const plans: Plan[] = (packages ?? []).map((pkg) => {
    const { features, notIncluded, description, highlight } = parseFeatures(pkg.features)

    // price = selling price, original_price = strikethrough price
    const hasDiscount = pkg.original_price != null && pkg.original_price > pkg.price

    return {
      id: String(pkg.id),
      name: pkg.name,
      price: hasDiscount ? (pkg.original_price as number) : pkg.price,
      discountPrice: hasDiscount ? pkg.price : undefined,
      discountEndsAt: pkg.promotion_end_date ?? undefined,
      duration: pkg.duration_months ? durationLabel(pkg.duration_months) : undefined,
      description: description ?? '',
      features,
      notIncluded,
      highlight: highlight ?? false,
      isActive: pkg.is_active,
    }
  })

  return res.status(200).json({ plans })
}
