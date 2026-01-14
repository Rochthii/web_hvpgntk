Hướng dẫn deploy frontend lên Netlify (Tiếng Việt)

Tóm tắt: dự án frontend dùng Vite; backend đang dùng Supabase. Ta deploy build tĩnh lên Netlify và cấu hình biến môi trường để frontend kết nối Supabase.

1) Chuẩn bị local
- Cài Node.js (>=16).
- Trong thư mục `frontend`:

```bash
npm install
npm run build
```

2) Thiết lập biến môi trường trên Netlify
- Vào Netlify > Site settings > Build & deploy > Environment.
- Thêm các biến (ví dụ):
  - `VITE_SUPABASE_URL` = https://<project>.supabase.co
  - `VITE_SUPABASE_ANON_KEY` = <anon-key>
- Lưu ý: trong mã nguồn, chỉ dùng các biến bắt đầu `VITE_` để Vite nhúng vào build.

3) Cấu hình build trên Netlify
- Nếu kết nối GitHub/GitLab/Bitbucket: Netlify sẽ tự detect.
  - Build command: `npm run build`
  - Publish directory: `dist`
- Hoặc dùng Netlify CLI để deploy thủ công:

```bash
# đăng nhập
npx netlify login
# deploy lần đầu (preview):
npx netlify deploy --dir=dist
# deploy production:
npx netlify deploy --prod --dir=dist
```

4) SPA routing
- Đã thêm file `public/_redirects` với nội dung `/* /index.html 200` để mọi route trả về `index.html`.

5) Gọi API Supabase từ frontend
- Trong mã, đọc biến `import.meta.env.VITE_SUPABASE_URL` và `import.meta.env.VITE_SUPABASE_ANON_KEY`.
- Đảm bảo CORS và RLS (Row Level Security) trên Supabase được cấu hình đúng.

6) Nếu muốn proxy API từ cùng domain (không bắt buộc)
- Thường không cần với Supabase (có CORS). Nếu vẫn muốn, cấu hình proxy hoặc functions trên Netlify.

7) Kiểm tra sau deploy
- Vào trang site trên Netlify, xác nhận assets tải được và các route hoạt động.
- Mở Developer Console, kiểm tra request tới Supabase và biến môi trường đã được áp dụng.

Nếu bạn muốn, tôi có thể:
- A) Commit file `public/_redirects` và `NETLIFY_DEPLOY.md` (đã tạo) lên repo.
- B) Giúp chạy `npm run build` và deploy ngay bằng Netlify CLI (cần bạn đăng nhập Netlify trên máy này).

Chọn A hoặc B hoặc hỏi tiếp nếu cần chỉnh thêm.