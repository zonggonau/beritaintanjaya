# 📰 Berita Intan Jaya - Modern Editorial Magazine

Portal berita resmi Pemerintah Kabupaten Intan Jaya dengan desain **Modern Editorial** yang bersih, profesional, dan responsive.

## ✨ Design Highlights

### 🎨 Design Philosophy
- **Editorial First**: Layout terinspirasi dari majalah dan portal berita premium (The New York Times, The Guardian)
- **Typography Hierarchy**: Serif untuk headline (Playfair Display), Sans-serif untuk body (Inter)
- **Clean & Spacious**: White space yang generous untuk readability
- **Professional**: Color palette yang mature dan kredibel

### 🎯 Key Features

1. **Multi-Variant News Cards**
   - `hero`: Large immersive card dengan image overlay
   - `featured`: Horizontal layout untuk berita penting
   - `standard`: Vertical grid card standar
   - `minimal`: Text-focused untuk sidebar/list

2. **Smart Header**
   - Sticky navigation dengan scroll effect
   - Top utility bar (lokasi + waktu)
   - Responsive mobile menu
   - Clean brand identity

3. **Homepage Layout**
   - Hero section: Main story + trending sidebar
   - Latest news grid: 4-column responsive
   - Focus section: Category highlight (Pemerintahan)
   - Service banner: Public service integration

4. **Archive & Category Pages**
   - Advanced filtering (category + sort)
   - Pagination support
   - Category hero headers
   - Related categories suggestions

## 📐 Layout Structure

```
┌─────────────────────────────────────┐
│  Header (Sticky)                    │
│  - Top Bar (Location + Date)        │
│  - Logo + Navigation                │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  HOMEPAGE                           │
│  ┌──────────────┬─────────────────┐ │
│  │              │  Trending       │ │
│  │  Hero Story  │  Sidebar        │ │
│  │  (Image BG)  │  (Text List)    │ │
│  │              │                 │ │
│  └──────────────┴─────────────────┘ │
│  ┌─────────────────────────────────┐│
│  │  Latest News Grid (4 cols)      ││
│  │  [Card] [Card] [Card] [Card]    ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │  Focus: Pemerintahan            ││
│  │  [Grid 3 cols]                  ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Footer (Dark)                      │
│  - Brand + Social                   │
│  - Navigation Links                 │
│  - Contact Info                     │
│  - Copyright                        │
└─────────────────────────────────────┘
```

## 🎨 Design Tokens

### Colors
```css
--color-brand-500: #3b82f6  /* Primary Blue */
--color-brand-700: #1d4ed8  /* Dark Blue */
--color-brand-900: #1e3a8a  /* Deep Blue */
--color-accent-500: #f59e0b /* Gold Accent */
```

### Typography
```css
--font-display: Playfair Display (Serif - Headlines)
--font-body: Inter (Sans-serif - Body Text)
```

### Spacing Scale
- Container: max-width 1400px
- Padding: 1rem (mobile) → 2rem (desktop)
- Section padding: 3rem → 6rem responsive

## 🚀 Getting Started

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

Access: **http://localhost:3000**

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Wide: > 1400px

## 🔗 Page Routes

- `/` - Homepage (Editorial layout)
- `/all-news` - Archive dengan filter
- `/kategori/[slug]` - Category pages
- `/berita/[id]` - Article detail (placeholder)

## 📦 Component Structure

```
app/
├── components/
│   ├── Header.tsx       # Sticky nav dengan scroll effect
│   ├── Footer.tsx       # Dark footer dengan links
│   └── NewsCard.tsx     # 4 variants card component
├── page.tsx             # Homepage editorial layout
├── all-news/
│   └── page.tsx         # Archive dengan pagination
├── kategori/[slug]/
│   └── page.tsx         # Category pages
└── globals.css          # Design tokens + utilities
```

## 🎯 Best Practices

1. **Images**: Gunakan aspect ratio konsisten
   - Hero: Free aspect (tall)
   - Featured: 16:9
   - Standard: 4:3

2. **Text Length**:
   - Title: Max 80 karakter
   - Excerpt: Max 200 karakter
   - Line clamp digunakan untuk overflow

3. **Performance**:
   - Images lazy loaded
   - CSS minimal dan efficient
   - No complex animations

## 🔄 WordPress Integration

Siap untuk integrasi WordPress REST API. Lihat `app/lib/wordpress.ts` untuk functions:

```typescript
import { fetchLatestPosts, fetchPostsByCategory } from './lib/wordpress';

// Di page component
const news = await fetchLatestPosts(12);
const catNews = await fetchPostsByCategory('pemerintahan');
```

## 📞 Support

Website: https://intanjayakab.go.id  
Email: info@intanjayakab.go.id  
Location: Sugapa, Kabupaten Intan Jaya, Papua Tengah

---

© 2025 Pemerintah Kabupaten Intan Jaya
