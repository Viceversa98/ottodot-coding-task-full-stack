import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '../../../../lib/supabaseClient'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { session_id, user_answer } = await request.json()

    // Validate input
    if (!session_id || user_answer === undefined || user_answer === null) {
      return NextResponse.json(
        { success: false, error: 'Missing session_id or user_answer' },
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

    // Check if the answer is correct
    const isCorrect = parseFloat(user_answer) === sessionData.correct_answer

    // Generate personalized feedback using AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const feedbackPrompt = `
You are a helpful math tutor for Primary 5 students (ages 10-11). Generate personalized feedback for a student's answer to a math word problem.

Problem: "${sessionData.problem_text}"
Correct Answer: ${sessionData.correct_answer}
Student's Answer: ${user_answer}
Is Correct: ${isCorrect}

Generate encouraging, educational feedback that:
- Acknowledges the student's effort
- If correct: Celebrates their success and explains why their answer is right
- If incorrect: Gently explains the mistake and guides them toward the correct approach
- Uses age-appropriate language
- Is supportive and motivating
- Keeps the feedback concise (2-3 sentences)

Return only the feedback text, no additional formatting or explanations.`

    const result = await model.generateContent(feedbackPrompt)
    const response = await result.response
    const feedbackText = response.text().trim()

    // Save the submission to the database
    const { data: submissionData, error: submissionError } = await supabase
      .from('math_problem_submissions')
      .insert({
        session_id: session_id,
        user_answer: parseFloat(user_answer),
        is_correct: isCorrect,
        feedback_text: feedbackText
      })
      .select()
      .single()

    if (submissionError) {
      console.error('Database error:', submissionError)
      throw new Error('Failed to save submission to database')
    }

    // Return the feedback and correctness
    return NextResponse.json({
      success: true,
      is_correct: isCorrect,
      feedback: feedbackText,
      correct_answer: sessionData.correct_answer,
      hint: sessionData.hint || '',
      step_explanation: sessionData.step_explanation || ''
    })

  } catch (error) {
    console.error('Error processing answer submission:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process submission' 
      },
      { status: 500 }
    )
  }
}
