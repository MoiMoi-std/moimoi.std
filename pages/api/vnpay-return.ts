import type { NextApiRequest, NextApiResponse } from 'next'
import { VNPay, HashAlgorithm } from 'vnpay'
import { supabase } from '@/lib/initSupabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const vnpay = new VNPay({
      tmnCode: process.env.VNPAY_TMN_CODE || '',
      secureSecret: process.env.VNPAY_HASH_SECRET || '',
      vnpayHost: 'https://sandbox.vnpayment.vn',
      testMode: true,
      hashAlgorithm: HashAlgorithm.SHA512,
      enableLog: true
    })

    const verify = vnpay.verifyReturnUrl(req.query as any)

    const orderId = req.query.vnp_TxnRef as string
    const responseCode = req.query.vnp_ResponseCode as string
    const transactionNo = req.query.vnp_TransactionNo as string
    const vnpAmount = req.query.vnp_Amount as string

    if (verify.isVerified && verify.isSuccess) {
      // 1. Fetch the order to get wedding_id and plan info
      const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single()

      if (order) {
        const paymentInfo = (order.payment_info as any) || {}
        const planId = paymentInfo.plan_id || ''
        const planName = paymentInfo.plan_name || ''

        // Get wedding to extract host_id for created_by
        let createdBy = null
        if (order.wedding_id) {
          const { data: wedding } = await supabase
            .from('weddings')
            .select('host_id')
            .eq('id', order.wedding_id)
            .single()
          createdBy = wedding?.host_id || null
        }

        // 2. Insert transaction record first
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .insert({
            transaction_code: transactionNo,
            customer: order.wedding_id,
            service: `Goi ${planName || planId}`,
            amount: order.amount,
            payment_gateway: 'VNPAY',
            status: 'success',
            transaction_date: new Date().toISOString().split('T')[0],
            created_by: createdBy
          })
          .select()
          .single()

        if (transactionError) {
          console.error('❌ Transaction insert error:', transactionError)
        } else {
          console.log('✅ Transaction inserted successfully:', transactionData)
        }

        // 3. Update order status to 'paid' and save transaction id
        await supabase
          .from('orders')
          .update({
            status: 'paid',
            transaction_id: transactionData?.id ? String(transactionData.id) : null,
            paid_at: new Date().toISOString(),
            payment_info: {
              ...paymentInfo,
              vnp_response_code: responseCode,
              vnp_transaction_no: transactionNo,
              vnp_amount: vnpAmount
            }
          })
          .eq('id', orderId)

        // 4. Update wedding plan
        if (order.wedding_id) {
          const { data: wedding } = await supabase
            .from('weddings')
            .select('content')
            .eq('id', order.wedding_id)
            .single()

          if (wedding) {
            const content = (wedding.content as any) || {}
            await supabase
              .from('weddings')
              .update({
                content: {
                  ...content,
                  plan: planId,
                  plan_activated_at: new Date().toISOString(),
                  expires_at: order.expires_at,
                  vnpay_txn_ref: orderId,
                  vnpay_transaction_no: transactionNo
                }
              })
              .eq('id', order.wedding_id)
          }
        }

        // Redirect to success page
        const params = new URLSearchParams({
          status: 'success',
          plan: planId,
          orderId: orderId,
          transactionNo: transactionNo || '',
          amount: vnpAmount || ''
        })
        return res.redirect(302, `/studio/payment-result?${params.toString()}`)
      }
    }

    // Payment failed or order not found
    const params = new URLSearchParams({
      status: 'failed',
      orderId: orderId || '',
      code: responseCode || 'unknown',
      message: verify.isVerified ? 'Giao dịch không thành công' : 'Xác thực chữ ký thất bại'
    })

    // Update order status to failed
    if (orderId) {
      await supabase.from('orders').update({ status: 'failed' }).eq('id', orderId)
    }

    return res.redirect(302, `/studio/payment-result?${params.toString()}`)
  } catch (error: any) {
    console.error('VNPay return verification error:', error)
    return res.redirect(
      302,
      `/studio/payment-result?status=failed&message=${encodeURIComponent('Lỗi xác thực thanh toán')}`
    )
  }
}
