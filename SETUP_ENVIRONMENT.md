# Environment Setup Instructions

## Quick Fix for Current Issues

The system is having some environment setup issues. Here's how to fix them:

### 1. Create Environment File

Create a file named `.env.local` in your project root with the following content:

```bash
# Google Gemini API Key - Get from https://makersuite.google.com/app/apikey
GOOGLE_API_KEY=your_actual_api_key_here

# Supabase Configuration - Get from your Supabase project
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Alternative: Use Simple API (No External Dependencies)

If you don't want to set up external APIs right now, the system has been updated to use a simple fallback API at `/api/math-problem/simple` that works without external dependencies.

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test the System

1. Open your browser to the URL shown in the terminal (usually http://localhost:3000 or http://localhost:3002)
2. Click "Generate New Problem" to test the system
3. The system will now show syllabus-aligned questions with proper metadata

## Current Status

✅ **Working Features:**
- Syllabus-based question generation (using fallback API)
- Question metadata (topics, learning objectives, primary levels)
- User interface with syllabus information display
- Problem difficulty and type selection

⚠️ **Needs Setup:**
- Google Gemini API key (for AI-generated questions)
- Supabase database (for progress tracking)

## Next Steps

1. **For Full Functionality**: Set up the environment variables above
2. **For Testing**: The simple API is already working and shows the syllabus integration
3. **For Production**: Run the database migration in Supabase

The system is now functional with syllabus-based questions, even without external API keys!
