import type { NextApiRequest, NextApiResponse } from 'next'
import { VNPay, ProductCode, VnpLocale, HashAlgorithm } from 'vnpay'
import { supabase } from '@/lib/initSupabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { planId, planName, amount, weddingId } = req.body

  if (!planId || !amount || !weddingId) {
    return res.status(400).json({ error: 'Missing planId, amount, or weddingId' })
  }

  try {
    // Generate unique order code
    const orderCode = `ORD-${Date.now()}`

    // 0. Resolve numeric package_id: planId is now the DB packages.id as string
    const numericPackageId = Number(planId)
    if (!numericPackageId || isNaN(numericPackageId)) {
      return res.status(400).json({ error: `planId không hợp lệ: "${planId}"` })
    }

    // Verify the package exists and get duration
    const { data: packageRow, error: packageError } = await supabase
      .from('packages')
      .select('id, duration_months')
      .eq('id', numericPackageId)
      .single()

    if (packageError || !packageRow) {
      console.error('Package lookup error:', packageError)
      return res.status(400).json({ error: `Không tìm thấy gói trong hệ thống` })
    }

    // Compute expires_at from duration_months
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + (packageRow.duration_months ?? 12))

    // 1. Create pending order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        wedding_id: weddingId,
        package_id: numericPackageId,
        amount: amount,
        payment_method: 'VNPAY',
        status: 'pending',
        expires_at: expiresAt.toISOString(),
        payment_info: { plan_id: planId, plan_name: planName }
      })
      .select()
      .single()

    if (orderError) {
      console.error('Create order error:', orderError)
      return res.status(500).json({ error: 'Không thể tạo đơn hàng' })
    }

    // 2. Build VNPay payment URL
    const vnpay = new VNPay({
      tmnCode: process.env.VNPAY_TMN_CODE || '',
      secureSecret: process.env.VNPAY_HASH_SECRET || '',
      vnpayHost: 'https://sandbox.vnpayment.vn',
      testMode: true,
      hashAlgorithm: HashAlgorithm.SHA512,
      enableLog: true
    })

    // Use order.id as txnRef so we can look it up on return
    const txnRef = order.id

    const returnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/api/vnpay-return'

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
      vnp_ReturnUrl: returnUrl,
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan goi ${planName || planId} - ${orderCode}`,
      vnp_OrderType: ProductCode.Other,
      vnp_Locale: VnpLocale.VN
    })

    return res.status(200).json({ paymentUrl, orderId: order.id })
  } catch (error: any) {
    console.error('VNPay create payment error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
