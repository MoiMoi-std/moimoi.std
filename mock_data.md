-- 1. Xóa dữ liệu cũ (nếu muốn làm sạch lại từ đầu, cẩn thận khi chạy trên production)
truncate table rsvps cascade;
truncate table weddings cascade;
truncate table templates cascade;

-- 2. Insert Templates (Các mẫu giao diện)
insert into templates (name, repo_branch, thumbnail_url) values
('Vintage Classic', 'theme-vintage', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600'),
('Modern Minimalist', 'theme-modern', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600'),
('Luxury Gold', 'theme-luxury', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600');

-- 3. Insert Weddings (Đám cưới giả lập)
-- LƯU Ý: Thay 'THAY_USER_UID_CUA_BAN_VAO_DAY' bằng UID thật của bạn
insert into weddings (host_id, template_id, slug, deployment_status, content) 
values
(
    'b34c46c8-a9ef-4932-96c2-42a476d0a88b', 
    (select id from templates where repo_branch = 'theme-vintage' limit 1),
    'tuan-hien-wedding',
    'published',
    '{
        "groom": { "name": "Minh Tuấn", "father": "Ông Tuấn Tú", "mother": "Bà Kim Chi" },
        "bride": { "name": "Thu Hiền", "father": "Ông Văn Nam", "mother": "Bà Thị Hạnh" },
        "event": { 
            "date": "2024-12-25", 
            "time": "17:30", 
            "location": "White Palace, Phạm Văn Đồng", 
            "map_url": "https://goo.gl/maps/..." 
        },
        "bank": { "bank_name": "Vietcombank", "number": "99998888", "owner": "NGUYEN MINH TUAN" },
        "album": [
            "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600",
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600"
        ]
    }'::jsonb
),
(
    '2c3fff07-3cbd-4010-ba40-be7d3ce966dd', 
    (select id from templates where repo_branch = 'theme-modern' limit 1),
    'hung-lan-wedding',
    'draft',
    '{
        "groom": { "name": "Quốc Hưng" },
        "bride": { "name": "Ngọc Lan" },
        "event": { "date": "2025-01-01", "location": "Chưa chốt" }
    }'::jsonb
);

-- 4. Insert RSVPs (Khách mời giả lập cho đám cưới Tuấn & Hiền)
with wedding_row as (
    select id from weddings where slug = 'tuan-hien-wedding' limit 1
)
insert into rsvps (wedding_id, guest_name, phone, wishes, is_attending, party_size) values
((select id from wedding_row), 'Nguyễn Văn A', '0909123456', 'Chúc mừng hai bạn!', true, 1),
((select id from wedding_row), 'Trần Thị B', '0909123457', 'Trăm năm hạnh phúc nhé', true, 2),
((select id from wedding_row), 'Lê Văn C', '0909123458', 'Xin lỗi mình bận đi công tác', false, 0),
((select id from wedding_row), 'Phạm Thị D', '0909123459', 'Sẽ cố gắng thu xếp', null, 1),
((select id from wedding_row), 'Hội bạn thân Cấp 3', '0912000001', 'Quẩy lên!', true, 4),
((select id from wedding_row), 'Cô Sáu (Hải Phòng)', '0912000002', 'Chúc cháu hạnh phúc', true, 2),
((select id from wedding_row), 'Anh Tuấn (Công ty)', '0912000003', '', true, 1),
((select id from wedding_row), 'Bé Mập', null, 'Hihi', true, 1);

-- Insert vài khách cho đám cưới đang Draft (Hung & Lan)
with wedding_row_2 as (
    select id from weddings where slug = 'hung-lan-wedding' limit 1
)
insert into rsvps (wedding_id, guest_name, is_attending) values
((select id from wedding_row_2), 'Test Guest 1', true),
((select id from wedding_row_2), 'Test Guest 2', false);