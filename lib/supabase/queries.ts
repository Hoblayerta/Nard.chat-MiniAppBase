import { supabase } from './client';

export interface Storie {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_archived: boolean;
  is_frozen: boolean;
  author: {
    id: string;
    username: string;
    wallet_address: string;
    badges?: string[];
  };
}

export interface Comment {
  id: string;
  post_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  vote_score: number;
  author: {
    id: string;
    username: string;
    wallet_address: string;
    badges?: string[];
  };
  replies?: Comment[];
}

// Get a single Storie by ID
export async function getStorie(id: string): Promise<Storie | null> {
  try {
    // First try the full query with relationships
    let { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        created_at,
        is_archived,
        is_frozen,
        author:users!author_id(
          id, 
          username, 
          wallet_address,
          badges:user_badges(badge_type)
        )
      `)
      .eq('id', id)
      .single();

    // If there's an error with relationships, try fallback
    if (error) {
      console.error('Error fetching Storie with relationships, trying fallback:', error.message || error);
      
      // Fallback query without nested relationships
      const fallbackResult = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          created_at,
          is_archived,
          is_frozen,
          author_id
        `)
        .eq('id', id)
        .single();

      if (fallbackResult.error) {
        console.error('Fallback query also failed:', fallbackResult.error);
        return null;
      }

      // For fallback, create mock author data
      if (fallbackResult.data) {
        data = {
          ...fallbackResult.data,
          author: {
            id: fallbackResult.data.author_id,
            username: `User${fallbackResult.data.author_id.slice(-4)}`,
            wallet_address: `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`,
            badges: []
          }
        } as any;
      }
    }

    if (!data) {
      return null;
    }

    // Transform badges data
    if (data && (data as any).author && (data as any).author.badges) {
      (data as any).author.badges = (data as any).author.badges.map((b: { badge_type: string }) => b.badge_type);
    }

    return data as any;
  } catch (error) {
    console.error('Unexpected error fetching Storie:', error);
    
    // Return mock data for development
    return {
      id,
      title: 'Sample Storie Title',
      content: 'This is a sample Storie content. In a real application, this would be fetched from Supabase.',
      created_at: new Date().toISOString(),
      is_archived: false,
      is_frozen: false,
      author: {
        id: '1',
        username: 'DemoUser',
        wallet_address: '0x1234567890123456789012345678901234567890',
        badges: ['director']
      }
    };
  }
}

// Get all Stories
export async function getStories(limit: number = 10, offset: number = 0): Promise<Storie[]> {
  try {
    // First try the full query with relationships
    let { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        created_at,
        is_archived,
        is_frozen,
        author:users!author_id(
          id, 
          username, 
          wallet_address,
          badges:user_badges(badge_type)
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // If there's an error with relationships, try fallback
    if (error) {
      console.error('Error fetching Stories with relationships, trying fallback:', error);
      
      // Fallback query without nested relationships
      const fallbackResult = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          created_at,
          is_archived,
          is_frozen,
          author_id
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (fallbackResult.error) {
        console.error('Fallback query also failed:', fallbackResult.error);
        return [];
      }

      // For fallback, create mock author data
      if (fallbackResult.data) {
        data = fallbackResult.data.map(story => ({
          ...story,
          author: {
            id: story.author_id,
            username: `User${story.author_id.slice(-4)}`,
            wallet_address: `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`,
            badges: []
          }
        })) as any;
      } else {
        data = [];
      }
    }

    if (!data) {
      return [];
    }

    // Transform badges data
    const stories = data.map((story: any) => ({
      ...story,
      author: {
        ...story.author,
        badges: story.author?.badges ? story.author.badges.map((b: { badge_type: string }) => b.badge_type) : []
      }
    }));

    return stories;
  } catch (error) {
    console.error('Unexpected error fetching Stories:', error);
    return [];
  }
}

// Get comments for a Storie  
export async function getStorieComments(postId: string): Promise<Comment[]> {
  try {
    // First try the full query with relationships
    let { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        post_id,
        parent_id,
        content,
        created_at,
        upvotes,
        downvotes,
        vote_score,
        author:users!author_id(
          id, 
          username, 
          wallet_address,
          badges:user_badges(badge_type)
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    // If there's an error with relationships, fallback to simpler query
    if (error) {
      console.error('Error fetching comments with relationships, trying fallback:', error);
      
      // Fallback query without nested relationships
      const fallbackResult = await supabase
        .from('comments')
        .select(`
          id,
          post_id,
          parent_id,
          content,
          created_at,
          upvotes,
          downvotes,
          vote_score,
          author_id
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (fallbackResult.error) {
        console.error('Fallback query also failed:', fallbackResult.error);
        return [];
      }

      // For fallback, create mock author data
      if (fallbackResult.data) {
        data = fallbackResult.data.map(comment => ({
          ...comment,
          author: {
            id: comment.author_id,
            username: `User${comment.author_id.slice(-4)}`,
            wallet_address: `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`,
            badges: []
          }
        })) as any;
      } else {
        data = [];
      }
    }

    if (!data) {
      return [];
    }

    // Transform badges data and build nested structure
    const comments = data.map((comment: any) => ({
      ...comment,
      author: {
        ...comment.author,
        badges: comment.author?.badges ? comment.author.badges.map((b: { badge_type: string }) => b.badge_type) : []
      }
    }));

    const commentMap = new Map();
    const rootComments: Comment[] = [];

    // First pass: create comment objects
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build hierarchy
    comments.forEach(comment => {
      const commentObj = commentMap.get(comment.id);
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentObj);
        }
      } else {
        rootComments.push(commentObj);
      }
    });

    return rootComments;
  } catch (error) {
    console.error('Unexpected error fetching comments:', error);
    
    // Return mock data for development if all else fails
    return [];
  }
}

// Get or create user by wallet address
export async function getOrCreateUser(walletAddress: string, username?: string): Promise<string | null> {
  try {
    // Normalize wallet address to lowercase
    const normalizedAddress = walletAddress.toLowerCase();
    
    // First try to find existing user
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('id, role')
      .eq('wallet_address', normalizedAddress)
      .single();

    if (existingUser) {
      console.log('Found existing user:', existingUser);
      return existingUser.id;
    }

    if (findError && findError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, anything else is a real error
      console.error('Error finding user:', findError);
      
      // If we can't query the users table, it probably doesn't exist
      // Return a deterministic ID based on wallet for development
      console.log('Users table may not exist, using fallback ID generation');
      return `wallet_${normalizedAddress.slice(2, 10)}`;
    }

    // If not found, create new user
    const newUsername = username || `User${normalizedAddress.slice(-8)}`;
    
    // Check if wallet is admin
    const ADMIN_WALLETS = ['0x527F6123c3A39E87B1B5fFbC185f2174EC323Edb'.toLowerCase()];
    const role = ADMIN_WALLETS.includes(normalizedAddress) ? 'admin' : 'user';
    
    console.log(`Creating new user for wallet ${normalizedAddress} with role ${role}`);
    
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        wallet_address: normalizedAddress,
        username: newUsername,
        role: role
      })
      .select('id, role')
      .single();

    if (createError) {
      console.error('Error creating user:', createError.message || createError);
      
      // Fallback: generate deterministic ID for development
      const fallbackId = `wallet_${normalizedAddress.slice(2, 10)}`;
      console.log(`Using fallback user ID: ${fallbackId}`);
      return fallbackId;
    }

    console.log('Created new user:', newUser);
    return newUser.id;
  } catch (error) {
    console.error('Unexpected error with user, using fallback:', error);
    
    // Final fallback: generate deterministic ID
    const normalizedAddress = walletAddress.toLowerCase();
    const fallbackId = `wallet_${normalizedAddress.slice(2, 10)}`;
    console.log(`Using fallback user ID: ${fallbackId}`);
    return fallbackId;
  }
}

// Get user by wallet address (without creating)
export async function getUserByWallet(walletAddress: string): Promise<{ id: string; role: string; username: string } | null> {
  try {
    const normalizedAddress = walletAddress.toLowerCase();
    
    let { data, error } = await supabase
      .from('users')
      .select('id, role, username')
      .eq('wallet_address', normalizedAddress)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user by wallet (table may not exist):', error);
      
      // Fallback: create mock user data based on wallet
      const ADMIN_WALLETS = ['0x527F6123c3A39E87B1B5fFbC185f2174EC323Edb'.toLowerCase()];
      const isAdmin = ADMIN_WALLETS.includes(normalizedAddress);
      
      return {
        id: `wallet_${normalizedAddress.slice(2, 10)}`,
        role: isAdmin ? 'admin' : 'user',
        username: `User${normalizedAddress.slice(-8)}`
      };
    }

    return data || null;
  } catch (error) {
    console.error('Unexpected error fetching user by wallet, using fallback:', error);
    
    // Fallback: create mock user data based on wallet
    const normalizedAddress = walletAddress.toLowerCase();
    const ADMIN_WALLETS = ['0x527F6123c3A39E87B1B5fFbC185f2174EC323Edb'.toLowerCase()];
    const isAdmin = ADMIN_WALLETS.includes(normalizedAddress);
    
    return {
      id: `wallet_${normalizedAddress.slice(2, 10)}`,
      role: isAdmin ? 'admin' : 'user',  
      username: `User${normalizedAddress.slice(-8)}`
    };
  }
}

// Ensure user exists for wallet (called when wallet connects)
export async function ensureUserExists(walletAddress: string): Promise<{ id: string; role: string; username: string } | null> {
  try {
    console.log('Ensuring user exists for wallet:', walletAddress);
    
    // First try to get existing user (this has built-in fallbacks)
    const existingUser = await getUserByWallet(walletAddress);
    if (existingUser) {
      console.log('User already exists or created fallback:', existingUser);
      return existingUser;
    }

    // Create user if doesn't exist (this also has built-in fallbacks)
    const userId = await getOrCreateUser(walletAddress);
    if (!userId) {
      console.error('Failed to create user, using final fallback');
      
      // Final fallback
      const normalizedAddress = walletAddress.toLowerCase();
      const ADMIN_WALLETS = ['0x527F6123c3A39E87B1B5fFbC185f2174EC323Edb'.toLowerCase()];
      const isAdmin = ADMIN_WALLETS.includes(normalizedAddress);
      
      return {
        id: `wallet_${normalizedAddress.slice(2, 10)}`,
        role: isAdmin ? 'admin' : 'user',
        username: `User${normalizedAddress.slice(-8)}`
      };
    }

    // Return the created user
    return await getUserByWallet(walletAddress);
  } catch (error) {
    console.error('Error ensuring user exists, using final fallback:', error);
    
    // Final fallback
    const normalizedAddress = walletAddress.toLowerCase();
    const ADMIN_WALLETS = ['0x527F6123c3A39E87B1B5fFbC185f2174EC323Edb'.toLowerCase()];
    const isAdmin = ADMIN_WALLETS.includes(normalizedAddress);
    
    return {
      id: `wallet_${normalizedAddress.slice(2, 10)}`,
      role: isAdmin ? 'admin' : 'user',
      username: `User${normalizedAddress.slice(-8)}`
    };
  }
}

// Create a new Storie
export async function createStorie(title: string, content: string, walletAddress: string, username?: string): Promise<Storie | null> {
  try {
    const authorId = await getOrCreateUser(walletAddress, username);
    if (!authorId) return null;

    const { data, error } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        author_id: authorId
      })
      .select(`
        id,
        title,
        content,
        created_at,
        is_archived,
        is_frozen,
        author:users!author_id(
          id, 
          username, 
          wallet_address,
          badges:user_badges(badge_type)
        )
      `)
      .single();

    if (error) {
      console.error('Error creating Storie:', error);
      return null;
    }

    // Transform badges data
    if (data && (data as any).author?.badges) {
      (data as any).author.badges = (data as any).author.badges.map((b: { badge_type: string }) => b.badge_type);
    }

    return data as any;
  } catch (error) {
    console.error('Unexpected error creating Storie:', error);
    return null;
  }
}

// Create a new comment
export async function createComment(
  postId: string, 
  content: string, 
  walletAddress: string,
  username?: string,
  parentId?: string
): Promise<Comment | null> {
  try {
    const authorId = await getOrCreateUser(walletAddress, username);
    if (!authorId) return null;

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        content,
        author_id: authorId,
        parent_id: parentId || null
      })
      .select(`
        id,
        post_id,
        parent_id,
        content,
        created_at,
        upvotes,
        downvotes,
        vote_score,
        author:users!author_id(
          id, 
          username, 
          wallet_address,
          badges:user_badges(badge_type)
        )
      `)
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return null;
    }

    // Transform badges data
    if (data && (data as any).author?.badges) {
      (data as any).author.badges = (data as any).author.badges.map((b: { badge_type: string }) => b.badge_type);
    }

    return data as any;
  } catch (error) {
    console.error('Unexpected error creating comment:', error);
    return null;
  }
}