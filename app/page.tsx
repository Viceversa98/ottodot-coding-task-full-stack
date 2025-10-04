'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'

interface MathProblem {
  problem_text: string
  final_answer: number
  hint?: string
  step_explanation?: string
  syllabus_topic?: string
  learning_objective?: string
  primary_level?: string
}

export default function Home() {
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [difficulty, setDifficulty] = useState('medium')
  const [problemType, setProblemType] = useState('mixed')
  const [score, setScore] = useState(0)
  const [totalProblems, setTotalProblems] = useState(0)
  const [problemHistory, setProblemHistory] = useState<any[]>([])
  const [showHint, setShowHint] = useState(false)
  const [hint, setHint] = useState('')
  const [stepExplanation, setStepExplanation] = useState('')

  const generateProblem = async () => {
    setIsGenerating(true)
    setIsLoading(true)
    setLoadingMessage('Creating your math problem...')
    setFeedback('')
    setIsCorrect(null)
    setUserAnswer('')
    setProblem(null)
    setShowHint(false)
    setHint('')
    setStepExplanation('')
    
    try {
      setTimeout(() => setLoadingMessage('Asking AI to generate a problem...'), 500)
      setTimeout(() => setLoadingMessage('Saving to database...'), 1500)
      
      const response = await fetch('/api/math-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          difficulty,
          problemType
        }),
      })

      const data = await response.json()

      if (data.success) {
        setLoadingMessage('Problem ready!')
        setTimeout(() => {
          setProblem(data.problem)
          setSessionId(data.session_id)
        }, 300)
      } else {
        console.error('Error generating problem:', data.error)
        setLoadingMessage('Failed to generate problem')
        setTimeout(() => {
          alert('Failed to generate problem. Please try again.')
        }, 1000)
      }
    } catch (error) {
      console.error('Error generating problem:', error)
      setLoadingMessage('Connection error')
      setTimeout(() => {
        alert('Failed to generate problem. Please check your connection and try again.')
      }, 1000)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
        setIsGenerating(false)
        setLoadingMessage('')
      }, 1000)
    }
  }

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sessionId || !userAnswer) {
      alert('Please generate a problem first and enter an answer.')
      return
    }

    setIsSubmitting(true)
    setIsLoading(true)
    setLoadingMessage('Checking your answer...')
    
    try {
      setTimeout(() => setLoadingMessage('Comparing with correct answer...'), 500)
      setTimeout(() => setLoadingMessage('Generating personalized feedback...'), 1000)
      
      const response = await fetch('/api/math-problem/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_answer: parseFloat(userAnswer)
        }),
      })

      const data = await response.json()

      if (data.success) {
        setLoadingMessage('Feedback ready!')
        setTimeout(() => {
          setIsCorrect(data.is_correct)
          setFeedback(data.feedback)
          setHint(data.hint || '')
          setStepExplanation(data.step_explanation || '')
          
          // Update score and history
          if (data.is_correct) {
            setScore(prev => prev + 1)
          }
          setTotalProblems(prev => prev + 1)
          
          // Add to history
          if (problem) {
            const historyItem = {
              problem: problem.problem_text,
              userAnswer: userAnswer,
              correctAnswer: problem.final_answer,
              isCorrect: data.is_correct,
              feedback: data.feedback,
              difficulty,
              problemType,
              timestamp: new Date().toISOString(),
              syllabus_topic: problem.syllabus_topic,
              learning_objective: problem.learning_objective,
              primary_level: problem.primary_level
            }
            
            setProblemHistory(prev => [...prev, historyItem])
            
            // Save to localStorage for dashboard
            const existingHistory = JSON.parse(localStorage.getItem('mathProblemHistory') || '[]')
            const updatedHistory = [...existingHistory, historyItem]
            localStorage.setItem('mathProblemHistory', JSON.stringify(updatedHistory))
          }
        }, 300)
      } else {
        console.error('Error submitting answer:', data.error)
        setLoadingMessage('Failed to process answer')
        setTimeout(() => {
          alert('Failed to submit answer. Please try again.')
        }, 1000)
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      setLoadingMessage('Connection error')
      setTimeout(() => {
        alert('Failed to submit answer. Please check your connection and try again.')
      }, 1000)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
        setIsSubmitting(false)
        setLoadingMessage('')
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-10 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Syllabus-Based Math Generator</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Practice Primary 5 mathematics with questions that follow official syllabus standards</p>
            <div className="mt-2 inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
              <span className="text-blue-600 dark:text-blue-400 mr-2">📚</span>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Powered by 2021 Primary Mathematics Syllabus P1-P6
              </span>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md shadow-2xl border-2 border-blue-500">
              <div className="text-center">
                {/* Large, Visible Spinner */}
                <div className="relative mx-auto mb-6 w-20 h-20">
                  <div className="w-full h-full border-6 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  {isGenerating ? 'Generating Problem' : 'Processing Answer'}
                </h3>
                
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4 font-medium">
                  {loadingMessage}
                </p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                  <div className="bg-blue-600 h-3 rounded-full animate-pulse w-3/4"></div>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Please wait while we process your request...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Problem Settings */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg border border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Problem Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Difficulty Level:
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Problem Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Problem Type:
              </label>
              <select
                value={problemType}
                onChange={(e) => setProblemType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="mixed">Mixed Operations</option>
                <option value="addition">Addition</option>
                <option value="subtraction">Subtraction</option>
                <option value="multiplication">Multiplication</option>
                <option value="division">Division</option>
              </select>
            </div>
          </div>

          {/* Score Display */}
          <div className="flex justify-between items-center mb-4 p-3 bg-white dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalProblems}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totalProblems > 0 ? Math.round((score / totalProblems) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>
          </div>

          {/* Generate Problem Button */}
          <button
            onClick={generateProblem}
            disabled={isLoading}
            className="w-full bg-purple-200 hover:bg-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 text-black dark:text-white font-bold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 min-h-[56px] text-lg shadow-lg"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-black dark:border-white border-t-transparent"></div>
                <span>{loadingMessage}</span>
              </div>
            ) : (
              'Generate New Problem'
            )}
          </button>
        </div>

        {/* Problem Display */}
        {problem && (
          <div className="bg-blue-100 dark:bg-blue-800 rounded-xl p-6 mb-6 shadow-lg border border-blue-200 dark:border-blue-600">
            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-100 mb-4">
              Math Problem
            </h2>

            {/* Syllabus Information */}
            {(problem.syllabus_topic || problem.learning_objective || problem.primary_level) && (
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border border-blue-200 dark:border-blue-700 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-blue-600 dark:text-blue-400">📚</span>
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                    Syllabus-Aligned Question
                  </span>
                </div>
                {problem.syllabus_topic && (
                  <div className="mb-1">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                      Topic: {problem.syllabus_topic}
                    </span>
                  </div>
                )}
                {problem.learning_objective && (
                  <div className="mb-1">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                      Learning Objective: {problem.learning_objective}
                    </span>
                  </div>
                )}
                {problem.primary_level && (
                  <div>
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                      Level: {problem.primary_level}
                    </span>
                  </div>
                )}
              </div>
            )}

            <p className="text-lg text-blue-700 dark:text-blue-200 mb-6">
              {problem.problem_text}
            </p>
            
            {/* Hint Button */}
            {hint && !showHint && (
              <div className="mb-4">
                <button
                  onClick={() => setShowHint(true)}
                  className="bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-black dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  💡 Show Hint
                </button>
              </div>
            )}

            {/* Hint Display */}
            {showHint && hint && (
              <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-700 rounded-lg border border-yellow-200 dark:border-yellow-500">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-50 mb-2">💡 Hint:</h3>
                <p className="text-yellow-700 dark:text-yellow-50">{hint}</p>
              </div>
            )}
            
            <form onSubmit={submitAnswer} className="space-y-6">
              <div>
                <label htmlFor="answer" className="block text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                  Your Answer:
                </label>
                <input
                  type="number"
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[56px]"
                  placeholder="Enter your numerical answer"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!userAnswer || isLoading}
                className="w-full bg-green-200 hover:bg-green-300 dark:bg-green-600 dark:hover:bg-green-700 text-black dark:text-white font-bold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 min-h-[56px] text-lg border-2 border-green-500 hover:border-green-600 shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black dark:border-white border-t-transparent"></div>
                    <span>{loadingMessage}</span>
                  </div>
                ) : (
                  'Submit Answer'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Feedback Display */}
        {feedback && (
          <div className={`rounded-xl p-6 shadow-lg border ${
            isCorrect 
              ? 'bg-green-100 dark:bg-green-700 border-green-200 dark:border-green-500' 
              : 'bg-yellow-100 dark:bg-yellow-700 border-yellow-200 dark:border-yellow-500'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">
                {isCorrect ? '✅' : '❌'}
              </div>
              <h2 className={`text-xl font-bold ${
                isCorrect 
                  ? 'text-green-800 dark:text-green-50' 
                  : 'text-yellow-800 dark:text-yellow-50'
              }`}>
                {isCorrect ? 'Excellent Work!' : 'Keep Trying!'}
              </h2>
            </div>
            <p className={`text-base ${
              isCorrect 
                ? 'text-green-700 dark:text-green-50' 
                : 'text-yellow-700 dark:text-yellow-50'
            }`}>
              {feedback}
            </p>

            {/* Step-by-Step Explanation */}
            {stepExplanation && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">📚 Step-by-Step Solution:</h3>
                <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">{stepExplanation}</p>
              </div>
            )}
          </div>
        )}

        {/* Problem History */}
        {problemHistory.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              📊 Problem History
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {problemHistory.slice(-5).reverse().map((item, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  item.isCorrect 
                    ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-600' 
                    : 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-600'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-semibold ${
                      item.isCorrect 
                        ? 'text-green-800 dark:text-green-200' 
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      {item.isCorrect ? '✅' : '❌'} {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)} {item.problemType}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{item.problem}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Your answer: {item.userAnswer} | Correct: {item.correctAnswer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}