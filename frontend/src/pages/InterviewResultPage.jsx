"use client"

import { useParams, useNavigate } from "react-router"
import { useGetResults } from "../hooks/useInterview"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUpIcon,
  TargetIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LightbulbIcon,
  ThumbsUpIcon,
  ZapIcon,
  AwardIcon,
  DownloadIcon,
  PrinterIcon,
  RotateCcwIcon,
  MessageSquareIcon,
  FileTextIcon,
  CalendarIcon,
  UserIcon,
  BrainIcon,
  ChartBarIcon,
  TrophyIcon,
  SparklesIcon
} from "lucide-react"

const InterviewResultPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: results, isLoading, error } = useGetResults(id)

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <div className="text-center space-y-6">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity }
            }}
            className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto"
          >
            <BrainIcon className="w-10 h-10 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-base-content mb-2">Analyzing Your Results</h2>
            <p className="text-base-content/60">We're carefully reviewing your interview performance...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !results?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-2xl max-w-md w-full"
        >
          <div className="card-body text-center p-8">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircleIcon className="w-8 h-8 text-error" />
            </div>
            <h2 className="text-2xl font-bold text-base-content mb-2">Results Not Found</h2>
            <p className="text-base-content/70 mb-6">
              We couldn't find the results for this interview. It may have expired or been deleted.
            </p>
            <div className="space-y-3">
              <button 
                className="btn btn-primary w-full gap-2"
                onClick={() => navigate('/create-interview')}
              >
                <ZapIcon className="w-4 h-4" />
                Start New Interview
              </button>
              <button 
                className="btn btn-ghost w-full gap-2"
                onClick={() => navigate('/interviews')}
              >
                <RotateCcwIcon className="w-4 h-4" />
                Back to Interviews
              </button>
            </div>
          </div>
        </motion.div>
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

  const getScoreBadgeColor = (score) => {
    if (score >= 8) return 'badge-success'
    if (score >= 6) return 'badge-warning'
    return 'badge-error'
  }

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { 
      level: 'Exceptional', 
      color: 'badge-success', 
      emoji: '🏆',
      description: 'Outstanding performance! You demonstrate excellent skills.',
      icon: TrophyIcon
    }
    if (percentage >= 80) return { 
      level: 'Excellent', 
      color: 'badge-success', 
      emoji: '⭐',
      description: 'Great job! Your skills are well above average.',
      icon: StarIcon
    }
    if (percentage >= 70) return { 
      level: 'Good', 
      color: 'badge-warning', 
      emoji: '👍',
      description: 'Solid performance with room for growth.',
      icon: ThumbsUpIcon
    }
    if (percentage >= 60) return { 
      level: 'Satisfactory', 
      color: 'badge-warning', 
      emoji: '📈',
      description: 'Good foundation, focus on areas for improvement.',
      icon: TrendingUpIcon
    }
    return { 
      level: 'Needs Practice', 
      color: 'badge-error', 
      emoji: '📚',
      description: 'Keep practicing to improve your skills.',
      icon: LightbulbIcon
    }
  }

  const performance = getPerformanceLevel(percentage)

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 border-b border-base-300/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-3 mb-6">
              <ChartBarIcon className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Interview Results</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
              Interview Performance Analysis
            </h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Detailed breakdown of your interview performance with actionable insights
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card bg-base-100 shadow-lg border border-base-300/30">
            <div className="card-body text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileTextIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="stat-title text-base-content/70">Topic</div>
              <div className="stat-value text-lg font-semibold text-base-content">{interview.topic}</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300/30">
            <div className="card-body text-center p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TargetIcon className="w-6 h-6 text-secondary" />
              </div>
              <div className="stat-title text-base-content/70">Difficulty</div>
              <div className="stat-value text-lg font-semibold text-base-content capitalize">{interview.level}</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300/30">
            <div className="card-body text-center p-6">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <StarIcon className="w-6 h-6 text-warning" />
              </div>
              <div className="stat-title text-base-content/70">Average Score</div>
              <div className={`stat-value text-xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore}/10
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300/30">
            <div className="card-body text-center p-6">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <performance.icon className="w-6 h-6 text-success" />
              </div>
              <div className="stat-title text-base-content/70">Performance</div>
              <div className={`badge ${performance.color} badge-lg font-semibold`}>
                {performance.level}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-base-100 shadow-lg border border-base-300/30 mb-8"
        >
          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUpIcon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-base-content">Performance Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progress Section */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-base-content">Overall Score</span>
                    <span className="font-bold text-lg text-primary">{percentage}%</span>
                  </div>
                  <div className="w-full bg-base-300/30 rounded-full h-4">
                    <motion.div 
                      className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-base-200/50 rounded-xl">
                    <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
                    <div className="text-sm text-base-content/70">Questions</div>
                  </div>
                  <div className="text-center p-4 bg-base-200/50 rounded-xl">
                    <div className="text-2xl font-bold text-secondary">{totalScore}</div>
                    <div className="text-sm text-base-content/70">Total Points</div>
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <SparklesIcon className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-base-content mb-1">Performance Insight</h4>
                    <p className="text-base-content/70 text-sm">{performance.description}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ClockIcon className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-base-content mb-1">Completion Time</h4>
                    <p className="text-base-content/70 text-sm">Interview completed recently</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info/10 rounded-lg">
              <MessageSquareIcon className="w-6 h-6 text-info" />
            </div>
            <h2 className="text-2xl font-bold text-base-content">Detailed Question Analysis</h2>
          </div>

          <AnimatePresence>
            {answers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card bg-base-100 shadow-lg border border-base-300/30"
              >
                <div className="card-body text-center p-8">
                  <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircleIcon className="w-8 h-8 text-base-content/40" />
                  </div>
                  <h3 className="text-xl font-bold text-base-content mb-2">No Answers Recorded</h3>
                  <p className="text-base-content/70">
                    It looks like no answers were recorded for this interview session.
                  </p>
                </div>
              </motion.div>
            ) : (
              answers.map((answer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card bg-base-100 shadow-lg border border-base-300/30 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="card-body p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-primary">{index + 1}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-base-content">Question {index + 1}</h3>
                      </div>
                      <div className={`badge ${getScoreBadgeColor(answer.score || 0)} badge-lg gap-2`}>
                        <StarIcon className="w-4 h-4" />
                        {answer.score || 0}/10
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Question */}
                      <div>
                        <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                          <FileTextIcon className="w-4 h-4 text-primary" />
                          Question
                        </h4>
                        <div className="bg-base-200/50 p-4 rounded-xl border-l-4 border-primary">
                          <p className="text-base-content leading-relaxed">{answer.question}</p>
                        </div>
                      </div>

                      {/* Answer */}
                      <div>
                        <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-secondary" />
                          Your Answer
                        </h4>
                        <div className="bg-base-200/50 p-4 rounded-xl border-l-4 border-secondary">
                          <p className="text-base-content leading-relaxed">{answer.answer}</p>
                        </div>
                      </div>

                      {/* Feedback Sections */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* AI Feedback */}
                        {answer.feedback && (
                          <div>
                            <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                              <BrainIcon className="w-4 h-4 text-info" />
                              AI Feedback
                            </h4>
                            <div className="bg-info/5 p-4 rounded-xl border border-info/20">
                              <p className="text-base-content leading-relaxed">{answer.feedback}</p>
                            </div>
                          </div>
                        )}

                        {/* Strengths & Improvements */}
                        <div className="space-y-4">
                          {answer.strengths && (
                            <div>
                              <h4 className="font-semibold text-base-content mb-2 flex items-center gap-2">
                                <CheckCircleIcon className="w-4 h-4 text-success" />
                                Strengths
                              </h4>
                              <div className="bg-success/5 p-3 rounded-lg border border-success/20">
                                <p className="text-base-content/80 text-sm">{answer.strengths}</p>
                              </div>
                            </div>
                          )}

                          {answer.improvements && (
                            <div>
                              <h4 className="font-semibold text-base-content mb-2 flex items-center gap-2">
                                <LightbulbIcon className="w-4 h-4 text-warning" />
                                Areas for Improvement
                              </h4>
                              <div className="bg-warning/5 p-3 rounded-lg border border-warning/20">
                                <p className="text-base-content/80 text-sm">{answer.improvements}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <button 
            className="btn btn-primary btn-lg gap-3 shadow-lg"
            onClick={() => navigate('/create-interview')}
          >
            <ZapIcon className="w-5 h-5" />
            Start New Interview
          </button>
          <button 
            className="btn btn-outline btn-lg gap-3"
            onClick={() => window.print()}
          >
            <PrinterIcon className="w-5 h-5" />
            Print Results
          </button>
          <button 
            className="btn btn-ghost btn-lg gap-3"
            onClick={() => navigate('/interviews')}
          >
            <RotateCcwIcon className="w-5 h-5" />
            Back to Interviews
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default InterviewResultPage