import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end()

    const { host_id } = req.body
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        return res.status(500).json({ error: 'Missing Supabase Service Key or URL' })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    try {
        const { data, error } = await supabase
            .from('weddings')
            .insert({
                host_id,
                content: {},
                template_id: 1, // Default
                deployment_status: 'draft'
            })
            .select()
            .single()

        if (error) {
            console.error('Insert error details:', error)
            throw error
        }

        res.status(200).json(data)
    } catch (err: any) {
        console.error('Create handler error:', err)
        res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
}
