-- Complete database setup script for Math Problem Generator
-- This script creates the full schema with all features including difficulty levels and problem types

-- Drop existing tables if they exist (use with caution in production)
-- DROP TABLE IF EXISTS math_problem_submissions CASCADE;
-- DROP TABLE IF EXISTS math_problem_sessions CASCADE;

-- Create math_problem_sessions table with all features
CREATE TABLE IF NOT EXISTS math_problem_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    problem_text TEXT NOT NULL,
    correct_answer NUMERIC NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    problem_type VARCHAR(20) DEFAULT 'mixed' CHECK (problem_type IN ('addition', 'subtraction', 'multiplication', 'division', 'mixed')),
    hint TEXT DEFAULT '',
    step_explanation TEXT DEFAULT ''
);

-- Create math_problem_submissions table
CREATE TABLE IF NOT EXISTS math_problem_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES math_problem_sessions(id) ON DELETE CASCADE,
    user_answer NUMERIC NOT NULL,
    is_correct BOOLEAN NOT NULL,
    feedback_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE math_problem_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE math_problem_submissions ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for anonymous access (for assessment purposes)
-- In production, you would want more restrictive policies

-- Allow anonymous users to read and insert math_problem_sessions
CREATE POLICY "Allow anonymous access to math_problem_sessions" ON math_problem_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Allow anonymous users to read and insert math_problem_submissions
CREATE POLICY "Allow anonymous access to math_problem_submissions" ON math_problem_submissions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_math_problem_submissions_session_id ON math_problem_submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_math_problem_sessions_created_at ON math_problem_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_math_problem_sessions_difficulty ON math_problem_sessions(difficulty);
CREATE INDEX IF NOT EXISTS idx_math_problem_sessions_problem_type ON math_problem_sessions(problem_type);

-- Insert sample data for testing (optional)
INSERT INTO math_problem_sessions (problem_text, correct_answer, difficulty, problem_type, hint, step_explanation) VALUES
(
    'Sarah has 24 stickers. She gives 8 stickers to her friend and buys 12 more stickers. How many stickers does Sarah have now?',
    28,
    'easy',
    'mixed',
    'Start with Sarah''s original stickers, subtract what she gives away, then add what she buys.',
    'Step 1: Sarah starts with 24 stickers\nStep 2: She gives away 8 stickers: 24 - 8 = 16 stickers\nStep 3: She buys 12 more stickers: 16 + 12 = 28 stickers\nFinal Answer: Sarah has 28 stickers now.'
),
(
    'A bakery sold 156 cupcakes in the morning and 89 cupcakes in the afternoon. If they had 300 cupcakes at the start of the day, how many cupcakes are left?',
    55,
    'medium',
    'subtraction',
    'Add the cupcakes sold in morning and afternoon, then subtract from the total.',
    'Step 1: Add cupcakes sold: 156 + 89 = 245 cupcakes\nStep 2: Subtract from total: 300 - 245 = 55 cupcakes\nFinal Answer: 55 cupcakes are left.'
),
(
    'A school has 8 classrooms. Each classroom has 32 students. If 15 students are absent today, how many students are present?',
    241,
    'hard',
    'multiplication',
    'First find total students, then subtract absent students.',
    'Step 1: Find total students: 8 × 32 = 256 students\nStep 2: Subtract absent students: 256 - 15 = 241 students\nFinal Answer: 241 students are present.'
);

-- Verify the setup
SELECT 
    'math_problem_sessions' as table_name,
    COUNT(*) as record_count
FROM math_problem_sessions
UNION ALL
SELECT 
    'math_problem_submissions' as table_name,
    COUNT(*) as record_count
FROM math_problem_submissions;

-- Show table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'math_problem_sessions' 
ORDER BY ordinal_position;
