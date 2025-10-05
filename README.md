# Math Problem Generator - Developer Assessment Starter Kit

## Overview

This is a starter kit for building an AI-powered math problem generator application. The goal is to create a standalone prototype that uses AI to generate math word problems suitable for Primary 5 students, saves the problems and user submissions to a database, and provides personalized feedback.

## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **AI Integration**: Google Generative AI (Gemini)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd math-problem-generator
```

### 2. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → API to find your:
   - Project URL (starts with `https://`)
   - Anon/Public Key

### 3. Set Up Database Tables

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `database.sql`
3. Click "Run" to create the tables and policies

### 4. Get Google API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for Gemini

### 5. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Edit `.env.local` and add your actual keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   GOOGLE_API_KEY=your_actual_google_api_key
   ```

### 6. Install Dependencies

```bash
npm install
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Your Task

### 1. Implement Frontend Logic (`app/page.tsx`)

Complete the TODO sections in the main page component:

- **generateProblem**: Call your API route to generate a new math problem
- **submitAnswer**: Submit the user's answer and get feedback

### 2. Create Backend API Route (`app/api/math-problem/route.ts`)

Create a new API route that handles:

#### POST /api/math-problem (Generate Problem)
- Use Google's Gemini AI to generate a math word problem
- The AI should return JSON with:
  ```json
  {
    "problem_text": "A bakery sold 45 cupcakes...",
    "final_answer": 15
  }
  ```
- Save the problem to `math_problem_sessions` table
- Return the problem and session ID to the frontend

#### POST /api/math-problem/submit (Submit Answer)
- Receive the session ID and user's answer
- Check if the answer is correct
- Use AI to generate personalized feedback based on:
  - The original problem
  - The correct answer
  - The user's answer
  - Whether they got it right or wrong
- Save the submission to `math_problem_submissions` table
- Return the feedback and correctness to the frontend

### 3. Requirements Checklist

- [ /] AI generates appropriate Primary 5 level math problems
- [/ ] Problems and answers are saved to Supabase
- [/ ] User submissions are saved with feedback
- [/ ] AI generates helpful, personalized feedback
- [/ ] UI is clean and mobile-responsive
- [/ ] Error handling for API failures
- [ /] Loading states during API calls

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add your environment variables in Vercel's project settings
4. Deploy!

## Assessment Submission

When submitting your assessment, provide:

1. **GitHub Repository URL**: Make sure it's public
2. **Live Demo URL**: Your Vercel deployment
3. **Supabase Credentials**: Add these to your README for testing:
   ```
   SUPABASE_URL: [Your Supabase Project URL]
   SUPABASE_ANON_KEY: [Your Supabase Anon Key]
   ```

## Implementation Notes

*Please fill in this section with any important notes about your implementation, design decisions, challenges faced, or features you're particularly proud of.*

### My Implementation:

#### 🎯 **Core Features Implemented**

**1. AI-Powered Problem Generation**
- **Dual API Architecture**: Implemented both AI-powered (`/api/math-problem/route.ts`) and fallback simple generator (`/api/math-problem/simple/route.ts`) for reliability
- **Syllabus Integration**: Created sophisticated PDF extraction system (`lib/syllabus-extractor.ts`) that automatically processes the official 2021 Primary Mathematics Syllabus P1-P6 document
- **Smart Caching**: Implemented intelligent caching system that extracts syllabus content once and reuses it for 7 days, with build-time optimizations
- **Context-Aware Generation**: AI prompts are dynamically constructed based on difficulty level, problem type, and syllabus standards to ensure educational alignment

**2. Comprehensive Dashboard System**
- **Real-time Analytics**: Built comprehensive dashboard (`app/dashboard/page.tsx`) with detailed statistics including accuracy, difficulty breakdown, problem type analysis, and recent activity
- **Dual Data Sources**: Implemented fallback system using localStorage when Supabase API is unavailable, ensuring seamless user experience
- **Progress Tracking**: Advanced streak tracking, best performance records, and detailed problem history with timestamps

**3. Advanced UI/UX Design**
- **Dark/Light Theme**: Implemented sophisticated theme system with `next-themes` and custom theme toggle component
- **Responsive Design**: Mobile-first approach with Tailwind CSS ensuring optimal experience across all devices
- **Loading States**: Beautiful, animated loading overlays with progress indicators and contextual messages
- **Accessibility**: Comprehensive accessibility features including ARIA labels, keyboard navigation, and semantic HTML

#### 🏗️ **Technical Architecture**

**1. Database Design**
- **Relational Schema**: Designed efficient PostgreSQL schema with proper foreign key relationships between `math_problem_sessions` and `math_problem_submissions`
- **Row Level Security**: Implemented RLS policies for anonymous access while maintaining data integrity
- **Performance Optimization**: Added strategic indexes for fast query performance on session lookups and time-based queries

**2. API Architecture**
- **RESTful Design**: Clean API endpoints following REST principles with proper HTTP status codes and error handling
- **Error Resilience**: Comprehensive error handling with fallback mechanisms and user-friendly error messages
- **Type Safety**: Full TypeScript implementation with proper type definitions and interfaces

**3. AI Integration**
- **Google Gemini Integration**: Leveraged Gemini 2.5 Flash model with optimized generation parameters (temperature: 0.7, topK: 40, topP: 0.95)
- **Prompt Engineering**: Sophisticated prompt construction that includes syllabus context, difficulty specifications, and educational objectives
- **Response Validation**: Robust JSON parsing with fallback handling for malformed AI responses

#### 🎨 **Design Decisions & Innovation**

**1. Educational Alignment**
- **Syllabus Compliance**: Every generated problem is aligned with official Singapore Primary Mathematics Syllabus standards
- **Learning Objectives**: Each problem includes specific learning objectives and syllabus topics for educational transparency
- **Age-Appropriate Content**: Problems are specifically designed for Primary 5 students (ages 10-11) with appropriate language and concepts

**2. User Experience Excellence**
- **Progressive Disclosure**: Hints are hidden by default and revealed on user request to encourage independent thinking
- **Immediate Feedback**: Real-time answer validation with AI-generated personalized feedback
- **Visual Learning**: Step-by-step solution explanations with clear formatting and educational context

**3. Performance Optimization**
- **Lazy Loading**: PDF extraction only occurs when needed, with intelligent caching to prevent repeated processing
- **Build-Time Optimization**: Special handling for production builds to avoid file system access issues
- **Efficient State Management**: Optimized React state management with proper cleanup and memory management

#### 🚀 **Advanced Features**

**1. Problem Customization**
- **Difficulty Levels**: Three distinct difficulty levels (Easy/Medium/Hard) with appropriate number ranges and complexity
- **Problem Types**: Support for mixed operations, addition, subtraction, multiplication, and division with type-specific generation
- **Dynamic Generation**: Each problem is uniquely generated based on user preferences and syllabus standards

**2. Feedback System**
- **AI-Powered Feedback**: Personalized feedback generated using Gemini AI based on the specific problem, user's answer, and correctness
- **Educational Guidance**: Feedback includes hints and step-by-step explanations to promote learning rather than just correction
- **Encouraging Tone**: Age-appropriate, supportive feedback that maintains student motivation

**3. Data Persistence**
- **Dual Storage**: Supabase for cloud persistence with localStorage fallback for offline functionality
- **Session Management**: Proper session tracking with unique IDs for each problem attempt
- **History Tracking**: Comprehensive problem history with detailed metadata for analytics

#### 🛡️ **Reliability & Error Handling**

**1. Graceful Degradation**
- **Fallback Systems**: Multiple fallback mechanisms ensure the application remains functional even when external services fail
- **Error Recovery**: Comprehensive error handling with user-friendly messages and automatic retry mechanisms
- **Offline Support**: localStorage-based functionality ensures core features work without internet connection

**2. Build Optimization**
- **Environment Detection**: Smart detection of build environments to optimize resource usage
- **Caching Strategy**: Intelligent caching reduces API calls and improves performance
- **Resource Management**: Efficient handling of large PDF files and AI responses

#### 🎓 **Educational Impact**

**1. Standards-Based Learning**
- **Official Syllabus Integration**: Direct integration with Singapore's official mathematics curriculum
- **Learning Objective Tracking**: Each problem is tagged with specific learning objectives for educational accountability
- **Progressive Difficulty**: Problems scale appropriately with student progress and ability

**2. Personalized Learning**
- **Adaptive Feedback**: AI-generated feedback tailored to each student's specific answer and learning needs
- **Progress Tracking**: Detailed analytics help students and educators understand learning patterns
- **Motivational Design**: Gamified elements like streaks and accuracy percentages encourage continued engagement

This implementation represents a comprehensive educational technology solution that successfully combines modern web development practices with educational best practices, creating an engaging and effective learning platform for Primary 5 mathematics students.

## Additional Features (Optional)

If you have time, consider adding:

- [/] Difficulty levels (Easy/Medium/Hard)
- [/] Problem history view
- [/] Score tracking
- [/] Different problem types (addition, subtraction, multiplication, division)
- [/] Hints system
- [/] Step-by-step solution explanations

---

Good luck with your assessment! 🎯
