import { extractSyllabusContent } from '../lib/syllabus-extractor'

const setupSyllabus = async () => {
  try {
    console.log('🚀 Setting up syllabus-based question generation...')
    
    const content = await extractSyllabusContent()
    
    console.log('✅ Syllabus content extracted successfully!')
    console.log(`📄 Content length: ${content.length} characters`)
    console.log('🎯 All future questions will now follow the official syllabus standards')
    
  } catch (error) {
    console.error('❌ Error setting up syllabus:', error)
    process.exit(1)
  }
}

setupSyllabus()
