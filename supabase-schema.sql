-- NARD Chat Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table - stores wallet-based users
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges table - for user achievements/roles
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_type TEXT NOT NULL CHECK (badge_type IN ('director', 'moderator', 'contributor', 'early_adopter')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_type)
);

-- Stories table
CREATE TABLE IF NOT EXISTS Stories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_archived BOOLEAN DEFAULT FALSE,
    is_frozen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table - supports nested comments
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    Storie_id UUID REFERENCES Stories(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    vote_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_Stories_author_id ON Stories(author_id);
CREATE INDEX IF NOT EXISTS idx_Stories_created_at ON Stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_Storie_id ON comments(Storie_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);

-- Functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Stories_updated_at BEFORE UPDATE ON Stories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE Stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (true);

-- RLS Policies for user_badges table
CREATE POLICY "Anyone can view badges" ON user_badges FOR SELECT USING (true);
CREATE POLICY "Only admins can manage badges" ON user_badges FOR ALL USING (true);

-- RLS Policies for Stories table
CREATE POLICY "Anyone can view Stories" ON Stories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create Stories" ON Stories FOR INSERT WITH CHECK (true);
CREATE POLICY "Authors can update their Stories" ON Stories FOR UPDATE USING (true);
CREATE POLICY "Authors and admins can delete Stories" ON Stories FOR DELETE USING (true);

-- RLS Policies for comments table
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Authors can update their comments" ON comments FOR UPDATE USING (true);
CREATE POLICY "Authors and admins can delete comments" ON comments FOR DELETE USING (true);

-- Insert admin user if specified wallet exists
INSERT INTO users (wallet_address, username, role) 
VALUES ('0x527f6123c3a39e87b1b5ffbc185f2174ec323edb', 'Admin', 'admin')
ON CONFLICT (wallet_address) DO UPDATE SET role = 'admin', username = 'Admin';

-- Add director badge to admin
INSERT INTO user_badges (user_id, badge_type)
SELECT id, 'director' 
FROM users 
WHERE wallet_address = '0x527f6123c3a39e87b1b5ffbc185f2174ec323edb'
ON CONFLICT (user_id, badge_type) DO NOTHING;

-- Insert sample data for testing
INSERT INTO Stories (title, content, author_id)
SELECT 
    'Welcome to NARD Chat',
    'This is the first Storie on our decentralized chat platform. Welcome!',
    id
FROM users 
WHERE wallet_address = '0x527f6123c3a39e87b1b5ffbc185f2174ec323edb'
ON CONFLICT DO NOTHING;