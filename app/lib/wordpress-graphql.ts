import { GraphQLClient } from 'graphql-request';

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
        console.error('Error fetching posts:', error);
        return {
            posts: [],
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
        console.error('Error fetching post by slug:', error);
        return null;
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
        console.error('Error fetching posts by category:', error);
        return [];
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
