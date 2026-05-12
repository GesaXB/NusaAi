# NusaAI Deployment Guide (Vercel)

Ikuti langkah-langkah di bawah ini untuk men-deploy NusaAI ke Vercel dengan sukses.

## 1. Persiapan Environment Variables
Kamu harus menambahkan variabel-variabel berikut di **Vercel Project Settings > Environment Variables**:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase kamu.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon key project Supabase kamu.
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (jangan bocorkan ke publik!).

### AI & Database
- `OPENAI_API_KEY`: API Key dari OpenAI (atau provider yang kamu gunakan di AI SDK).
- `DATABASE_URL`: Connection string database Supabase kamu (untuk Prisma).
- `DIRECT_URL`: Connection string database direct (untuk migrasi Prisma).

### Auth Redirects
- Pastikan di **Supabase Dashboard > Authentication > URL Configuration**, kamu menambahkan domain Vercel kamu ke **Redirect URLs**.
- Contoh: `https://nusa-ai.vercel.app/api/auth/callback`

## 2. Struktur Build
Saya sudah menambahkan script otomatis di `package.json`:
- `postinstall`: Otomatis menjalankan `prisma generate` setiap kali Vercel melakukan build. Ini penting agar Prisma client sinkron dengan database kamu.

## 3. Cara Deploy
1. Push kode kamu ke GitHub/GitLab/Bitbucket.
2. Import repository di Vercel.
3. Masukkan Environment Variables yang disebutkan di atas.
4. Klik **Deploy**.

## 4. Troubleshooting
Jika build gagal di tahap Prisma:
- Pastikan `DATABASE_URL` sudah benar dan database dalam keadaan aktif.
- Jika ada perubahan skema database, jalankan `npm run db:push` dari terminal lokal kamu terlebih dahulu sebelum men-deploy.

---
**NusaAI Team**
