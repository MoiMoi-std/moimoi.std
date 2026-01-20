import { Database } from '../types/supabase'
import { supabase } from './initSupabase'

export type Package = Database['public']['Tables']['packages']['Row']
export type Template = Database['public']['Tables']['templates']['Row']

export interface PackageWithTemplates extends Package {
    templates: Template[]
}

export const packageService = {
    /**
     * GET: Lấy tất cả packages kèm templates
     */
    getAllPackages: async (): Promise<PackageWithTemplates[]> => {
        const { data: packages, error: pkgError } = await supabase
            .from('packages')
            .select('*')
            .order('price', { ascending: true })

        if (pkgError || !packages) {
            console.error('Error fetching packages:', pkgError)
            throw pkgError || new Error('No packages found')
        }

        // Fetch templates cho từng package
        const packagesWithTemplates = await Promise.all(
            packages.map(async (pkg) => {
                const { data: ptData } = await supabase
                    .from('package_templates')
                    .select('template_id')
                    .eq('package_id', pkg.id)

                const templateIds = ptData?.map((pt) => pt.template_id) || []

                if (templateIds.length === 0) {
                    return { ...pkg, templates: [] }
                }

                const { data: templates } = await supabase
                    .from('templates')
                    .select('*')
                    .in('id', templateIds)

                return {
                    ...pkg,
                    templates: templates || []
                }
            })
        )

        return packagesWithTemplates
    },

    /**
     * POST: Tạo package mới
     */
    createPackage: async (packageData: Database['public']['Tables']['packages']['Insert']): Promise<Package> => {
        const { data, error } = await supabase
            .from('packages')
            .insert(packageData)
            .select()
            .single()

        if (error) {
            console.error('Error creating package:', error)
            throw error
        }

        return data
    },

    /**
   * PUT/PATCH: Cập nhật package
   */
    updatePackage: async (
        id: number,
        packageData: Database['public']['Tables']['packages']['Update']
    ): Promise<Package> => {
        // Check package tồn tại trước
        const { data: existing, error: checkError } = await supabase
            .from('packages')
            .select('id')
            .eq('id', id)
            .single()

        if (checkError || !existing) {
            throw new Error(`Package with ID ${id} not found`)
        }

        // Update package
        const { data, error } = await supabase
            .from('packages')
            .update(packageData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating package:', error)
            throw error
        }

        return data
    },

    /**
     * DELETE: Xóa package
     */
    deletePackage: async (id: number): Promise<void> => {
        const { error } = await supabase.from('packages').delete().eq('id', id)

        if (error) {
            console.error('Error deleting package:', error)
            throw error
        }
    }
}
