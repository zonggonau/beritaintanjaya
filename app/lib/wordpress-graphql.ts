import { GraphQLClient } from 'graphql-request';
import { newsData } from '../data/newsData';

// WordPress GraphQL endpoint
const GRAPHQL_ENDPOINT = 'https://intanjayakab.go.id/graphql';

// Initialize GraphQL client
const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {},
});

// Types
export interface WPPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  slug: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  categories?: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  author?: {
    node: {
      name: string;
    };
  };
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
  slug: string;
  content?: string;
}

// GraphQL Queries
const GET_POSTS_QUERY = `
  query GetPosts($first: Int = 10, $after: String) {
    posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        excerpt
        content
        date
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

const GET_POST_BY_SLUG_QUERY = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      excerpt
      content
      date
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          id
          name
          slug
        }
      }
      author {
        node {
          name
        }
      }
    }
  }
`;

const GET_POSTS_BY_CATEGORY_QUERY = `
  query GetPostsByCategory($categoryName: String!, $first: Int = 10) {
    posts(first: $first, where: { categoryName: $categoryName, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        excerpt
        content
        date
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

const GET_CATEGORIES_QUERY = `
  query GetCategories {
    categories(first: 100, where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
        count
        description
      }
    }
  }
`;

// Helper: Calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} menit`;
}

// Helper: Clean excerpt
function cleanExcerpt(excerpt: string): string {
  return excerpt
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/&[^;]+;/g, '') // Strip HTML entities
    .trim()
    .substring(0, 200) + '...';
}

// Transform WPPost to NewsArticle
export function transformPost(post: WPPost): NewsArticle {
  const category = post.categories?.nodes[0] || { name: 'Umum', slug: 'umum' };
  const image = post.featuredImage?.node?.sourceUrl || '/images/placeholder.jpg';
  const author = post.author?.node?.name || 'Admin';
  const readTime = calculateReadTime(post.content || '');

  return {
    id: post.id,
    title: post.title,
    excerpt: cleanExcerpt(post.excerpt || ''),
    category: category.name,
    categorySlug: category.slug,
    image,
    date: new Date(post.date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    author,
    readTime,
    slug: post.slug,
    content: post.content,
  };
}

// Fetch posts with pagination
export async function fetchPosts(first: number = 10, after?: string): Promise<{
  posts: NewsArticle[];
  hasNextPage: boolean;
  endCursor: string | null;
}> {
  try {
    const data: any = await client.request(GET_POSTS_QUERY, { first, after });

    return {
      posts: data.posts.nodes.map(transformPost),
      hasNextPage: data.posts.pageInfo.hasNextPage,
      endCursor: data.posts.pageInfo.endCursor,
    };
  } catch (error) {
    console.warn('Error fetching posts from GraphQL, falling back to mock data');
    const sliced = newsData.slice(0, first);
    return {
      posts: sliced as unknown as NewsArticle[],
      hasNextPage: false,
      endCursor: null,
    };
  }
}

// Fetch single post by slug
export async function fetchPostBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const data: any = await client.request(GET_POST_BY_SLUG_QUERY, { slug });

    if (!data.post) {
      return null;
    }

    return transformPost(data.post);
  } catch (error) {
    console.warn('Error fetching post by slug from GraphQL, falling back to mock data');
    const found = newsData.find(post => post.slug === slug || post.id === slug);
    return (found as unknown as NewsArticle) || null;
  }
}

// Fetch posts by category
export async function fetchPostsByCategory(categorySlug: string, first: number = 10): Promise<NewsArticle[]> {
  try {
    const data: any = await client.request(GET_POSTS_BY_CATEGORY_QUERY, {
      categoryName: categorySlug,
      first,
    });

    return data.posts.nodes.map(transformPost);
  } catch (error) {
    console.warn('Error fetching posts by category from GraphQL, falling back to mock data');
    const filtered = newsData.filter(post => post.categorySlug === categorySlug).slice(0, first);
    return filtered as unknown as NewsArticle[];
  }
}

// Fetch categories
export async function fetchCategories(): Promise<Array<{
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string;
}>> {
  try {
    const data: any = await client.request(GET_CATEGORIES_QUERY);
    return data.categories.nodes;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Fetch latest posts (shorthand)
export async function fetchLatestPosts(count: number = 12): Promise<NewsArticle[]> {
  const { posts } = await fetchPosts(count);
  return posts;
}

// Fetch featured posts (top 3 latest)
export async function fetchFeaturedPosts(count: number = 3): Promise<NewsArticle[]> {
  const { posts } = await fetchPosts(count);
  return posts;
}

export async function getFilteredNews({
  category,
  sort = 'newest',
  page = 1,
  limit = 12
}: {
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{
  posts: NewsArticle[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}> {
  // 1. Filter by Category
  let filtered = category
    ? newsData.filter(item => item.categorySlug === category)
    : [...newsData];

  // 2. Sort
  if (sort === 'oldest') {
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sort === 'popular') {
    // Mock popular logic (random or static for now, maybe title length as proxy?)
    filtered.sort((a, b) => b.title.length - a.title.length);
  } else {
    // Newest (Default)
    // Note: The date string is "5 Desember 2025". We need to parse this for correct sorting if not ISO.
    // But the mock data has simplified dates. Let's assume input order is roughly chronological or try to parse.
    // Actually, the mock data is already sorted by date (newest first). 
    // But precise parsing for Indonesian date string "5 Desember 2025":
    const parseIdDate = (dateStr: string) => {
      const months: { [key: string]: number } = {
        'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
        'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
      };
      const parts = dateStr.split(' ');
      if (parts.length < 3) return 0;
      const day = parseInt(parts[0]);
      const month = months[parts[1]] || 0;
      const year = parseInt(parts[2]);
      return new Date(year, month, day).getTime();
    };

    filtered.sort((a, b) => parseIdDate(b.date) - parseIdDate(a.date));
  }

  // 3. Pagination
  const totalPosts = filtered.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const offset = (page - 1) * limit;
  const paginatedPosts = filtered.slice(offset, offset + limit);

  return {
    posts: paginatedPosts as unknown as NewsArticle[],
    totalPosts,
    totalPages,
    currentPage: page
  };
}
