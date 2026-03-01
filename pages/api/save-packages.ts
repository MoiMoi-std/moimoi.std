import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/initSupabase'
import { Plan } from '@/lib/plan-store'

/**
 * POST /api/save-packages - Lưu tất cả packages vào database
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { plans } = req.body as { plans: Plan[] }

    if (!Array.isArray(plans)) {
      return res.status(400).json({ error: 'Invalid plans data' })
    }

    // Lấy tất cả packages hiện có trong database
    const { data: existingPackages, error: fetchError } = await supabase.from('packages').select('id')

    if (fetchError) {
      console.error('Error fetching existing packages:', fetchError)
      return res.status(500).json({ error: 'Không thể tải danh sách gói hiện có' })
    }

    const existingIds = new Set((existingPackages || []).map((pkg) => String(pkg.id)))
    const planIds = new Set(plans.map((p) => p.id).filter((id) => !isNaN(parseInt(id))))

    // Xóa các packages không còn trong danh sách (chỉ xóa những gói có ID là số)
    const idsToDelete = Array.from(existingIds).filter((id) => !planIds.has(id))
    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('packages')
        .delete()
        .in(
          'id',
          idsToDelete.map((id) => parseInt(id))
        )

      if (deleteError) {
        console.error('Error deleting packages:', deleteError)
      }
    }

    // Upsert từng package
    const results = await Promise.all(
      plans.map(async (plan) => {
        try {
          // Parse features object
          const featuresObj: Record<string, any> = {
            features: plan.features || [],
            notIncluded: plan.notIncluded || [],
            description: plan.description || '',
            highlight: plan.highlight || false
          }

          // Determine price and original_price based on discount
          const hasDiscount = plan.discountPrice != null && plan.discountPrice > 0
          const price = hasDiscount ? plan.discountPrice : plan.price
          const originalPrice = hasDiscount ? plan.price : null

          // Parse duration to months
          let durationMonths: number | null = null
          if (plan.duration) {
            const lowerDuration = plan.duration.toLowerCase()
            if (lowerDuration.includes('tháng')) {
              const match = lowerDuration.match(/(\d+)\s*tháng/)
              if (match) durationMonths = parseInt(match[1])
            } else if (lowerDuration.includes('năm')) {
              const match = lowerDuration.match(/(\d+)\s*năm/)
              if (match) durationMonths = parseInt(match[1]) * 12
            } else if (lowerDuration.includes('vĩnh viễn') || lowerDuration.includes('forever')) {
              durationMonths = 9999
            }
          }

          const packageId = parseInt(plan.id)
          const isNewPackage = isNaN(packageId)

          if (isNewPackage) {
            // Insert new package
            const { data, error } = await supabase
              .from('packages')
              .insert({
                name: plan.name,
                price: price,
                original_price: originalPrice,
                duration_months: durationMonths,
                features: featuresObj,
                is_active: plan.isActive !== false,
                promotion_end_date: plan.discountEndsAt || null
              })
              .select()
              .single()

            if (error) {
              console.error(`Error inserting package ${plan.name}:`, error)
              return { success: false, id: plan.id, error: error.message }
            }

            return { success: true, id: plan.id, data }
          } else {
            // Update existing package
            const { data, error } = await supabase
              .from('packages')
              .update({
                name: plan.name,
                price: price,
                original_price: originalPrice,
                duration_months: durationMonths,
                features: featuresObj,
                is_active: plan.isActive !== false,
                promotion_end_date: plan.discountEndsAt || null
              })
              .eq('id', packageId)
              .select()
              .single()

            if (error) {
              console.error(`Error updating package ${plan.id}:`, error)
              return { success: false, id: plan.id, error: error.message }
            }

            return { success: true, id: plan.id, data }
          }
        } catch (err: any) {
          console.error(`Error processing package ${plan.id}:`, err)
          return { success: false, id: plan.id, error: err.message }
        }
      })
    )

    const failed = results.filter((r) => !r.success)
    if (failed.length > 0) {
      console.error('Failed packages:', failed)
      return res.status(500).json({
        success: false,
        error: `Không thể lưu ${failed.length} gói`,
        details: failed
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Đã lưu tất cả gói thành công',
      count: results.length
    })
  } catch (error: any) {
    console.error('Error saving packages:', error)
    return res.status(500).json({
      success: false,
      error: 'Lỗi server khi lưu packages',
      message: error.message
    })
  }
}
