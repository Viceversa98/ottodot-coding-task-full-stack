-- Add new columns to math_problem_sessions table for syllabus support
ALTER TABLE math_problem_sessions 
ADD COLUMN IF NOT EXISTS syllabus_topic TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS learning_objective TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS primary_level VARCHAR(20) DEFAULT 'Primary 5',
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'syllabus_based';

-- Update the table comment
COMMENT ON TABLE math_problem_sessions IS 'Stores math problem sessions including syllabus-based questions';
COMMENT ON COLUMN math_problem_sessions.syllabus_topic IS 'The specific topic from the syllabus this question addresses';
COMMENT ON COLUMN math_problem_sessions.learning_objective IS 'The learning objective this question helps achieve';
COMMENT ON COLUMN math_problem_sessions.primary_level IS 'The primary level this question is designed for';
COMMENT ON COLUMN math_problem_sessions.source IS 'Source of the problem: syllabus_based, generated, etc.';