import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { difficulty = 'medium', problemType = 'mixed' } = body

    // Simple fallback math problem generator without external dependencies
    const problems = {
      easy: {
        addition: {
          problem_text: "Sarah has 5 apples. She buys 3 more apples. How many apples does she have in total?",
          final_answer: 8,
          hint: "Start with Sarah's original apples and add the new ones.",
          step_explanation: "Step 1: Sarah starts with 5 apples\nStep 2: She buys 3 more apples\nStep 3: 5 + 3 = 8 apples\nFinal Answer: Sarah has 8 apples in total.",
          syllabus_topic: "Number and Algebra - Addition within 20",
          learning_objective: "Students should be able to solve simple addition word problems",
          primary_level: "Primary 1"
        },
        subtraction: {
          problem_text: "Tom has 12 stickers. He gives away 4 stickers to his friend. How many stickers does Tom have left?",
          final_answer: 8,
          hint: "Start with Tom's original stickers and subtract what he gives away.",
          step_explanation: "Step 1: Tom starts with 12 stickers\nStep 2: He gives away 4 stickers\nStep 3: 12 - 4 = 8 stickers\nFinal Answer: Tom has 8 stickers left.",
          syllabus_topic: "Number and Algebra - Subtraction within 20",
          learning_objective: "Students should be able to solve simple subtraction word problems",
          primary_level: "Primary 1"
        }
      },
      medium: {
        addition: {
          problem_text: "A bakery sold 45 cakes in the morning and 38 cakes in the afternoon. How many cakes did they sell in total?",
          final_answer: 83,
          hint: "Add the cakes sold in the morning and afternoon.",
          step_explanation: "Step 1: Morning sales: 45 cakes\nStep 2: Afternoon sales: 38 cakes\nStep 3: 45 + 38 = 83 cakes\nFinal Answer: The bakery sold 83 cakes in total.",
          syllabus_topic: "Number and Algebra - Addition within 100",
          learning_objective: "Students should be able to solve addition problems with regrouping",
          primary_level: "Primary 2"
        },
        subtraction: {
          problem_text: "A library has 156 books. They lent out 67 books to students. How many books are left in the library?",
          final_answer: 89,
          hint: "Subtract the lent books from the total books.",
          step_explanation: "Step 1: Total books: 156\nStep 2: Books lent out: 67\nStep 3: 156 - 67 = 89 books\nFinal Answer: There are 89 books left in the library.",
          syllabus_topic: "Number and Algebra - Subtraction within 200",
          learning_objective: "Students should be able to solve subtraction problems with regrouping",
          primary_level: "Primary 3"
        }
      },
      hard: {
        mixed: {
          problem_text: "Emma has 250 marbles. She gives 45 marbles to her brother and buys 78 more marbles. Then she loses 23 marbles. How many marbles does Emma have now?",
          final_answer: 260,
          hint: "Start with Emma's original marbles, subtract what she gives away, add what she buys, then subtract what she loses.",
          step_explanation: "Step 1: Emma starts with 250 marbles\nStep 2: She gives away 45 marbles: 250 - 45 = 205 marbles\nStep 3: She buys 78 more marbles: 205 + 78 = 283 marbles\nStep 4: She loses 23 marbles: 283 - 23 = 260 marbles\nFinal Answer: Emma has 260 marbles now.",
          syllabus_topic: "Number and Algebra - Multi-step operations with whole numbers",
          learning_objective: "Students should be able to solve complex multi-step word problems",
          primary_level: "Primary 5"
        }
      }
    }

    // Get a random problem based on difficulty and type
    const difficultyProblems = problems[difficulty as keyof typeof problems] || problems.medium
    const problem = difficultyProblems[problemType as keyof typeof difficultyProblems] || difficultyProblems.addition || difficultyProblems.mixed

    return NextResponse.json({
      success: true,
      problem: problem,
      session_id: Math.floor(Math.random() * 1000000) // Simple session ID
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
