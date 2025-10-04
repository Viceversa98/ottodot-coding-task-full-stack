# Syllabus-Based Math Problem Generator Setup

This system automatically extracts content from the `2021 Primary Mathematics Syllabus P1 to P6_Updated Dec 2023.pdf` file and uses it to generate questions that follow official syllabus standards.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Migration
Execute the following SQL in your Supabase SQL editor:
```sql
-- Add new columns to math_problem_sessions table for syllabus support
ALTER TABLE math_problem_sessions 
ADD COLUMN IF NOT EXISTS syllabus_topic TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS learning_objective TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS primary_level VARCHAR(20) DEFAULT 'Primary 5',
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'syllabus_based';

-- Update the table comment
COMMENT ON TABLE math_problem_sessions IS 'Stores math problem sessions including syllabus-based questions';
COMMENT ON COLUMN math_problem_sessions.syllabus_topic IS 'The specific topic from the syllabus this question addresses';
COMMENT ON COLUMN math_problem_sessions.learning_objective IS 'The learning objective this question helps achieve';
COMMENT ON COLUMN math_problem_sessions.primary_level IS 'The primary level this question is designed for';
COMMENT ON COLUMN math_problem_sessions.source IS 'Source of the problem: syllabus_based, generated, etc.';
```

### 3. Extract Syllabus Content
```bash
npm run setup-syllabus
```

### 4. Start Development Server
```bash
npm run dev
```

## 🎯 How It Works

1. **Automatic PDF Processing**: The system extracts text from your syllabus PDF and caches it
2. **Syllabus-Based Generation**: Every question is generated using the official syllabus standards
3. **Learning Objectives**: Each question includes specific syllabus topics and learning objectives
4. **Cached Performance**: Syllabus content is cached for fast access (refreshed weekly)

## 📁 File Structure

```
├── lib/
│   └── syllabus-extractor.ts     # PDF extraction and caching
├── scripts/
│   └── setup-syllabus.ts         # Initial setup script
├── data/
│   └── syllabus-content.json     # Cached syllabus content (auto-generated)
├── resources/
│   └── 2021 Primary Mathematics Syllabus P1 to P6_Updated Dec 2023.pdf
└── database_migration.sql        # Database schema updates
```

## 🔧 Configuration

The system uses the following environment variables:
- `GOOGLE_API_KEY`: Your Google Gemini API key

## ✨ Features

- **Automatic Syllabus Integration**: No manual upload required
- **Standards-Compliant Questions**: All questions follow official syllabus guidelines
- **Rich Context**: Shows syllabus topics and learning objectives
- **Fallback Support**: Uses cached content if PDF extraction fails
- **Performance Optimized**: Content is cached and refreshed automatically

## 🎓 Generated Question Format

Each question now includes:
- **Problem Text**: The actual math problem
- **Syllabus Topic**: Specific topic from the syllabus
- **Learning Objective**: What the student should achieve
- **Primary Level**: The target grade level
- **Hint**: Helpful guidance for students
- **Step-by-Step Solution**: Detailed explanation

## 🔄 Updating Syllabus

To update the syllabus content:
1. Replace the PDF file in the `resources/` folder
2. Run `npm run setup-syllabus` to extract new content
3. The system will automatically use the updated syllabus

## 🐛 Troubleshooting

**PDF Not Found Error**:
- Ensure the PDF file is in the `resources/` folder
- Check the exact filename matches: `2021 Primary Mathematics Syllabus P1 to P6_Updated Dec 2023.pdf`

**Extraction Fails**:
- The system will use cached content if available
- Check file permissions and PDF format
- Ensure `pdf-parse` package is installed

**Database Errors**:
- Run the migration SQL in your Supabase dashboard
- Check your database connection and permissions

## 📊 Dashboard Integration

The syllabus information is automatically saved to your dashboard, allowing you to track:
- Which syllabus topics students are practicing
- Learning objectives being addressed
- Progress across different Primary levels

All questions generated will now follow the official Primary Mathematics Syllabus standards! 🎉
