import type { NextApiRequest, NextApiResponse } from 'next'
import { packageService } from '../../../lib/package-service'

/**
 * GET    /api/packages/[id] - Lấy thông tin 1 package
 * PUT    /api/packages/[id] - Cập nhật package
 * DELETE /api/packages/[id] - Xóa package
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  // Validate ID
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Package ID is required'
    })
  }

  const packageId = parseInt(id, 10)

  if (isNaN(packageId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid package ID format'
    })
  }

  // // GET: Lấy thông tin 1 package
  // if (req.method === 'GET') {
  //   try {
  //     const packageData = await packageService.getPackageById(packageId)

  //     if (!packageData) {
  //       return res.status(404).json({
  //         success: false,
  //         error: 'Package not found'
  //       })
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       data: packageData
  //     })
  //   } catch (error: any) {
  //     console.error('GET Error:', error)
  //     return res.status(500).json({
  //       success: false,
  //       error: 'Internal server error',
  //       message: error.message
  //     })
  //   }
  // }

  // PUT/PATCH: Cập nhật package
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const packageData = req.body

      const updatedPackage = await packageService.updatePackage(packageId, packageData)

      return res.status(200).json({
        success: true,
        data: updatedPackage,
        message: 'Package updated successfully'
      })
    } catch (error: any) {
      console.error('UPDATE Error:', error)

      if (error.message?.includes('no rows')) {
        return res.status(404).json({
          success: false,
          error: 'Package not found'
        })
      }

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
