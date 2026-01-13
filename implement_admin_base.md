Dưới đây là bản mô tả kỹ thuật chi tiết (Technical Specs) chia theo role **Backend** và **Frontend** để bạn giao việc (assign task) ngay lập tức.

---

### PHẦN 1: BACKEND (SUPABASE + EDGE FUNCTIONS)

**Nhiệm vụ chính:** Quản lý dữ liệu, xác thực người dùng, xử lý logic export Excel và kích hoạt quá trình build.

#### 1. Database Schema (PostgreSQL)

Lược bỏ các trường liên quan đến Google Sheet Sync realtime.

- **`profiles`**: (Giữ nguyên) Mở rộng thông tin user.
- **`templates`**:
- `id`, `name`, `thumbnail_url`.
- `repo_branch`: (Quan trọng) Tên nhánh chứa code mẫu (VD: `theme-vintage`).

- **`weddings`**:
- `id`, `host_id`, `template_id`.
- `content`: JSONB (Chứa toàn bộ thông tin: tên CR-CD, ngày, địa chỉ, bank info, link ảnh...). _Lưu JSON cho linh hoạt thay vì chia quá nhiều cột._
- `slug`: (VD: `tuan-hien`).
- `deployment_status`: (`draft`, `building`, `published`, `failed`).

- **`rsvps`**:
- `id`, `wedding_id`.
- `guest_name`: (Tên khách).
- `phone`, `wishes`, `is_attending`, `party_size`.
- `created_at`.

#### 2. API / Edge Functions cần viết

**A. API Nhóm Core (CRUD):**

- `GET /rest/v1/weddings`: Lấy thông tin đám cưới của user đang login.
- `POST /rest/v1/rsvps`: (Public) Cho khách mời submit form xác nhận. Cần bật RLS để cho phép Insert công khai nhưng không được Select.

**B. API `deploy-wedding` (Edge Function):**

- **Input:** `wedding_id`.
- **Logic:**

1. Check quyền sở hữu của User.
2. Query bảng `weddings` lấy `template_id` -> Join bảng `templates` lấy `repo_branch`.
3. Gọi GitHub API (Repository Dispatch).
4. **Payload gửi đi:** `{ "ref": "main", "inputs": { "wedding_id": "...", "branch_build": "theme-vintage" } }`.

**C. API `export-rsvps` (Edge Function) - _Thay thế Google Sheet Sync_:**

- **Input:** `wedding_id`.
- **Logic:**

1. Query bảng `rsvps` theo `wedding_id`.
2. Sử dụng thư viện (như `xlsx` hoặc `exceljs` trong Node.js/Deno).
3. Biến đổi JSON thành file Buffer `.xlsx`.
4. Set Header response: `Content-Type: application/vnd.openxmlformats...`.
5. Trả về file binary để trình duyệt tự tải xuống.

---

### PHẦN 2: FRONTEND (NEXT.JS - ADMIN DASHBOARD)

**Nhiệm vụ chính:** Xây dựng trang quản trị (Admin Portal) cho Host nhập liệu và quản lý khách.

#### 1. Cấu trúc 4 Màn hình Admin (Theo yêu cầu)

**Màn 1: Dashboard (Tổng quan)**

- Hiển thị trạng thái: "Đang nháp" hoặc "Đã xuất bản".
- Nếu đã xuất bản: Hiện Link thiệp (có nút Copy).
- Thống kê đơn giản: Tổng số khách đã mời / Số khách đã RSVP "Có".

**Màn 2: Editor (Nhập liệu)**

- Form nhập liệu chia thành các Step hoặc Tab:
- **Tab Info:** Tên, Ngày, Giờ.
- **Tab Album:** Upload ảnh lên Cloudinary -> Nhận về URL -> Lưu vào mảng trong JSON `content`.
- **Tab Bank:** Nhập STK -> Gọi API VietQR để check tên chủ TK (nếu được) hoặc chỉ lưu text đơn thuần.

- **Nút Save:** Gọi API `UPDATE weddings`.

**Màn 3: Guest Manager (Quản lý khách)**

- **Tool tạo link:** Input nhập tên khách -> Gen link `domain.com/slug?g=TenKhach` -> Nút Copy / Share Zalo.
- **Table RSVP:** Load dữ liệu từ bảng `rsvps`.
- **Nút "Xuất Excel":** Gọi API `export-rsvps` ở trên -> Tải file về máy.

**Màn 4: Settings (Cấu hình & Deploy)**

- Chọn/Đổi Template (Dropdown hiện danh sách template kèm ảnh thumb).
- **Nút "Phát hành" (Publish):**
- Hiển thị Loading spinner (vì build mất 1-2 phút).
- Gọi API `deploy-wedding`.
- Lắng nghe trạng thái (Polling hoặc Realtime Subscription) để báo khi nào xong.

---

### PHẦN 3: FRONTEND (TEMPLATES - CÁC NHÁNH THEME)

**Nhiệm vụ:** Chuẩn bị sẵn các mẫu giao diện để hệ thống build.

1. **Cấu trúc Git:**

- Branch `theme-vintage`: Code giao diện Next.js phong cách cổ điển.
- Branch `theme-modern`: Code giao diện phong cách hiện đại.

2. **Cách lấy dữ liệu (File `pages/index.tsx` trong mỗi theme):**

- Dùng `getStaticProps`.
- Lấy `WEDDING_ID` từ biến môi trường (Environment Variable).
- Fetch data từ Supabase: `supabase.from('weddings').select('*').eq('id', process.env.WEDDING_ID)`.
- Inject data vào component.

3. **Xử lý tên khách (`?g=...`):**

- Dùng `useEffect` và `useRouter` để lấy query param `g`.
- Replace text trong DOM sau khi trang đã load (Client-side).

---

### TỔNG KẾT QUY TRÌNH (FLOW)

1. **Setup:** Admin tạo sẵn các branch `theme-x`, `theme-y`.
2. **Host nhập liệu:** Vào Admin Dashboard điền thông tin -> Lưu vào DB.
3. **Deploy:** Host bấm Publish -> Backend trigger GitHub -> GitHub checkout đúng branch `theme-x` -> Build ra HTML tĩnh -> Đẩy lên Hosting.
4. **Mời:** Host tạo link `web-cua-toi.com/?g=Ban+Nam` gửi cho Nam.
5. **RSVP:** Nam mở link -> Web hiện "Mời Bạn Nam" -> Nam điền form "Đi 1 mình" -> Data lưu vào bảng `rsvps`.
6. **Báo cáo:** Host vào Admin Dashboard -> Bấm "Xuất Excel" -> Tải về danh sách khách để kiểm soát.

Đây là bản kế hoạch đầy đủ và tối ưu nhất cho giai đoạn MVP. Bạn có thể copy nội dung này gửi vào nhóm chat của team Dev để chốt việc ngay!
