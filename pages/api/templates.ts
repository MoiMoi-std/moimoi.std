import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

/**
 * GET /api/templates - Lấy tất cả templates kèm packages
 * POST /api/templates - Tạo template mới
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { package_id } = req.query

      // Lấy tất cả templates
      const { data: templates, error: templatesError } = await supabase
        .from('templates')
        .select('*')
        .order('id', { ascending: true })

      if (templatesError) throw templatesError

      // Lấy package_templates để map templates với packages
      const { data: packageTemplates, error: ptError } = await supabase
        .from('package_templates')
        .select('template_id, package_id, packages(id, name, price, original_price, duration_months, is_active)')

      if (ptError) throw ptError

      // Map templates với packages
      const templatesWithPackages = templates.map((template) => {
        const relatedPackages = packageTemplates
          .filter((pt: any) => pt.template_id === template.id)
          .map((pt: any) => pt.packages)
          .filter(Boolean)

        return {
          ...template,
          packages: relatedPackages
        }
      })

      // Filter theo package_id nếu có
      let result = templatesWithPackages
      if (package_id && typeof package_id === 'string') {
        const pkgId = parseInt(package_id)
        result = templatesWithPackages.filter((t) => t.packages.some((p: any) => p.id === pkgId))
      }

      return res.status(200).json({
        success: true,
        data: result,
        count: result.length
      })
    } catch (error: any) {
      console.error('GET Templates Error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, repo_branch, thumbnail_url, is_active, package_ids } = req.body

      if (!name || !repo_branch) {
        return res.status(400).json({ error: 'Name and repo_branch are required' })
      }

      // Tạo template mới
      const { data: newTemplate, error: insertError } = await supabase
        .from('templates')
        .insert({
          name,
          repo_branch,
          thumbnail_url: thumbnail_url || null,
          is_active: is_active !== undefined ? is_active : true
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Thêm quan hệ với packages nếu có
      if (package_ids && Array.isArray(package_ids) && package_ids.length > 0) {
        const insertData = package_ids.map((pkgId: number) => ({
          template_id: newTemplate.id,
          package_id: pkgId
        }))

        const { error: ptError } = await supabase.from('package_templates').insert(insertData)

        if (ptError) throw ptError
      }

      // Lấy template với packages
      const { data: packageTemplates, error: ptError } = await supabase
        .from('package_templates')
        .select('package_id, packages(id, name, price, original_price, duration_months, is_active)')
        .eq('template_id', newTemplate.id)

      if (ptError) throw ptError

      const packages = packageTemplates?.map((pt: any) => pt.packages).filter(Boolean) || []

      return res.status(201).json({
        success: true,
        data: {
          ...newTemplate,
          packages
        },
        message: 'Template created successfully'
      })
    } catch (error: any) {
      console.error('POST Template Error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
