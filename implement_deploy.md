Chào bạn, tôi đã xem qua codebase hiện tại. Bạn đã có khung sườn Admin (Next.js) và kết nối Supabase tốt.

Để hiện thực hóa quy trình **"One-Click Deploy"** cho MVP (Host bấm nút -> GitHub chạy -> Có web riêng), chúng ta cần thực hiện **3 bước cốt lõi** sau. Hãy làm theo đúng trình tự này:

---

### BƯỚC 1: TẠO "TEMPLATE BRANCH" (Source code cho thiệp)

Hiện tại nhánh `main` của bạn đang chứa code Admin/Landing Page. Chúng ta cần tạo một nhánh riêng chỉ chứa code giao diện thiệp cưới.

**Cách làm:**

1. Từ terminal, tạo nhánh mới: `git checkout -b theme-vintage`
2. **Dọn dẹp:** Trong nhánh này, hãy xóa hết các folder `components/admin`, `pages/admin`... chỉ giữ lại những gì cần thiết để hiển thị thiệp.
3. **Quan trọng:** Sửa file `pages/index.tsx` trong nhánh này. Đây là nơi phép màu xảy ra. Thay vì code tĩnh, nó sẽ lấy ID từ biến môi trường lúc Build để fetch data.

**Code mẫu cho `pages/index.tsx` (Branch `theme-vintage`):**

```tsx
// pages/index.tsx trên nhánh theme-vintage
import { GetStaticProps } from 'next'
import { createClient } from '@/utils/supabase/client'
import { Wedding } from '@/types/supabase' // Đảm bảo bạn đã export type này

interface Props {
  wedding: Wedding['Row'] | null
}

export default function WeddingTemplate({ wedding }: Props) {
  if (!wedding) return <div className='text-center p-10'>Đang tải thông tin đám cưới...</div>

  const content = wedding.content as any // Cast sang any hoặc type cụ thể của bạn

  return (
    <div className='min-h-screen bg-rose-50 font-serif'>
      {/* Hero Section */}
      <header className='h-screen flex flex-col items-center justify-center text-center p-4'>
        <h1 className='text-5xl text-rose-800 mb-4'>
          {content.groom_name} & {content.bride_name}
        </h1>
        <p className='text-xl text-gray-600'>Trân trọng kính mời</p>
        <div className='mt-8'>
          {/* Logic hiển thị tên khách từ URL sẽ nằm ở đây (Client-side) */}
          <p className='text-2xl font-bold' id='guest-name'>
            Bạn và Người thương
          </p>
        </div>
      </header>

      {/* Các phần khác: Album, Time, Location... */}
      <section className='p-10 text-center'>
        <img src={content.images?.[0]} className='w-full max-w-2xl mx-auto rounded shadow' />
        <p className='mt-4'>{content.wishes}</p>
      </section>
    </div>
  )
}

// Hàm này chạy trên Server của GitHub Actions khi Build
export const getStaticProps: GetStaticProps = async () => {
  // Lấy Wedding ID từ biến môi trường (được bơm vào từ GitHub Action)
  const weddingId = process.env.NEXT_PUBLIC_WEDDING_ID

  if (!weddingId) {
    return { notFound: true }
  }

  const supabase = createClient()
  const { data: wedding } = await supabase.from('weddings').select('*').eq('id', weddingId).single()

  return {
    props: {
      wedding
    }
    // Không dùng revalidate vì đây là Static Site hoàn toàn
  }
}
```

---

### BƯỚC 2: SETUP GITHUB ACTIONS (Cỗ máy Build)

Bạn cần tạo file Workflow để nghe lệnh từ Admin.

1. Về lại nhánh `main`.
2. Tạo file: `.github/workflows/deploy-wedding.yml`
3. Nội dung file này sẽ nhận tín hiệu `repository_dispatch`, lấy code từ nhánh `theme-vintage`, build và đẩy lên Vercel.

```yaml
name: Deploy Wedding Site

on:
  repository_dispatch:
    types: [deploy_wedding_trigger] # Tên sự kiện chúng ta tự đặt

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Template Code
        uses: actions/checkout@v3
        with:
          ref: ${{ github.event.client_payload.template_branch }} # Lấy nhánh theme tương ứng

      - name: Install Dependencies
        run: npm install

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          # Bơm ID đám cưới vào quá trình Build
          NEXT_PUBLIC_WEDDING_ID: ${{ github.event.client_payload.wedding_id }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Deploy Project Artifacts to Vercel
        # Deploy lệnh này sẽ tạo ra 1 URL riêng
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }} > deployment-url.txt
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Print URL
        run: cat deployment-url.txt
```

**Cấu hình Secret trong GitHub Repo (Settings -> Secrets and variables -> Actions):**

- `VERCEL_TOKEN`: Tạo trong Account Settings của Vercel.
- `VERCEL_ORG_ID` & `VERCEL_PROJECT_ID`: Lấy trong file `.vercel/project.json` (bạn cần chạy `vercel link` ở local để thấy file này).
- `NEXT_PUBLIC_SUPABASE_URL`: URL Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Key Anon.

---

### BƯỚC 3: KẾT NỐI ADMIN VỚI GITHUB (Nút bấm thần thánh)

Quay lại file `lib/data-service.ts` trong nhánh `main` (codebase admin). Bạn cần sửa hàm `deployWedding` để nó gọi API của GitHub.

**Lưu ý:** Vì gọi GitHub API cần Token nhạy cảm, **KHÔNG ĐƯỢC** gọi trực tiếp từ Client (React). Bạn phải tạo một Next.js API Route.

**3.1. Tạo API Route: `pages/api/trigger-deploy.ts**`

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { weddingId, templateBranch } = req.body
  const GITHUB_PAT = process.env.GITHUB_PAT // Token GitHub (Classic) có quyền 'repo'
  const REPO_OWNER = 'tên-github-của-bạn'
  const REPO_NAME = 'moimoi-project'

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${GITHUB_PAT}`
      },
      body: JSON.stringify({
        event_type: 'deploy_wedding_trigger',
        client_payload: {
          wedding_id: weddingId,
          template_branch: templateBranch || 'theme-vintage'
        }
      })
    })

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
```

**3.2. Update `lib/data-service.ts**`

```ts
// ... imports

deployWedding: async (weddingId: string, templateBranch: string = 'theme-vintage'): Promise<{ success: boolean; status: string }> => {
    try {
        const response = await fetch('/api/trigger-deploy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ weddingId, templateBranch }),
        });

        if (response.ok) {
            return { success: true, status: 'building' };
        } else {
            console.error('Deploy failed');
            return { success: false, status: 'failed' };
        }
    } catch (e) {
        return { success: false, status: 'failed' };
    }
},

```

---

### TÓM TẮT VIỆC BẠN CẦN LÀM NGAY:

1. **Git:** Tạo branch `theme-vintage`, sửa `pages/index.tsx` theo mẫu trên. Push lên GitHub.
2. **Secret:** Vào GitHub Repo Settings, thêm `VERCEL_TOKEN`, `GITHUB_PAT` (Token cá nhân của bạn), và các key Supabase.
3. **Code Admin:** Thêm file `pages/api/trigger-deploy.ts` và sửa `data-service.ts`.
4. **Test:** Chạy Admin, vào trang Settings, bấm "Publish".
5. **Check:** Qua tab "Actions" trên GitHub xem nó có chạy không (hiện xanh lá cây là thành công).

Làm xong bước này bạn sẽ có MVP hoàn chỉnh: Admin bấm 1 cái -> GitHub tự chạy -> Ra website riêng. Triển khai đi, vướng chỗ nào tôi gỡ tiếp!
