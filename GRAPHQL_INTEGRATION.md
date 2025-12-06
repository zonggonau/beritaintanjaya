# 🔌 Integrasi WordPress GraphQL

Sistem ini sekarang terhubung langsung dengan website `intanjayakab.go.id` menggunakan **WPGraphQL API**.

## 📌 Endpoint
URL Endpoint: `https://intanjayakab.go.id/graphql`

## 🛠️ Cara Mengambil Data

Semua fungsi pengambilan data ada di file `app/lib/wordpress-graphql.ts`.

### 1. Mengambil Post Terbaru
```typescript
import { fetchLatestPosts } from '@/app/lib/wordpress-graphql';

// Di dalam server component
const posts = await fetchLatestPosts(10);
```

### 2. Mengambil Post Berdasarkan Kategori
```typescript
import { fetchPostsByCategory } from '@/app/lib/wordpress-graphql';

const posts = await fetchPostsByCategory('pemerintahan', 5);
```

### 3. Mengambil Detail Post (Single)
```typescript
import { fetchPostBySlug } from '@/app/lib/wordpress-graphql';

const post = await fetchPostBySlug('judul-berita-anda');
```

## 🏗️ Struktur Data (Transformation)

Data mentah dari GraphQL otomatis diubah (transformed) menjadi format yang bersih agar mudah dipakai di frontend.

**Raw WPGraphQL Post:**
```json
{
  "title": "Judul",
  "featuredImage": { "node": { "sourceUrl": "..." } },
  "categories": { "nodes": [{ "name": "Pemerintahan" }] }
}
```

⬇️ **Diubah Menjadi:**

**NewsArticle Type:**
```typescript
{
  id: "123",
  title: "Judul",
  image: "...",
  category: "Pemerintahan",
  date: "12 Januari 2025"
}
```

## ⚠️ Troubleshooting

1. **Gambar Tidak Muncul?**
   - Pastikan domain gambar (`intanjayakab.go.id`) diizinkan di `next.config.ts` jika menggunakan komponen `<Image />` Next.js.
   - Saat ini kita menggunakan tag `<img>` biasa untuk fleksibilitas maksimal, jadi seharusnya aman.

2. **Data Kosong?**
   - Pastikan endpoint GraphQL publik di WordPress target aktif dan plugin **WPGraphQL** sudah terinstall di website `intanjayakab.go.id`.
   - Cek slug kategori harus sama persis (misal: `pemerintahan`, `ekonomi`).

3. **CORS Error?**
   - Karena kita menggunakan Server Components (render di server), masalah CORS di browser tidak akan terjadi.

---

**Dikembangkan untuk Halaman Berita Kabupaten Intan Jaya**
