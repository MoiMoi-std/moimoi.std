import type { NextApiRequest, NextApiResponse } from 'next'
import { packageService } from '../../lib/package-service'

/**
 * GET  /api/packages - Lấy tất cả packages
 * POST /api/packages - Tạo package mới
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: Lấy tất cả packages
  if (req.method === 'GET') {
    try {
      const packages = await packageService.getAllPackages()

      return res.status(200).json({
        success: true,
        data: packages,
        count: packages.length
      })
    } catch (error: any) {
      console.error('GET Error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  // POST: Tạo package mới
  if (req.method === 'POST') {
    try {
      const packageData = req.body

      // Validate required fields
      if (!packageData.name || packageData.price === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, price'
        })
      }

      const newPackage = await packageService.createPackage(packageData)

      return res.status(201).json({
        success: true,
        data: newPackage,
        message: 'Package created successfully'
      })
    } catch (error: any) {
      console.error('POST Error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' })
}
