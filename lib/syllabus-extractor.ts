import fs from 'fs'
import path from 'path'
import pdf from 'pdf-parse'

interface SyllabusContent {
  text: string
  extractedAt: string
  version: string
}

const SYLLABUS_CACHE_FILE = path.join(process.cwd(), 'data', 'syllabus-content.json')

export const extractSyllabusContent = async (): Promise<string> => {
  try {
    // Check if we already have cached content
    if (fs.existsSync(SYLLABUS_CACHE_FILE)) {
      const cachedContent: SyllabusContent = JSON.parse(
        fs.readFileSync(SYLLABUS_CACHE_FILE, 'utf-8')
      )
      
      // Check if cache is recent (less than 7 days old)
      const cacheDate = new Date(cachedContent.extractedAt)
      const now = new Date()
      const daysDiff = (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysDiff < 7) {
        console.log('Using cached syllabus content')
        return cachedContent.text
      }
    }

    // Extract from PDF
    const pdfPath = path.join(process.cwd(), 'resources', '2021 Primary Mathematics Syllabus P1 to P6_Updated Dec 2023.pdf')
    
    if (!fs.existsSync(pdfPath)) {
      throw new Error('Syllabus PDF not found in resources folder')
    }

    console.log('Extracting syllabus content from PDF...')
    const dataBuffer = fs.readFileSync(pdfPath)
    const data = await pdf(dataBuffer)
    
    // Clean and process the text
    const cleanText = data.text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .trim()

    // Cache the extracted content
    const syllabusContent: SyllabusContent = {
      text: cleanText,
      extractedAt: new Date().toISOString(),
      version: '2021_P1_to_P6_Updated_Dec_2023'
    }

    // Ensure data directory exists
    const dataDir = path.dirname(SYLLABUS_CACHE_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    fs.writeFileSync(SYLLABUS_CACHE_FILE, JSON.stringify(syllabusContent, null, 2))
    console.log('Syllabus content extracted and cached successfully')
    
    return cleanText

  } catch (error) {
    console.error('Error extracting syllabus content:', error)
    
    // Fallback to cached content if extraction fails
    if (fs.existsSync(SYLLABUS_CACHE_FILE)) {
      const cachedContent: SyllabusContent = JSON.parse(
        fs.readFileSync(SYLLABUS_CACHE_FILE, 'utf-8')
      )
      console.log('Using fallback cached syllabus content')
      return cachedContent.text
    }
    
    throw error
  }
}

export const getSyllabusContent = async (): Promise<string> => {
  // Check if we're in a build environment where file system access might be limited
  const isBuildTime = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV
  
  if (isBuildTime) {
    console.log('Build time detected, using fallback syllabus content')
    return getFallbackSyllabusContent()
  }
  
  try {
    return await extractSyllabusContent()
  } catch (error) {
    console.error('Failed to get syllabus content:', error)
    return getFallbackSyllabusContent()
  }
}

const getFallbackSyllabusContent = (): string => {
  return `
    PRIMARY MATHEMATICS SYLLABUS (P1 to P6)
    
    PRIMARY 5 (Ages 10-11) MATHEMATICS STANDARDS:
    
    NUMBER AND ALGEBRA:
    - Whole numbers up to 1,000,000
    - Four operations with whole numbers and decimals
    - Fractions: equivalent fractions, comparing and ordering
    - Decimals: place value, comparing and ordering
    - Percentage: basic concepts and calculations
    
    MEASUREMENT AND GEOMETRY:
    - Length, mass, volume, time, money
    - Area and perimeter of rectangles and squares
    - Volume of cubes and cuboids
    - Angles: types and measurement
    - 2D and 3D shapes
    
    STATISTICS:
    - Data collection and representation
    - Simple graphs and charts
    - Mean, mode, median (basic concepts)
    
    PROBLEM SOLVING:
    - Multi-step word problems
    - Real-world applications
    - Logical reasoning and mathematical thinking
    
    QUESTION FORMAT STANDARDS:
    - Clear, age-appropriate language
    - Real-world contexts relevant to children
    - Progressive difficulty levels
    - Multiple solution methods encouraged
    - Emphasis on understanding over memorization
    `
}
