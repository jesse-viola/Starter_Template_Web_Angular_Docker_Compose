-- Knitting Application Phase 1 Database Schema
-- PostgreSQL Creation Script

-- Create the database (run this separately as superuser)
-- CREATE DATABASE knitting_app;

-- Connect to the database and create tables
-- \c knitting_app;

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Yarns table
CREATE TABLE yarns (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Patterns table
CREATE TABLE patterns (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Junction table for yarn tags (many-to-many)
CREATE TABLE yarn_tags (
    yarn_id INTEGER REFERENCES yarns(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (yarn_id, tag_id)
);

-- Junction table for pattern tags (many-to-many)
CREATE TABLE pattern_tags (
    pattern_id INTEGER REFERENCES patterns(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (pattern_id, tag_id)
);

-- User favorites for yarns
CREATE TABLE user_favorite_yarns (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    yarn_id INTEGER REFERENCES yarns(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, yarn_id)
);

-- User favorites for patterns
CREATE TABLE user_favorite_patterns (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    pattern_id INTEGER REFERENCES patterns(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, pattern_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_yarns_name ON yarns(name);
CREATE INDEX idx_patterns_name ON patterns(name);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_yarn_tags_yarn_id ON yarn_tags(yarn_id);
CREATE INDEX idx_yarn_tags_tag_id ON yarn_tags(tag_id);
CREATE INDEX idx_pattern_tags_pattern_id ON pattern_tags(pattern_id);
CREATE INDEX idx_pattern_tags_tag_id ON pattern_tags(tag_id);
CREATE INDEX idx_user_favorite_yarns_user_id ON user_favorite_yarns(user_id);
CREATE INDEX idx_user_favorite_patterns_user_id ON user_favorite_patterns(user_id);

-- Sample data for testing (optional)
-- Insert some sample tags
INSERT INTO tags (name) VALUES 
    ('cotton'),
    ('wool'),
    ('beginner'),
    ('sweater'),
    ('hat'),
    ('scarf'),
    ('colorwork'),
    ('cables');

-- Insert sample yarns
INSERT INTO yarns (name, description, url) VALUES 
    ('Blue Sky Cotton', 'Soft organic cotton yarn perfect for summer projects', 'https://example.com/blue-sky-cotton'),
    ('Highland Wool', 'Traditional wool yarn from Scottish highlands', 'https://example.com/highland-wool');

-- Insert sample patterns  
INSERT INTO patterns (name, description, url) VALUES 
    ('Basic Beanie', 'Simple hat pattern perfect for beginners', 'https://example.com/basic-beanie'),
    ('Cable Scarf', 'Intermediate scarf with beautiful cable pattern', 'https://example.com/cable-scarf');

-- Sample tag associations
INSERT INTO yarn_tags (yarn_id, tag_id) VALUES 
    (1, 1), -- Blue Sky Cotton tagged as "cotton"
    (2, 2); -- Highland Wool tagged as "wool"

INSERT INTO pattern_tags (pattern_id, tag_id) VALUES 
    (1, 3), -- Basic Beanie tagged as "beginner"
    (1, 5), -- Basic Beanie tagged as "hat"
    (2, 6), -- Cable Scarf tagged as "scarf"
    (2, 8); -- Cable Scarf tagged as "cables"