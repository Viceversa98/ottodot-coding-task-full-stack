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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Generate math problem using Gemini AI
    const prompt = `Generate a math word problem suitable for Primary 5 students (ages 10-11). The problem should involve basic arithmetic operations (addition, subtraction, multiplication, or division) and be engaging and relatable to children.

Requirements:
- The problem should be a word problem with a clear scenario
- Use numbers that are appropriate for Primary 5 level (typically 1-1000 range)
- The problem should have a single correct numerical answer
- Make it interesting and relatable to children's experiences

Return your response in the following JSON format:
{
  "problem_text": "The actual word problem text here",
  "final_answer": [the correct numerical answer]
}

Example:
{
  "problem_text": "Sarah has 24 stickers. She gives 8 stickers to her friend Emma and buys 12 more stickers at the store. How many stickers does Sarah have now?",
  "final_answer": 28
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the AI response
    let problemData
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        problemData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.error('Raw response:', text)
      throw new Error('Failed to parse AI response')
    }

    // Validate the response structure
    if (!problemData.problem_text || typeof problemData.final_answer !== 'number') {
      throw new Error('Invalid problem data structure')
    }

    // Save to database
    const { data: sessionData, error: sessionError } = await supabase
      .from('math_problem_sessions')
      .insert({
        problem_text: problemData.problem_text,
        correct_answer: problemData.final_answer
      })
      .select()
      .single()

    if (sessionError) {
      console.error('Database error:', sessionError)
      throw new Error('Failed to save problem to database')
    }

    return NextResponse.json({
      success: true,
      problem: {
        problem_text: problemData.problem_text,
        final_answer: problemData.final_answer
      },
      session_id: sessionData.id
    })

  } catch (error) {
    console.error('Error generating math problem:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate problem' 
      },
      { status: 500 }
    )
  }
}