import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '../../../lib/supabaseClient'
import { getSyllabusContent } from '../../../lib/syllabus-extractor'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { difficulty = 'medium', problemType = 'mixed' } = body

    // Get syllabus content automatically
    const syllabusContent = await getSyllabusContent()

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })

    // Create difficulty-specific instructions
    const difficultyInstructions = {
      easy: 'Use simple numbers (1-20) and single-step operations. Focus on basic addition and subtraction.',
      medium: 'Use moderate numbers (1-100) and may include 2-step operations. Mix of all four operations.',
      hard: 'Use larger numbers (1-1000) and multi-step problems. Complex scenarios with multiple operations.'
    }

    // Create problem type instructions
    const typeInstructions = {
      addition: 'Focus specifically on addition problems.',
      subtraction: 'Focus specifically on subtraction problems.',
      multiplication: 'Focus specifically on multiplication problems.',
      division: 'Focus specifically on division problems.',
      mixed: 'Include a variety of arithmetic operations as appropriate.'
    }

    // Create prompt for generating Primary 5 level math problems based on syllabus
    const prompt = `
You are an expert mathematics educator creating problems based on the official Primary Mathematics Syllabus.

SYLLABUS CONTENT:
${syllabusContent}

Based on the above syllabus standards and learning objectives, generate a math word problem suitable for Primary 5 students (ages 10-11) with these specifications:

- Difficulty: ${difficulty} - ${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]}
- Problem Type: ${problemType} - ${typeInstructions[problemType as keyof typeof typeInstructions]}
- MUST follow the exact standards, learning objectives, and question formats specified in the syllabus
- Use appropriate mathematical concepts and difficulty levels as outlined in the document
- Create real-world scenarios that children can relate to
- Ensure a clear, single correct answer
- Include a helpful hint for the student
- Provide a step-by-step solution explanation
- Align with the specific learning outcomes for Primary 5 level

Return your response as a JSON object with this exact format:
{
  "problem_text": "The word problem text here...",
  "final_answer": [the correct numerical answer],
  "hint": "A helpful hint to guide the student...",
  "step_explanation": "Step 1: [explanation]\nStep 2: [explanation]\nStep 3: [final answer]",
  "syllabus_topic": "The specific topic from the syllabus this question addresses",
  "learning_objective": "The learning objective this question helps achieve",
  "primary_level": "Primary 5"
}

Example:
{
  "problem_text": "Sarah has 24 stickers. She gives 8 stickers to her friend and buys 12 more stickers. How many stickers does Sarah have now?",
  "final_answer": 28,
  "hint": "Start with Sarah's original stickers, subtract what she gives away, then add what she buys.",
  "step_explanation": "Step 1: Sarah starts with 24 stickers\nStep 2: She gives away 8 stickers: 24 - 8 = 16 stickers\nStep 3: She buys 12 more stickers: 16 + 12 = 28 stickers\nFinal Answer: Sarah has 28 stickers now.",
  "syllabus_topic": "Number and Algebra - Four operations with whole numbers",
  "learning_objective": "Students should be able to solve multi-step word problems involving addition and subtraction",
  "primary_level": "Primary 5"
}

Generate a new problem now following the syllabus standards:`

    // Generate the math problem using Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    let problemData
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      problemData = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.error('Raw response:', text)
      throw new Error('Failed to parse AI response')
    }

    // Validate the response structure
    if (!problemData.problem_text || typeof problemData.final_answer !== 'number') {
      throw new Error('Invalid problem data structure')
    }

    // Save the problem to the database with syllabus context
    const { data: sessionData, error: sessionError } = await supabase
      .from('math_problem_sessions')
      .insert({
        problem_text: problemData.problem_text,
        correct_answer: problemData.final_answer,
        difficulty: difficulty,
        problem_type: problemType,
        hint: problemData.hint || '',
        step_explanation: problemData.step_explanation || '',
        syllabus_topic: problemData.syllabus_topic || '',
        learning_objective: problemData.learning_objective || '',
        source: 'syllabus_based'
      })
      .select()
      .single()

    if (sessionError) {
      console.error('Database error:', sessionError)
      throw new Error('Failed to save problem to database')
    }

    // Return the problem and session ID
    return NextResponse.json({
      success: true,
      problem: {
        problem_text: problemData.problem_text,
        final_answer: problemData.final_answer,
        hint: problemData.hint || '',
        step_explanation: problemData.step_explanation || '',
        syllabus_topic: problemData.syllabus_topic || '',
        learning_objective: problemData.learning_objective || '',
        primary_level: problemData.primary_level || 'Primary 5'
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
