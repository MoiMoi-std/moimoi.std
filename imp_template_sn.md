Dưới đây là bản mô tả chi tiết Chi tiết 2 template **Royal Palace (ThemeRoyal)** và **Boho Dreamcatcher (ThemeBoho)** để implement chính xác bằng Tailwind CSS:

---

### 1. Template: Royal Palace (ThemeRoyal)

Phong cách Hoàng gia, kiêu sa, lộng lẫy và mang đậm nét quyền quý. Style này cực kỳ phù hợp với các đám cưới tổ chức tại trung tâm hội nghị lớn, nhà hàng 5 sao.

**1. Bảng màu (Color Palette):**

- **Primary/Accent:** Vàng Gold (`#C9A84C` hoặc `bg-yellow-600`), biểu tượng của hoàng gia.
- **Background chính:** \* Thường là nền trắng sứ (`#FAFAFA`) kết hợp với các mảng tối cực sâu như Xanh Navy (`#1e3a8a` - Tím Hoàng gia) hoặc Đen tuyền (`#141414`).
- Có thể dùng gradient nhẹ: `bg-gradient-to-b from-white to-gray-50`.

- **Text:** Xám đậm (`#333333`) hoặc Đen than để dễ đọc; màu Vàng Gold cho các tiêu đề quan trọng.

**2. Typography (Hệ thống Font chữ):**

- **Tên Cô dâu & Chú rể (Heading Font):** `Cinzel, serif` hoặc `Playfair Display, serif`. Chữ in hoa toàn bộ (Uppercase), có thể thêm hiệu ứng bóng đổ chữ nhẹ.
- **Tiêu đề Section (Section Font):** `Cinzel, serif`. (Ví dụ: GIA ĐÌNH, SỰ KIỆN).
- **Nội dung (Body Font):** `Cormorant Garamond, serif` – tạo cảm giác thiệp mời trang trọng, cổ điển.

**3. Layout & Hiệu ứng (UI/UX):**

- **Border & Khung viền:** Dùng viền đôi (`border-double`) màu Vàng Gold, hoặc các viền mỏng (`border-[1px] border-[#C9A84C]`). Các góc bo ít hoặc dùng họa tiết góc hoàng gia (ornament corners) bằng SVG.
- **Hình khối:** Ưu tiên sử dụng các khung hình vòm (Arch / Cổng vòm) cho ảnh cưới của cô dâu chú rể (`rounded-t-full`).
- **Wedding Calendar:** Nên sử dụng thuộc tính `variant='dark'` kết hợp nền Xanh Navy và điểm nhấn là `primaryColor='#C9A84C'`.
- **Hiệu ứng:** Dùng hiệu ứng lấp lánh (shimmering) trên tên cô dâu chú rể hoặc hiệu ứng ánh kim ở thẻ quà mừng (MoneyGift).

**Gợi ý HTML/Tailwind Code (Hero Section):**

```html
<div class="relative bg-[#1e3a8a] text-white min-h-screen p-8 border-[8px] border-double border-[#C9A84C]">
  <div class="flex flex-col items-center justify-center h-full text-center">
    <div class="w-16 h-16 mb-4 text-[#C9A84C]"></div>
    <span class="font-serif tracking-[0.2em] text-sm text-[#C9A84C] uppercase mb-4">Lễ Thành Hôn</span>
    <h1 class="font-serif text-5xl md:text-7xl text-[#C9A84C] uppercase tracking-wider mb-6 drop-shadow-lg">
      Minh Nhật <br /><span class="text-3xl">&</span><br />
      Thanh Hằng
    </h1>
    <div class="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mb-6"></div>
    <p class="font-serif text-lg tracking-widest">20 . 12 . 2026</p>
  </div>
</div>
```

---

### 2. Template: Boho Dreamcatcher (ThemeBoho)

Phong cách Bohemian (Boho) mộc mạc, tự do, lãng mạn và gần gũi với thiên nhiên. Phù hợp cho đám cưới ngoài trời, bãi biển hoặc concept mộc.

**1. Bảng màu (Color Palette):**

- **Primary/Accent:** Nâu đất (`#8B4513`), Cam đào (`#e07b5a`), hoặc Hồng đất (`#c07a85`). Đây là các dải màu ấm.
- **Background chính:** Các màu tone trung tính, pastel ấm như Beige, Trắng ngà (`#FDFBF7` hoặc `bg-[#fefae0]`), hoặc kết hợp pattern giấy nhám (paper texture).
- **Text:** Nâu socola (`#4a2c2a`) hoặc Xám rêu thay vì màu đen tuyền.

**2. Typography (Hệ thống Font chữ):**

- **Tên Cô dâu & Chú rể (Heading Font):** `Great Vibes, cursive` hoặc `Dancing Script, cursive`. Chữ viết tay bay bổng, uốn lượn tự do, tạo cảm giác thân mật.
- **Tiêu đề Section (Section Font):** `Lora, serif` hoặc `Raleway, sans-serif` in hoa.
- **Nội dung (Body Font):** `Lora, serif` hoặc `Outfit, sans-serif` – mềm mại, dễ đọc.

**3. Layout & Hiệu ứng (UI/UX):**

- **Họa tiết (Assets):** Sử dụng hình ảnh PNG/SVG hoa cỏ khô (pampas grass), lá cọ (palm leaves), lông vũ (feathers), ruy băng ren, hoặc vòng dreamcatcher đặt ở các góc hoặc đằng sau tên.
- **Border:** Các đường viền không khép kín, nét đứt mờ (`border-dashed` hoặc `border-dotted` với màu nâu nhạt `border-orange-200/50`).
- **Hình khối:** Dùng các khối hình bất đối xứng (blob shapes) làm nền (giống hiệu ứng trong `Hero.tsx`) hoặc các khung hình viền răng cưa nhẹ.
- **Hiệu ứng:** Splash screen có thể áp dụng hiệu ứng cánh hoa rơi (floating petals) tông màu nâu ấm/cam đào.

**Gợi ý HTML/Tailwind Code (Hero Section):**

```html
<div class="relative bg-[#FDFBF7] text-[#4a2c2a] min-h-screen overflow-hidden p-6">
  <div
    class="absolute top-0 right-0 w-48 h-48 bg-[url('/path/to/pampas-grass.png')] bg-contain bg-no-repeat opacity-60"
  ></div>

  <div
    class="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center border border-dashed border-[#e07b5a] rounded-[2rem] p-8 bg-white/40 backdrop-blur-sm"
  >
    <span class="font-sans text-xs tracking-widest uppercase text-[#e07b5a] mb-6">Save the Date</span>
    <h1 class="font-script text-6xl md:text-8xl text-[#8B4513] leading-tight mb-8">
      Minh Nhật <br /><span class="text-[#e07b5a]">&</span><br />
      Thanh Hằng
    </h1>
    <p class="font-serif italic text-lg text-gray-600 mb-6">Sự hiện diện của bạn là niềm vinh hạnh cho chúng tôi</p>
    <div
      class="px-6 py-2 bg-[#e07b5a] text-white rounded-full font-sans tracking-widest text-sm shadow-md shadow-orange-900/20"
    >
      THÁNG 12 / 20 / 2026
    </div>
  </div>
</div>
```

**Lưu ý cho Agent khi implement:**
Hãy sử dụng `TemplateViewportContext` để scale responsive cho cả Laptop và Mobile như thiết lập sẵn trong `LivePreview.tsx`. Với Boho, chú trọng khoảng trắng (whitespace) và các thẻ (cards) không nên quá góc cạnh (dùng `rounded-2xl` hoặc `rounded-3xl` thay vì vuông vức). Ngược lại với Royal, ưu tiên form cứng cáp, góc cạnh sắt nét hoặc vòm cân xứng hoàn hảo.
