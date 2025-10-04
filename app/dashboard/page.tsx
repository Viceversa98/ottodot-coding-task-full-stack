'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'

interface DashboardStats {
  totalProblems: number
  correctAnswers: number
  accuracy: number
  difficultyBreakdown: {
    easy: { total: number; correct: number }
    medium: { total: number; correct: number }
    hard: { total: number; correct: number }
  }
  problemTypeBreakdown: {
    addition: { total: number; correct: number }
    subtraction: { total: number; correct: number }
    multiplication: { total: number; correct: number }
    division: { total: number; correct: number }
    mixed: { total: number; correct: number }
  }
  recentProblems: Array<{
    problem: string
    userAnswer: number
    correctAnswer: number
    isCorrect: boolean
    difficulty: string
    problemType: string
    timestamp: string
  }>
  streak: number
  bestStreak: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProblems: 0,
    correctAnswers: 0,
    accuracy: 0,
    difficultyBreakdown: {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      hard: { total: 0, correct: 0 }
    },
    problemTypeBreakdown: {
      addition: { total: 0, correct: 0 },
      subtraction: { total: 0, correct: 0 },
      multiplication: { total: 0, correct: 0 },
      division: { total: 0, correct: 0 },
      mixed: { total: 0, correct: 0 }
    },
    recentProblems: [],
    streak: 0,
    bestStreak: 0
  })

  useEffect(() => {
    // Load stats from Supabase API
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        const result = await response.json()
        
        if (result.success && result.data) {
          calculateStats(result.data)
        } else {
          // Fallback to localStorage if API fails
          const savedHistory = localStorage.getItem('mathProblemHistory')
          if (savedHistory) {
            const history = JSON.parse(savedHistory)
            calculateStats(history)
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Fallback to localStorage if API fails
        const savedHistory = localStorage.getItem('mathProblemHistory')
        if (savedHistory) {
          const history = JSON.parse(savedHistory)
          calculateStats(history)
        }
      }
    }

    fetchDashboardData()
  }, [])

  const calculateStats = (history: any[]) => {
    const totalProblems = history.length
    const correctAnswers = history.filter(item => item.isCorrect).length
    const accuracy = totalProblems > 0 ? Math.round((correctAnswers / totalProblems) * 100) : 0

    // Calculate difficulty breakdown
    const difficultyBreakdown = {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      hard: { total: 0, correct: 0 }
    }

    // Calculate problem type breakdown
    const problemTypeBreakdown = {
      addition: { total: 0, correct: 0 },
      subtraction: { total: 0, correct: 0 },
      multiplication: { total: 0, correct: 0 },
      division: { total: 0, correct: 0 },
      mixed: { total: 0, correct: 0 }
    }

    history.forEach(item => {
      // Difficulty breakdown
      if (difficultyBreakdown[item.difficulty as keyof typeof difficultyBreakdown]) {
        difficultyBreakdown[item.difficulty as keyof typeof difficultyBreakdown].total++
        if (item.isCorrect) {
          difficultyBreakdown[item.difficulty as keyof typeof difficultyBreakdown].correct++
        }
      }

      // Problem type breakdown
      if (problemTypeBreakdown[item.problemType as keyof typeof problemTypeBreakdown]) {
        problemTypeBreakdown[item.problemType as keyof typeof problemTypeBreakdown].total++
        if (item.isCorrect) {
          problemTypeBreakdown[item.problemType as keyof typeof problemTypeBreakdown].correct++
        }
      }
    })

    // Calculate streaks
    let currentStreak = 0
    let bestStreak = 0
    let tempStreak = 0

    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].isCorrect) {
        tempStreak++
        if (i === history.length - 1) {
          currentStreak = tempStreak
        }
        bestStreak = Math.max(bestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    setStats({
      totalProblems,
      correctAnswers,
      accuracy,
      difficultyBreakdown,
      problemTypeBreakdown,
      recentProblems: history.slice(-10).reverse(),
      streak: currentStreak,
      bestStreak
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 dark:text-green-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'hard': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢'
      case 'medium': return '🟡'
      case 'hard': return '🔴'
      default: return '⚪'
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            📊 Your Progress Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track your math learning journey and see how you&apos;re improving!
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Problems */}
          <div className="bg-blue-100 dark:bg-blue-800 rounded-xl p-6 shadow-lg border border-blue-200 dark:border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-300 text-sm font-medium">Total Problems</p>
                <p className="text-3xl font-bold text-blue-800 dark:text-blue-100">{stats.totalProblems}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          {/* Correct Answers */}
          <div className="bg-green-100 dark:bg-green-800 rounded-xl p-6 shadow-lg border border-green-200 dark:border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-300 text-sm font-medium">Correct Answers</p>
                <p className="text-3xl font-bold text-green-800 dark:text-green-100">{stats.correctAnswers}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-purple-100 dark:bg-purple-800 rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">Accuracy</p>
                <p className="text-3xl font-bold text-purple-800 dark:text-purple-100">{stats.accuracy}%</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-orange-100 dark:bg-orange-800 rounded-xl p-6 shadow-lg border border-orange-200 dark:border-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 dark:text-orange-300 text-sm font-medium">Current Streak</p>
                <p className="text-3xl font-bold text-orange-800 dark:text-orange-100">{stats.streak}</p>
              </div>
              <div className="text-4xl">🔥</div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Difficulty Breakdown */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              📈 Difficulty Performance
            </h2>
            <div className="space-y-4">
              {Object.entries(stats.difficultyBreakdown).map(([difficulty, data]) => {
                const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
                return (
                  <div key={difficulty} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getDifficultyIcon(difficulty)}</span>
                      <span className="font-semibold capitalize text-gray-800 dark:text-gray-100">
                        {difficulty}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {data.correct}/{data.total} correct
                      </div>
                      <div className={`font-bold ${getDifficultyColor(difficulty)}`}>
                        {accuracy}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Problem Type Breakdown */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              🧮 Problem Type Performance
            </h2>
            <div className="space-y-4">
              {Object.entries(stats.problemTypeBreakdown).map(([type, data]) => {
                const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
                const icons = {
                  addition: '➕',
                  subtraction: '➖',
                  multiplication: '✖️',
                  division: '➗',
                  mixed: '🔀'
                }
                return (
                  <div key={type} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{icons[type as keyof typeof icons]}</span>
                      <span className="font-semibold capitalize text-gray-800 dark:text-gray-100">
                        {type}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {data.correct}/{data.total} correct
                      </div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">
                        {accuracy}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Problems */}
        {stats.recentProblems.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              📋 Recent Problems
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.recentProblems.map((item, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  item.isCorrect 
                    ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-600' 
                    : 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-600'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{item.isCorrect ? '✅' : '❌'}</span>
                      <span className={`text-sm font-semibold ${getDifficultyColor(item.difficulty)}`}>
                        {getDifficultyIcon(item.difficulty)} {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.problemType}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.problem}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Your answer: {item.userAnswer} | Correct: {item.correctAnswer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats.totalProblems === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              No problems solved yet!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start practicing to see your progress here.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              🎯 Start Practicing
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
