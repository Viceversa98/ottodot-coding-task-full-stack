# Database Migration Guide for Math Problem Generator

## Overview
This guide will help you add the new columns (difficulty, problem_type, hint, step_explanation) to your existing Supabase database.

## Option 1: Migration Script (Recommended for Existing Database)

If you already have a database with the original schema, use the migration script:

### Steps:
1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `database_migration.sql`
4. Click "Run" to execute the migration

### What the migration does:
- Adds 4 new columns to `math_problem_sessions` table
- Sets default values for existing records
- Adds constraints to ensure valid values
- Creates indexes for better performance
- Verifies the changes

## Option 2: Complete Setup (For New Database)

If you're setting up a fresh database, use the complete setup script:

### Steps:
1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `database_complete_setup.sql`
4. Click "Run" to execute the setup

### What the complete setup does:
- Creates both tables with all features
- Sets up Row Level Security (RLS)
- Creates all necessary indexes
- Adds sample data for testing
- Verifies the setup

## New Columns Added:

### `math_problem_sessions` table:
- `difficulty` (VARCHAR): 'easy', 'medium', or 'hard'
- `problem_type` (VARCHAR): 'addition', 'subtraction', 'multiplication', 'division', or 'mixed'
- `hint` (TEXT): AI-generated hint for the problem
- `step_explanation` (TEXT): Step-by-step solution explanation

## Verification:

After running either script, you can verify the changes by running:

```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'math_problem_sessions' 
ORDER BY ordinal_position;
```

You should see all 8 columns:
1. id
2. created_at
3. problem_text
4. correct_answer
5. difficulty
6. problem_type
7. hint
8. step_explanation

## Troubleshooting:

### If you get permission errors:
- Make sure you're logged in as the database owner
- Check that RLS policies allow your operations

### If columns already exist:
- The migration script uses `ADD COLUMN IF NOT EXISTS` to prevent errors
- You can safely run it multiple times

### If you need to rollback:
```sql
-- Remove the new columns (use with caution)
ALTER TABLE math_problem_sessions DROP COLUMN IF EXISTS difficulty;
ALTER TABLE math_problem_sessions DROP COLUMN IF EXISTS problem_type;
ALTER TABLE math_problem_sessions DROP COLUMN IF EXISTS hint;
ALTER TABLE math_problem_sessions DROP COLUMN IF EXISTS step_explanation;
```

## Next Steps:

After running the migration:
1. Update your `.env.local` file with your Supabase credentials
2. Restart your development server
3. Test the new features in your application

The application will now be able to:
- Generate problems with different difficulty levels
- Create specific problem types
- Provide hints and step-by-step explanations
- Track user progress and history
