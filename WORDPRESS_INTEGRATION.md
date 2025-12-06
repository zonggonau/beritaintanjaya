# 🔌 WordPress Integration Guide

Panduan lengkap untuk mengintegrasikan website berita dengan WordPress REST API.

## 📋 Prerequisites

1. **WordPress Site** dengan REST API enabled (WordPress 4.7+)
2. **Kategori WordPress** yang sesuai dengan kategori di website:
   - Pemerintahan
   - Pembangunan
   - Pendidikan
   - Kesehatan
   - Sosial & Budaya
   - Ekonomi
   - Keamanan

## 🚀 Setup Steps

### 1. Configure Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_WP_API_URL=https://intanjayakab.go.id/wp-json/wp/v2
```

### 2. Update Homepage to Use WordPress Data

Edit `app/page.tsx`:

```typescript
import { fetchFeaturedPosts, fetchLatestPosts } from './lib/wordpress';

export default async function HomePage() {
  // Replace dummy data with WordPress data
  const featuredNews = await fetchFeaturedPosts(3);
  const latestNews = await fetchLatestPosts(12);
  
  return (
    // ... rest of component
  );
}
```

### 3. Update All News Page

Edit `app/all-news/page.tsx`:

```typescript
import { fetchPosts } from '../lib/wordpress';

export default async function AllNewsPage() {
  const { posts, total, totalPages } = await fetchPosts({
    page: 1,
    perPage: 12,
  });
  
  const newsData = posts.map(transformWPPostToArticle);
  
  return (
    // ... rest of component
  );
}
```

### 4. Update Category Pages

Edit `app/kategori/[slug]/page.tsx`:

```typescript
import { fetchPostsByCategory } from '../../lib/wordpress';

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  const { posts } = await fetchPostsByCategory(slug, {
    perPage: 12,
  });
  
  const categoryNews = posts.map(transformWPPostToArticle);
  
  return (
    // ... rest of component
  );
}
```

## 🎯 WordPress Category Mapping

Pastikan kategori di WordPress sesuai dengan slug berikut:

| Kategori | Slug WordPress |
|----------|----------------|
| Pemerintahan | `pemerintahan` |
| Pembangunan | `pembangunan` |
| Pendidikan | `pendidikan` |
| Kesehatan | `kesehatan` |
| Sosial & Budaya | `sosial-budaya` |
| Ekonomi | `ekonomi` |
| Keamanan | `keamanan` |

## 📝 WordPress Post Requirements

Setiap post di WordPress harus memiliki:

1. ✅ **Title** - Judul berita
2. ✅ **Content** - Isi berita lengkap
3. ✅ **Excerpt** - Ringkasan berita (auto-generated jika kosong)
4. ✅ **Featured Image** - Gambar utama berita
5. ✅ **Category** - Minimal 1 kategori
6. ✅ **Author** - Penulis berita
7. ✅ **Published Date** - Tanggal publikasi

## 🔧 API Functions Reference

### Fetch Posts
```typescript
const { posts, total, totalPages } = await fetchPosts({
  page: 1,           // Page number
  perPage: 10,       // Posts per page
  categories: '5',   // Category ID
  search: 'keyword'  // Search term
});
```

### Fetch Single Post
```typescript
const post = await fetchPostBySlug('post-slug');
```

### Fetch Categories
```typescript
const categories = await fetchCategories();
```

### Fetch Posts by Category
```typescript
const { posts } = await fetchPostsByCategory('pemerintahan', {
  page: 1,
  perPage: 10
});
```

### Search Posts
```typescript
const { posts, total } = await searchPosts('keyword', {
  page: 1,
  perPage: 10
});
```

## 🎨 Data Transformation

WordPress post akan otomatis di-transform ke format NewsArticle:

```typescript
{
  id: string;           // Post ID
  title: string;        // Post title
  excerpt: string;      // Post excerpt (cleaned HTML)
  category: string;     // Category name
  categorySlug: string; // Category slug
  image: string;        // Featured image URL
  date: string;         // Formatted date (Indonesian)
  author: string;       // Author name
  readTime: string;     // Calculated read time
  slug: string;         // Post slug
  content: string;      // Full content (HTML)
}
```

## ⚡ Performance Optimization

### Caching
Next.js automatically caches API responses:

```typescript
fetch(url, {
  next: { revalidate: 60 } // Revalidate every 60 seconds
});
```

### Static Generation
For better performance, use Static Site Generation (SSG):

```typescript
export async function generateStaticParams() {
  const { posts } = await fetchPosts({ perPage: 100 });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

## 🔒 Authentication (Optional)

Jika WordPress memerlukan authentication:

1. Install **Application Passwords** plugin
2. Generate application password di WordPress
3. Add credentials ke `.env.local`:

```env
WP_API_USERNAME=your-username
WP_API_PASSWORD=your-app-password
```

4. Update fetch calls dengan Basic Auth:

```typescript
const auth = Buffer.from(
  `${process.env.WP_API_USERNAME}:${process.env.WP_API_PASSWORD}`
).toString('base64');

fetch(url, {
  headers: {
    'Authorization': `Basic ${auth}`
  }
});
```

## 🐛 Troubleshooting

### CORS Issues
Tambahkan di `wp-config.php`:

```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
```

### REST API Disabled
Enable di WordPress admin:
- Settings → Permalinks → Save (to flush rewrite rules)
- Check if `/wp-json/` is accessible

### Missing Featured Images
Install plugin: **Default Featured Image**

### Slow API Response
- Enable WordPress caching (WP Super Cache, W3 Total Cache)
- Use CDN for images
- Optimize database

## 📊 Testing

Test WordPress API:

```bash
# Test basic endpoint
curl https://your-site.com/wp-json/wp/v2/posts

# Test with parameters
curl "https://your-site.com/wp-json/wp/v2/posts?per_page=5&_embed=true"

# Test categories
curl https://your-site.com/wp-json/wp/v2/categories
```

## ✅ Checklist

Before going live:

- [ ] WordPress REST API accessible
- [ ] All categories created with correct slugs
- [ ] Featured images set for all posts
- [ ] Environment variables configured
- [ ] API responses tested
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Cache strategy configured
- [ ] Performance optimized
- [ ] CORS configured (if needed)

## 📞 Support

Jika ada masalah dengan integrasi WordPress, hubungi tim development.

---

Happy coding! 🚀
