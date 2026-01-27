import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * GET /api/templates/[id] - Lấy chi tiết template kèm packages
 * PATCH /api/templates/[id] - Cập nhật template và packages liên kết
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const templateId = parseInt(id as string)

  if (isNaN(templateId)) {
    return res.status(400).json({ error: 'Invalid template ID' })
  }

  if (req.method === 'GET') {
    try {
      // Lấy thông tin template
      const { data: template, error: templateError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (templateError) throw templateError
      if (!template) {
        return res.status(404).json({ error: 'Template not found' })
      }

      // Lấy packages liên kết
      const { data: packageTemplates, error: ptError } = await supabase
        .from('package_templates')
        .select('package_id, packages(id, name, price, original_price, duration_months, is_active)')
        .eq('template_id', templateId)

      if (ptError) throw ptError

      const packages = packageTemplates
        ?.map((pt: any) => pt.packages)
        .filter(Boolean) || []

      return res.status(200).json({
        success: true,
        data: {
          ...template,
          packages
        }
      })
    } catch (error: any) {
      console.error('GET Template Error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      const {
        name,
        repo_branch,
        thumbnail_url,
        is_active,
        package_ids // Mảng ID của packages mà template sẽ thuộc về
      } = req.body

      // Chuẩn bị dữ liệu cập nhật template
      const updateData: any = {}
      if (name !== undefined) updateData.name = name
      if (repo_branch !== undefined) updateData.repo_branch = repo_branch
      if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url
      if (is_active !== undefined) updateData.is_active = is_active

      // Cập nhật template nếu có dữ liệu
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('templates')
          .update(updateData)
          .eq('id', templateId)

        if (updateError) throw updateError
      }

      // Cập nhật quan hệ với packages nếu có package_ids
      if (package_ids !== undefined && Array.isArray(package_ids)) {
        // Xóa tất cả quan hệ cũ
        const { error: deleteError } = await supabase
          .from('package_templates')
          .delete()
          .eq('template_id', templateId)

        if (deleteError) throw deleteError

        // Thêm quan hệ mới
        if (package_ids.length > 0) {
          const insertData = package_ids.map((pkgId: number) => ({
            template_id: templateId,
            package_id: pkgId
          }))

          const { error: insertError } = await supabase
            .from('package_templates')
            .insert(insertData)

          if (insertError) throw insertError
        }
      }

      // Lấy dữ liệu mới sau khi cập nhật
      const { data: updatedTemplate, error: fetchError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (fetchError) throw fetchError

      // Lấy packages liên kết mới
      const { data: packageTemplates, error: ptError } = await supabase
        .from('package_templates')
        .select('package_id, packages(id, name, price, original_price, duration_months, is_active)')
        .eq('template_id', templateId)

      if (ptError) throw ptError

      const packages = packageTemplates
        ?.map((pt: any) => pt.packages)
        .filter(Boolean) || []

      return res.status(200).json({
        success: true,
        data: {
          ...updatedTemplate,
          packages
        },
        message: 'Template updated successfully'
      })
    } catch (error: any) {
      console.error('PATCH Template Error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
