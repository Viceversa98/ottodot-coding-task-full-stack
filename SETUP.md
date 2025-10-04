# Math Problem Generator - Setup Guide

## Environment Setup

### 1. Install Dependencies
```bash
npm install
```

**Note:** This project uses `@google/genai` package for Google Gemini AI integration with the `gemini-2.5-flash` model.

### 2. Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Get Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and add it to your `.env.local` file

### 4. Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### POST /api/math-problem
Generates a new math problem using Google Gemini AI.

**Request Body:**
```json
{
  "difficulty": "primary_5",
  "topic": "general"
}
```

**Response:**
```json
{
  "success": true,
  "problem": {
    "problem_text": "Sarah has 24 stickers. She gives away 1/3 of them to her friends and then buys 8 more stickers. How many stickers does Sarah have now?",
    "final_answer": 16
  }
}
```

## Features

- ✅ AI-powered math problem generation
- ✅ Mobile-first responsive design
- ✅ Clean, modern UI
- ✅ Error handling and loading states
- ✅ TypeScript support

## Troubleshooting

### API Key Issues
- Make sure your `.env.local` file is in the root directory
- Verify your Google Gemini API key is valid
- Check that the API key has proper permissions

### Development Issues
- Ensure all dependencies are installed: `npm install`
- Check the console for any error messages
- Verify the API route is accessible at `/api/math-problem`
