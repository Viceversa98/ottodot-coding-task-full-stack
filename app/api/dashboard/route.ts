import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    // Fetch all submissions with their session data
    const { data: submissions, error } = await supabase
      .from('math_problem_submissions')
      .select(`
        *,
        math_problem_sessions (
          problem_text,
          difficulty,
          problem_type,
          correct_answer,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch dashboard data' },
        { status: 500 }
      )
    }

    // Transform the data to match the dashboard format
    const transformedData = submissions?.map(submission => ({
      problem: submission.math_problem_sessions.problem_text,
      userAnswer: submission.user_answer,
      correctAnswer: submission.math_problem_sessions.correct_answer,
      isCorrect: submission.is_correct,
      difficulty: submission.math_problem_sessions.difficulty || 'medium',
      problemType: submission.math_problem_sessions.problem_type || 'mixed',
      timestamp: submission.math_problem_sessions.created_at,
      feedback: submission.feedback_text
    })) || []

    return NextResponse.json({
      success: true,
      data: transformedData
    })

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data' 
      },
      { status: 500 }
    )
  }
}
