'use client'

import { useState } from 'react'
import styles from './page.module.css'

interface QuestionData {
  analysis?: {
    skills?: string[]
    experience?: string
    leadership_indicators?: string[]
    gaps?: string[]
    inconsistencies?: string[]
    role_alignment?: {
      alignment_score?: number
      strengths?: string[]
      concerns?: string[]
      summary?: string
    } | string
  }
  questions?: {
    behavioral?: QuestionItem[]
    technical?: QuestionItem[]
    situational?: QuestionItem[]
    gap_probing?: QuestionItem[]
    role_specific?: QuestionItem[]
  }
  metadata?: {
    generated_at?: string
    candidate_name?: string
  }
}

interface QuestionItem {
  context?: string
  expected_topics?: string[]
  question: string
  follow_up?: string
}

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [questionData, setQuestionData] = useState<QuestionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
        setError('Please upload a PDF or DOCX file')
        return
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      setResumeFile(file)
      setFileName(file.name)
      setError('')
    }
  }

  const generateQuestions = async () => {
    if (!resumeFile) {
      setError('Please upload a resume file')
      return
    }

    setLoading(true)
    setError('')
    setQuestionData(null)

    try {
      const formData = new FormData()
      formData.append('resume_file', resumeFile)
      if (jobDescription) formData.append('job_description', jobDescription)
      formData.append('num_questions_per_category', '5')

      // Use deployed backend API (configurable via environment variable)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://iqg-api.fsgarage.in'
      const response = await fetch(`${apiUrl}/api/interview-questions/generate`, {
        method: 'POST',
        body: formData,
        // Note: In production, add Authorization header with JWT token if needed
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json() as any
      console.log('Interview questions API response:', result)
      
      if (result.success && result.data) {
        const raw = result.data

        const mapped: QuestionData = {
          analysis: raw.analysis
            ? {
                // Backend may return either `skills` or `key_skills`
                skills: raw.analysis.skills || raw.analysis.key_skills || [],
                // Backend uses `experience_gaps`
                gaps: raw.analysis.gaps || raw.analysis.experience_gaps || [],
                // Optional experience summary text if present
                experience:
                  raw.analysis.experience ||
                  raw.analysis.experience_summary ||
                  undefined,
                leadership_indicators: raw.analysis.leadership_indicators || [],
                inconsistencies: raw.analysis.inconsistencies || [],
                role_alignment: raw.analysis.role_alignment,
              }
            : undefined,
          questions: raw.questions || {},
          metadata: raw.metadata || {},
        }

        setQuestionData(mapped)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate questions. Please check if the backend is running.')
      console.error('Error generating questions:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Question copied to clipboard!')
  }

  const copyAllQuestions = () => {
    if (!questionData?.questions) return
    
    const copiedText: string[] = []
    let questionNumber = 1
    
    // Define the exact order to match the UI and PDF
    const categoryOrder: Array<{ key: 'technical' | 'behavioral' | 'situational' | 'gap_probing' | 'role_specific', title: string }> = [
      { key: 'technical', title: 'Technical Questions' },
      { key: 'behavioral', title: 'Behavioral Questions' },
      { key: 'situational', title: 'Situational Questions' },
      { key: 'gap_probing', title: 'Gap Probing Questions' },
      { key: 'role_specific', title: 'Role-Specific Questions' }
    ]
    
    // Iterate through categories in the defined order
    categoryOrder.forEach(({ key, title }) => {
      const category = questionData.questions?.[key]
      if (category && Array.isArray(category) && category.length > 0) {
        // Add category header
        copiedText.push(`${title}:`)
        copiedText.push('')
        
        // Add questions in order
        category.forEach((item) => {
          let questionText = ''
          if (typeof item === 'string') {
            questionText = item
          } else if (item && typeof item === 'object' && 'question' in item) {
            questionText = item.question
          }
          
          if (questionText) {
            copiedText.push(`${questionNumber}. ${questionText}`)
            questionNumber++
          }
        })
        
        // Add spacing between categories
        copiedText.push('')
      }
    })
    
    const finalText = copiedText.join('\n')
    navigator.clipboard.writeText(finalText)
    alert('All questions copied to clipboard!')
  }

  const getAllQuestions = (): string[] => {
    if (!questionData?.questions) return []
    
    const allQuestions: string[] = []
    
    // Define the exact order to match the UI and PDF
    const categoryOrder: Array<'technical' | 'behavioral' | 'situational' | 'gap_probing' | 'role_specific'> = [
      'technical',
      'behavioral',
      'situational',
      'gap_probing',
      'role_specific'
    ]
    
    // Iterate through categories in the defined order
    categoryOrder.forEach((key) => {
      const category = questionData.questions?.[key]
      if (category && Array.isArray(category)) {
        category.forEach((item) => {
          if (typeof item === 'string') {
            allQuestions.push(item)
          } else if (item && typeof item === 'object' && 'question' in item) {
            allQuestions.push(item.question)
          }
        })
      }
    })
    
    return allQuestions
  }

  const downloadQuestionsPdf = async () => {
    if (!questionData?.questions) return

    const allQuestions = getAllQuestions()
    if (allQuestions.length === 0) return

    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      let y = 20
      const lineHeight = 8
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 10
      const maxWidth = doc.internal.pageSize.getWidth() - margin * 2

      doc.setFont('Helvetica', 'bold')
      doc.setFontSize(14)
      doc.text('Interview Questions', margin, y)
      y += lineHeight * 1.5

      doc.setFont('Helvetica', 'normal')
      doc.setFontSize(11)

      const addWrappedText = (text: string) => {
        const lines = doc.splitTextToSize(text, maxWidth)
        for (const line of lines) {
          if (y + lineHeight > pageHeight - margin) {
            doc.addPage()
            y = margin
          }
          doc.text(line, margin, y)
          y += lineHeight
        }
      }

      let questionIndex = 1

      const appendCategory = (title: string, items?: QuestionItem[]) => {
        if (!items || items.length === 0) return

        if (y + lineHeight * 2 > pageHeight - margin) {
          doc.addPage()
          y = margin
        }

        doc.setFont('Helvetica', 'bold')
        doc.text(title, margin, y)
        y += lineHeight
        doc.setFont('Helvetica', 'normal')

        items.forEach((item) => {
          const text = item.question
          const context = item.context
          const topics = item.expected_topics
          const followUp = item.follow_up

          addWrappedText(`${questionIndex}. ${text}`)
          questionIndex++

          if (context) {
            addWrappedText(`  Context: ${context}`)
          }

          if (topics && topics.length > 0) {
            addWrappedText(`  Evaluation criteria: ${topics.join(', ')}`)
          }

          if (followUp) {
            addWrappedText(`  Follow-up: ${followUp}`)
          } else {
            addWrappedText(`  Follow-up: Can you provide a specific example from your experience?`)
          }

          y += lineHeight * 0.5
        })

        y += lineHeight
      }

      appendCategory('Technical Questions', questionData.questions.technical)
      appendCategory('Behavioral Questions', questionData.questions.behavioral)
      appendCategory('Situational Questions', questionData.questions.situational)
      appendCategory('Gap Probing Questions', questionData.questions.gap_probing)
      appendCategory('Role-Specific Questions', questionData.questions.role_specific)

      doc.save('interview-questions.pdf')
    } catch (err) {
      console.error('Failed to generate PDF', err)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI-Powered Interview Question Generator</h1>
        <p className={styles.subtitle}>Upload a resume to generate tailored interview questions based on skills, experience, and role alignment</p>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="resume" className={styles.label}>
            Resume File (PDF or DOCX) *
          </label>
          <div className={styles.fileUploadWrapper}>
            <input
              id="resume"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <label htmlFor="resume" className={styles.fileInputLabel}>
              {fileName || 'Choose file...'}
            </label>
            {fileName && (
              <button
                onClick={() => {
                  setResumeFile(null)
                  setFileName('')
                }}
                className={styles.removeFileButton}
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobDescription" className={styles.label}>
            Job Description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here for role-specific questions (optional)..."
            className={styles.textarea}
            rows={4}
          />
        </div>

        <button
          onClick={generateQuestions}
          disabled={loading || !resumeFile}
          className={styles.generateButton}
        >
          {loading ? 'Analyzing Resume & Generating Questions...' : 'Generate Interview Questions'}
        </button>

        {error && <div className={styles.error}>{error}</div>}
      </div>

      {questionData && (
        <div className={styles.resultsContainer}>
          {/* Analysis Section */}
          {questionData.analysis && (
            <div className={styles.analysisSection}>
              <h2 className={styles.sectionTitle}>Resume Analysis</h2>
              
              {questionData.analysis.experience && (
                <div className={styles.analysisCard}>
                  <h3 className={styles.analysisCardTitle}>Experience Summary</h3>
                  <p className={styles.analysisText}>{questionData.analysis.experience}</p>
                </div>
              )}

              {questionData.analysis.leadership_indicators && questionData.analysis.leadership_indicators.length > 0 && (
                <div className={styles.analysisCard}>
                  <h3 className={styles.analysisCardTitle}>Leadership Indicators</h3>
                  <ul className={styles.analysisList}>
                    {questionData.analysis.leadership_indicators.map((indicator, idx) => (
                      <li key={idx}>{indicator}</li>
                    ))}
                  </ul>
                </div>
              )}

              {questionData.analysis.gaps && questionData.analysis.gaps.length > 0 && (
                <div className={styles.analysisCard}>
                  <h3 className={styles.analysisCardTitle}>Potential Gaps to Probe</h3>
                  <ul className={styles.analysisList}>
                    {questionData.analysis.gaps.map((gap, idx) => (
                      <li key={idx}>{gap}</li>
                    ))}
                  </ul>
                </div>
              )}

              {questionData.analysis.role_alignment && (
                <div className={styles.analysisCard}>
                  <h3 className={styles.analysisCardTitle}>Role Alignment</h3>
                  {typeof questionData.analysis.role_alignment === 'string' ? (
                    <p className={styles.analysisText}>{questionData.analysis.role_alignment}</p>
                  ) : (
                    <>
                      {typeof questionData.analysis.role_alignment.alignment_score !== 'undefined' && (
                        <p className={styles.analysisText}>
                          <strong>Alignment score:</strong>{' '}
                          {questionData.analysis.role_alignment.alignment_score}
                        </p>
                      )}
                      {questionData.analysis.role_alignment.summary && (
                        <p className={styles.analysisText}>
                          {questionData.analysis.role_alignment.summary}
                        </p>
                      )}
                      {questionData.analysis.role_alignment.strengths &&
                        questionData.analysis.role_alignment.strengths.length > 0 && (
                          <div className={styles.analysisCard}>
                            <h3 className={styles.analysisCardTitle}>Strengths</h3>
                            <ul className={styles.analysisList}>
                              {questionData.analysis.role_alignment.strengths.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      {questionData.analysis.role_alignment.concerns &&
                        questionData.analysis.role_alignment.concerns.length > 0 && (
                          <div className={styles.analysisCard}>
                            <h3 className={styles.analysisCardTitle}>Concerns</h3>
                            <ul className={styles.analysisList}>
                              {questionData.analysis.role_alignment.concerns.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Questions Section */}
          {questionData.questions && (
            <div className={styles.questionsSection}>
              <div className={styles.resultsHeader}>
                <h2 className={styles.resultsTitle}>Generated Interview Questions</h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {getAllQuestions().length > 0 && (
                    <>
                      <button onClick={copyAllQuestions} className={styles.copyAllButton}>
                        Copy All Questions
                      </button>
                      <button onClick={downloadQuestionsPdf} className={styles.copyAllButton}>
                        Download PDF
                      </button>
                    </>
                  )}
                </div>
              </div>

              {questionData.questions.technical && questionData.questions.technical.length > 0 && (
                <div className={styles.questionCategory}>
                  <h3 className={styles.categoryTitle}>Technical Questions</h3>
                  <div className={styles.questionsList}>
                    {questionData.questions.technical.map((question, index) => (
                      <div key={index} className={styles.questionCard}>
                        <div className={styles.questionNumber}>{index + 1}</div>
                        <div className={styles.questionText}>
                          {'question' in question ? question.question : String(question)}
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard('question' in question ? question.question : String(question))
                          }
                          className={styles.copyButton}
                          title="Copy question"
                        >
                          📋
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {questionData.questions.behavioral && questionData.questions.behavioral.length > 0 && (
                <div className={styles.questionCategory}>
                  <h3 className={styles.categoryTitle}>Behavioral Questions</h3>
                  <div className={styles.questionsList}>
                    {questionData.questions.behavioral.map((question, index) => (
                      <div key={index} className={styles.questionCard}>
                        <div className={styles.questionNumber}>{index + 1}</div>
                        <div className={styles.questionText}>
                          {'question' in question ? question.question : String(question)}
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard('question' in question ? question.question : String(question))
                          }
                          className={styles.copyButton}
                          title="Copy question"
                        >
                          📋
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {questionData.questions.situational && questionData.questions.situational.length > 0 && (
                <div className={styles.questionCategory}>
                  <h3 className={styles.categoryTitle}>Situational Questions</h3>
                  <div className={styles.questionsList}>
                    {questionData.questions.situational.map((question, index) => (
                      <div key={index} className={styles.questionCard}>
                        <div className={styles.questionNumber}>{index + 1}</div>
                        <div className={styles.questionText}>
                          {'question' in question ? question.question : String(question)}
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard('question' in question ? question.question : String(question))
                          }
                          className={styles.copyButton}
                          title="Copy question"
                        >
                          📋
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {questionData.questions.gap_probing && questionData.questions.gap_probing.length > 0 && (
                <div className={styles.questionCategory}>
                  <h3 className={styles.categoryTitle}>Gap Probing Questions</h3>
                  <div className={styles.questionsList}>
                    {questionData.questions.gap_probing.map((question, index) => (
                      <div key={index} className={styles.questionCard}>
                        <div className={styles.questionNumber}>{index + 1}</div>
                        <div className={styles.questionText}>
                          {'question' in question ? question.question : String(question)}
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard('question' in question ? question.question : String(question))
                          }
                          className={styles.copyButton}
                          title="Copy question"
                        >
                          📋
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {questionData.questions.role_specific && questionData.questions.role_specific.length > 0 && (
                <div className={styles.questionCategory}>
                  <h3 className={styles.categoryTitle}>Role-Specific Questions</h3>
                  <div className={styles.questionsList}>
                    {questionData.questions.role_specific.map((question, index) => (
                      <div key={index} className={styles.questionCard}>
                        <div className={styles.questionNumber}>{index + 1}</div>
                        <div className={styles.questionText}>
                          {'question' in question ? question.question : String(question)}
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard('question' in question ? question.question : String(question))
                          }
                          className={styles.copyButton}
                          title="Copy question"
                        >
                          📋
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

