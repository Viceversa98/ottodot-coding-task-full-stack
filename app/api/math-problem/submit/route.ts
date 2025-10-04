import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { session_id, user_answer } = await request.json()

    if (!session_id || user_answer === undefined) {
      return NextResponse.json(
        { success: false, error: 'Session ID and user answer are required' },
        { status: 400 }
      )
    }

    // Get the original problem from the database
    const { data: sessionData, error: sessionError } = await supabase
      .from('math_problem_sessions')
      .select('*')
      .eq('id', session_id)
      .single()

    if (sessionError || !sessionData) {
      return NextResponse.json(
        { success: false, error: 'Problem session not found' },
        { status: 404 }
      )
    }

    const correctAnswer = sessionData.correct_answer
    const userAnswerNum = parseFloat(user_answer)
    const isCorrect = Math.abs(userAnswerNum - correctAnswer) < 0.01 // Allow for small floating point differences

    // Generate personalized feedback using Gemini AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const feedbackPrompt = `You are a helpful and encouraging math tutor for Primary 5 students (ages 10-11). Generate personalized feedback for a student's answer to a math word problem.

Problem: "${sessionData.problem_text}"
Correct Answer: ${correctAnswer}
Student's Answer: ${user_answer}
Is Correct: ${isCorrect}

Requirements for feedback:
- Be encouraging and supportive regardless of whether the answer is correct
- If correct: Congratulate them and briefly explain why their answer is right
- If incorrect: Be gentle and helpful, explain the correct approach without giving away the answer
- Use age-appropriate language
- Keep it concise (2-3 sentences)
- Be positive and motivating

Return only the feedback text, no additional formatting or explanations.`

    const result = await model.generateContent(feedbackPrompt)
    const response = await result.response
    const feedbackText = response.text().trim()

    // Save the submission to database
    const { data: submissionData, error: submissionError } = await supabase
      .from('math_problem_submissions')
      .insert({
        session_id: session_id,
        user_answer: userAnswerNum,
        is_correct: isCorrect,
        feedback_text: feedbackText
      })
      .select()
      .single()

    if (submissionError) {
      console.error('Database error:', submissionError)
      throw new Error('Failed to save submission to database')
    }

    return NextResponse.json({
      success: true,
      is_correct: isCorrect,
      feedback: feedbackText,
      correct_answer: correctAnswer
    })

  } catch (error) {
    console.error('Error processing submission:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process submission' 
      },
      { status: 500 }
    )
  }
}