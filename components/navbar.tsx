"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])


  // Close sidebar when pressing Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        closeSidebar()
      }
    }

    if (isSidebarOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isSidebarOpen])

  return (
    <>
      {/* Floating Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed z-40 p-3 bg-white dark:bg-purple-600 hover:bg-gray-100 dark:hover:bg-purple-700 text-black dark:text-white rounded-full shadow-lg transition-colors group border border-gray-200 dark:border-purple-500"
        style={{
          bottom: '1rem',
          left: '1rem'
        }}
        title="Open Menu"
      >
        {isSidebarOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-lg">🧮</span>
            <span className="text-sm font-semibold hidden group-hover:block transition-all duration-200 text-black dark:text-white">
              Math
            </span>
          </div>
        )}
      </button>


      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className="fixed top-0 left-0 h-full w-80 shadow-xl z-50"
        style={{
          backgroundColor: 'var(--sidebar-bg, white)',
          color: 'var(--sidebar-text, black)',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms ease-in-out, background-color 300ms, color 300ms'
        }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🧮</span>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Math Generator
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            <Link
              href="/"
              onClick={closeSidebar}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive('/')
                  ? 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">🎯</span>
              <span>Practice</span>
            </Link>
            
            <Link
              href="/dashboard"
              onClick={closeSidebar}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">📊</span>
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Theme Toggle in Sidebar */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
