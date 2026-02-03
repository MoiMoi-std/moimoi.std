import { GetServerSideProps } from 'next'

interface WeddingPageProps {
  wedding: any
}

export default function WeddingPage({ wedding }: WeddingPageProps) {
  // 404 nếu không tìm thấy
  if (!wedding) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <h1>404 - Wedding not found</h1>
        <p>Không tìm thấy thiệp cưới với slug này.</p>
      </div>
    )
  }

  const { content, template } = wedding

  // Merge template default_content với wedding content
  const mergedContent = {
    ...(template?.default_content || {}),
    ...content
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>💍 Thiệp Cưới</h1>
      
      {/* Template Info */}
      {template && (
        <div style={{ 
          background: '#f0f9ff', 
          padding: '16px', 
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #bae6fd'
        }}>
          <h3 style={{ margin: '0 0 8px', color: '#0369a1' }}>
            🎨 Template: {template.name}
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
            Code: <code>{template.code}</code> | ID: {template.id}
          </p>
          {template.thumbnail_url && (
            <img 
              src={template.thumbnail_url} 
              alt={template.name}
              style={{ width: '100px', marginTop: '12px', borderRadius: '4px' }}
            />
          )}
        </div>
      )}

      {/* Package Info */}
      {wedding.package && (
        <div style={{ 
          background: '#fdf4ff', 
          padding: '16px', 
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #e879f9'
        }}>
          <h3 style={{ margin: '0 0 8px', color: '#a21caf' }}>
            📦 Package: {wedding.package.name}
          </h3>
          <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#64748b' }}>
            ID: {wedding.package.id} | Active: {wedding.package.is_active ? '✅' : '❌'}
          </p>
          {wedding.package.description && (
            <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#86198f' }}>
              {wedding.package.description}
            </p>
          )}
          {wedding.package.price && (
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#a21caf' }}>
              💰 Giá: {wedding.package.price.toLocaleString('vi-VN')} VND
            </p>
          )}
        </div>
      )}

      {/* Wedding Content */}
      <div style={{ marginTop: '24px' }}>
        <h2>Chú rể: {mergedContent.groom_name}</h2>
        <h2>Cô dâu: {mergedContent.bride_name}</h2>
        
        <p><strong>Ngày cưới:</strong> {mergedContent.event_date}</p>
        <p><strong>Giờ:</strong> {mergedContent.wedding_time}</p>
        <p><strong>Địa điểm:</strong> {mergedContent.address}</p>
        
        {/* Style từ Template */}
        <p><strong>Primary Color:</strong> 
          <span style={{ 
            display: 'inline-block',
            width: '20px', 
            height: '20px', 
            background: mergedContent.primary_color || '#ccc',
            marginLeft: '8px',
            borderRadius: '4px',
            verticalAlign: 'middle'
          }}></span>
          {mergedContent.primary_color}
        </p>
        <p><strong>Font Family:</strong> {mergedContent.font_family}</p>
        
        {mergedContent.cover_image && (
          <img 
            src={mergedContent.cover_image} 
            alt="Cover" 
            style={{ width: '100%', marginTop: '20px' }}
          />
        )}
      </div>

      <hr style={{ margin: '40px 0' }} />
      
      {/* Debug: Template Info */}
      <h3>🎨 TEMPLATE DATA:</h3>
      <pre style={{ background: '#fef3c7', padding: '20px', overflow: 'auto', borderRadius: '8px' }}>
        {JSON.stringify(template, null, 2)}
      </pre>

      {/* Debug: Package Info */}
      <h3>📦 PACKAGE DATA:</h3>
      <pre style={{ background: '#fdf4ff', padding: '20px', overflow: 'auto', borderRadius: '8px' }}>
        {JSON.stringify(wedding.package, null, 2)}
      </pre>

      {/* Debug: Wedding Info */}
      <h3>💍 WEDDING DATA:</h3>
      <pre style={{ background: '#f5f5f5', padding: '20px', overflow: 'auto', borderRadius: '8px' }}>
        {JSON.stringify(wedding, null, 2)}
      </pre>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string }

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  // Query 1: Lấy wedding data
  const { data: weddingData, error: weddingError } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .single()

  if (weddingError || !weddingData) {
    console.log('Wedding Error:', weddingError)
    return { props: { wedding: null } }
  }

  // Query 2: Lấy template data dựa trên template_id
  let templateData = null
  if (weddingData.template_id) {
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', weddingData.template_id)
      .single()

    if (!templateError && template) {
      templateData = template
    }
    console.log('Template Data:', templateData)
  }

  // Query 3: Lấy package data dựa trên package_id
  let packageData = null
  if (weddingData.package_id) {
    const { data: pkg, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', weddingData.package_id)
      .single()

    if (!packageError && pkg) {
      packageData = pkg
    }
    console.log('Package Data:', packageData)
  }

  return {
    props: {
      wedding: {
        ...weddingData,
        content: weddingData.content || {},
        template: templateData,
        package: packageData
      }
    }
  }
}
