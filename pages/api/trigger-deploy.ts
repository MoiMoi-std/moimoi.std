import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end()

    const { weddingId, templateBranch } = req.body
    const GITHUB_PAT = process.env.GITHUB_PAT // Token GitHub (Classic) có quyền 'repo'
    const REPO_OWNER = 'MoiMoi-std'
    const REPO_NAME = 'moimoi.std'

    try {
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                    Authorization: `Bearer ${GITHUB_PAT}`,
                },
                body: JSON.stringify({
                    event_type: 'deploy_wedding_trigger',
                    client_payload: {
                        wedding_id: weddingId,
                        template_branch: templateBranch || 'theme-vintage',
                    },
                }),
            }
        )

        if (response.status === 204) {
            res.status(200).json({ message: 'Deployment triggered successfully' })
        } else {
            const errorText = await response.text()
            res.status(500).json({ error: errorText })
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}