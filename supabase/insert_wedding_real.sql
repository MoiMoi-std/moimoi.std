-- ========================================
-- INSERT WEDDING VỚI FAKE DATA ĐẦY ĐỦ
-- ========================================
-- UUID được cung cấp: 7350056a-e78b-40af-bc1d-d22463d2f1b0

INSERT INTO weddings (
  id,
  host_id,
  template_id,
  slug,
  content,
  deployment_status,
  created_at
)
VALUES (
  uuid_generate_v4(), -- Tự động tạo UUID mới cho wedding
  
  '7350056a-e78b-40af-bc1d-d22463d2f1b0', -- ✅ Host ID (User ID)
  
  3, -- Template: Vintage Classic
  
  'tiec-cuoi-nam-linh-2026', -- ✅ SLUG để truy cập: http://localhost:3000/tiec-cuoi-nam-linh-2026
  
  '{
    "groom_name": "Trần Văn Nam",
    "bride_name": "Nguyễn Thị Linh",
    "event_date": "2026-03-15",
    "wedding_time": "18:00",
    "address": "Nhà hàng Tiệc Cưới Riverside, 123 Nguyễn Huệ, Quận 1, TP.HCM",
    "map_url": "https://maps.google.com/?q=10.762622,106.660172",
    "cover_image": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920",
    "album": [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800"
    ],
    "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "bank_name": "Vietcombank",
    "account_number": "1234567890",
    "account_name": "TRAN VAN NAM",
    "message_from_couple": "Chúng tôi rất hân hạnh được đón tiếp quý khách trong ngày trọng đại của chúng tôi. Sự hiện diện của bạn là niềm vinh hạnh lớn lao đối với gia đình chúng tôi!",
    "groom_parents": "Ông Trần Văn A & Bà Nguyễn Thị B",
    "bride_parents": "Ông Nguyễn Văn C & Bà Lê Thị D"
  }'::jsonb,
  
  'PUBLISHED', -- ✅ Cho phép truy cập công khai
  
  NOW()
);


-- ========================================
-- VÍ DỤ 2: WEDDING VỚI STYLE HIỆN ĐẠI
-- ========================================
/*
INSERT INTO weddings (id, host_id, template_id, slug, content, deployment_status)
VALUES (
  uuid_generate_v4(),
  '7350056a-e78b-40af-bc1d-d22463d2f1b0',
  4, -- Template: Modern Minimalist
  'wedding-minh-hoa',
  '{
    "groom_name": "Lê Hoàng Minh",
    "bride_name": "Phạm Thu Hoa",
    "event_date": "2026-05-20",
    "wedding_time": "17:30",
    "address": "White Palace, 240 Phạm Văn Đồng, Thủ Đức, TP.HCM",
    "map_url": "https://maps.google.com/?q=10.851338,106.772474",
    "cover_image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920",
    "album": [
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800"
    ],
    "video_url": "",
    "bank_name": "Techcombank",
    "account_number": "9876543210",
    "account_name": "LE HOANG MINH"
  }'::jsonb,
  'PUBLISHED'
);
*/


-- ========================================
-- SAU KHI INSERT, KIỂM TRA KẾT QUẢ
-- ========================================
-- SELECT * FROM weddings WHERE host_id = '7350056a-e78b-40af-bc1d-d22463d2f1b0' ORDER BY created_at DESC;

-- Hoặc xem theo slug:
-- SELECT * FROM weddings WHERE slug = 'tiec-cuoi-nam-linh-2026';
