"use client"

import { useParams, useNavigate } from "react-router"
import  {useGetResults} from "../hooks/useInterview"

const InterviewResultPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: results, isLoading, error } = useGetResults(id)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (error || !results?.data) {
    return (
      <div className="container mx-auto p-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-4">Results Not Found</h2>
            <p className="text-base-content/70 mb-6">
              We couldn't find the results for this interview.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/create-interview')}
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { interview, answers } = results.data
  const totalQuestions = answers.length
  const totalScore = answers.reduce((sum, answer) => sum + (answer.score || 0), 0)
  const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions).toFixed(1) : 0
  const percentage = totalQuestions > 0 ? ((totalScore / (totalQuestions * 10)) * 100).toFixed(0) : 0

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-success'
    if (score >= 6) return 'text-warning'
    return 'text-error'
  }

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 80) return { level: 'Excellent', color: 'badge-success', emoji: '🏆' }
    if (percentage >= 60) return { level: 'Good', color: 'badge-warning', emoji: '👍' }
    if (percentage >= 40) return { level: 'Fair', color: 'badge-warning', emoji: '📈' }
    return { level: 'Needs Improvement', color: 'badge-error', emoji: '📚' }
  }

  const performance = getPerformanceLevel(percentage)

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">📊 Interview Results</h1>
        <p className="text-base-content/70">Here's how you performed in your interview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="stat-title">Topic</div>
            <div className="stat-value text-lg">{interview.topic}</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="stat-title">Level</div>
            <div className="stat-value text-lg capitalize">{interview.level}</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="stat-title">Average Score</div>
            <div className={`stat-value text-2xl ${getScoreColor(averageScore)}`}>
              {averageScore}/10
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-3xl mb-2">{performance.emoji}</div>
            <div className="stat-title">Performance</div>
            <div className={`badge ${performance.color} badge-lg`}>
              {performance.level}
            </div>
          </div>
        </div>
      </div>

      {/* Overall Performance */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">🎯 Overall Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span>Overall Score</span>
                <span className="font-bold">{percentage}%</span>
              </div>
              <progress 
                className="progress progress-primary w-full" 
                value={percentage} 
                max="100"
              ></progress>
            </div>
            <div className="stats">
              <div className="stat">
                <div className="stat-title">Questions Answered</div>
                <div className="stat-value text-lg">{totalQuestions}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">📋 Detailed Feedback</h2>
        
        {answers.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-xl font-bold mb-2">No Answers Recorded</h3>
              <p className="text-base-content/70">
                It looks like no answers were recorded for this interview.
              </p>
            </div>
          </div>
        ) : (
          answers.map((answer, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Question {index + 1}</h3>
                  <div className={`badge badge-lg ${getScoreColor(answer.score || 0)}`}>
                    {answer.score || 0}/10
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Question */}
                  <div>
                    <h4 className="font-semibold text-primary mb-2">❓ Question:</h4>
                    <div className="bg-base-200 p-4 rounded-lg">
                      {answer.question}
                    </div>
                  </div>

                  {/* Answer */}
                  <div>
                    <h4 className="font-semibold text-secondary mb-2">💬 Your Answer:</h4>
                    <div className="bg-base-200 p-4 rounded-lg">
                      {answer.answer}
                    </div>
                  </div>

                  {/* Feedback */}
                  {answer.feedback && (
                    <div>
                      <h4 className="font-semibold text-info mb-2">🤖 AI Feedback:</h4>
                      <div className="bg-info/10 p-4 rounded-lg border border-info/20">
                        {answer.feedback}
                      </div>
                    </div>
                  )}

                  {/* Strengths and Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {answer.strengths && (
                      <div>
                        <h4 className="font-semibold text-success mb-2">✅ Strengths:</h4>
                        <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                          {answer.strengths}
                        </div>
                      </div>
                    )}

                    {answer.improvements && (
                      <div>
                        <h4 className="font-semibold text-warning mb-2">📈 Areas for Improvement:</h4>
                        <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                          {answer.improvements}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <button 
          className="btn btn-primary btn-lg" 
          onClick={() => navigate('/create-interview')}
        >
          🚀 Start New Interview
        </button>
        <button 
          className="btn btn-outline btn-lg" 
          onClick={() => window.print()}
        >
          🖨️ Print Results
        </button>
      </div>
    </div>
  )
}

export default InterviewResultPage
