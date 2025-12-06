/**
 * WordPress API Integration
 * 
 * This file contains functions to fetch data from WordPress REST API
 * Replace the API_URL with your actual WordPress site URL
 */

// WordPress API Configuration
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://your-wordpress-site.com/wp-json/wp/v2';

export interface WPPost {
    id: number;
    date: string;
    modified: string;
    slug: string;
    status: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    author: number;
    featured_media: number;
    categories: number[];
    tags: number[];
    _embedded?: {
        author?: Array<{
            id: number;
            name: string;
            avatar_urls: { [key: string]: string };
        }>;
        'wp:featuredmedia'?: Array<{
            source_url: string;
            alt_text: string;
        }>;
        'wp:term'?: Array<Array<{
            id: number;
            name: string;
            slug: string;
        }>>;
    };
}

export interface WPCategory {
    id: number;
    count: number;
    description: string;
    name: string;
    slug: string;
}

/**
 * Fetch posts from WordPress
 */
export async function fetchPosts(params?: {
    page?: number;
    perPage?: number;
    categories?: string;
    search?: string;
}): Promise<{ posts: WPPost[]; total: number; totalPages: number }> {
    try {
        const queryParams = new URLSearchParams({
            _embed: 'true',
            page: (params?.page || 1).toString(),
            per_page: (params?.perPage || 10).toString(),
            ...(params?.categories && { categories: params.categories }),
            ...(params?.search && { search: params.search }),
        });

        const response = await fetch(`${WP_API_URL}/posts?${queryParams}`, {
            next: { revalidate: 60 }, // Revalidate every 60 seconds
        });

        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        const posts = await response.json();
        const total = parseInt(response.headers.get('X-WP-Total') || '0');
        const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');

        return { posts, total, totalPages };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { posts: [], total: 0, totalPages: 0 };
    }
}

/**
 * Fetch a single post by slug
 */
export async function fetchPostBySlug(slug: string): Promise<WPPost | null> {
    try {
        const response = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed=true`, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }

        const posts = await response.json();
        return posts[0] || null;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

/**
 * Fetch categories from WordPress
 */
export async function fetchCategories(): Promise<WPCategory[]> {
    try {
        const response = await fetch(`${WP_API_URL}/categories?per_page=100`, {
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

/**
 * Fetch posts by category slug
 */
export async function fetchPostsByCategory(
    categorySlug: string,
    params?: { page?: number; perPage?: number }
): Promise<{ posts: WPPost[]; total: number; totalPages: number }> {
    try {
        // First, get the category ID from slug
        const categories = await fetchCategories();
        const category = categories.find((cat) => cat.slug === categorySlug);

        if (!category) {
            return { posts: [], total: 0, totalPages: 0 };
        }

        return await fetchPosts({
            ...params,
            categories: category.id.toString(),
        });
    } catch (error) {
        console.error('Error fetching posts by category:', error);
        return { posts: [], total: 0, totalPages: 0 };
    }
}

/**
 * Transform WordPress post to NewsArticle format
 */
export function transformWPPostToArticle(post: WPPost) {
    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/placeholder.jpg';
    const author = post._embedded?.author?.[0]?.name || 'Admin';
    const category = post._embedded?.['wp:term']?.[0]?.[0];

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = post.content.rendered.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    return {
        id: post.id.toString(),
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        category: category?.name || 'Umum',
        categorySlug: category?.slug || 'umum',
        image: featuredImage,
        date: new Date(post.date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        author,
        readTime: `${readTime} menit baca`,
        slug: post.slug,
        content: post.content.rendered,
    };
}

/**
 * Fetch featured posts (latest posts)
 */
export async function fetchFeaturedPosts(limit: number = 3) {
    const { posts } = await fetchPosts({ perPage: limit });
    return posts.map(transformWPPostToArticle);
}

/**
 * Fetch latest posts
 */
export async function fetchLatestPosts(limit: number = 12) {
    const { posts } = await fetchPosts({ perPage: limit });
    return posts.map(transformWPPostToArticle);
}

/**
 * Search posts
 */
export async function searchPosts(query: string, params?: { page?: number; perPage?: number }) {
    const { posts, total, totalPages } = await fetchPosts({
        ...params,
        search: query,
    });

    return {
        posts: posts.map(transformWPPostToArticle),
        total,
        totalPages,
    };
}
