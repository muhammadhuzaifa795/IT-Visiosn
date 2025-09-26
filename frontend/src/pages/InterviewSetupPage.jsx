"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateInterview } from "../hooks/useInterview";
import useAuthUser from "../hooks/useAuthUser";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  RocketIcon,
  TargetIcon,
  ClockIcon,
  ZapIcon,
  StarIcon,
  BookOpenIcon,
  UserIcon,
  SettingsIcon,
  CheckCircleIcon,
  LoaderIcon,
  CalendarIcon,
  AwardIcon
} from 'lucide-react';

const InterviewSetupPage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const [formData, setFormData] = useState({
    topic: "",
    level: "beginner",
    duration: 30,
  });
  const [currentStep, setCurrentStep] = useState(1);

  const createMutation = useCreateInterview();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number.parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser?._id) {
      console.error("User not authenticated");
      return;
    }
    try {
      const result = await createMutation.mutateAsync({
        ...formData,
        userId: authUser.id,
      });
      navigate(`/interview/${result.data.interviewId}`);
    } catch (error) {
      console.error("Error creating interview:", error);
    }
  };

  const steps = [
    { id: 1, title: "Topic", icon: BookOpenIcon },
    { id: 2, title: "Level", icon: TargetIcon },
    { id: 3, title: "Duration", icon: ClockIcon },
    { id: 4, title: "Review", icon: CheckCircleIcon }
  ];

  const difficultyLevels = [
    {
      value: "beginner",
      label: "Beginner",
      description: "Basic concepts and fundamentals",
      color: "badge-success",
      icon: "🟢"
    },
    {
      value: "intermediate",
      label: "Intermediate",
      description: "Practical applications and scenarios",
      color: "badge-warning",
      icon: "🟡"
    },
    {
      value: "advanced",
      label: "Advanced",
      description: "Complex scenarios and optimization",
      color: "badge-error",
      icon: "🔴"
    }
  ];

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center space-y-4">
          <LoaderIcon className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-base-content/60">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-b border-base-300/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-ghost gap-2 hover:bg-base-200 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back
            </button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-base-content mb-2">Interview Setup</h1>
              <p className="text-base-content/60">Configure your personalized AI interview session</p>
            </div>
            
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="steps steps-horizontal">
              {steps.map((step) => (
                <div 
                  key={step.id} 
                  className={`step ${currentStep >= step.id ? 'step-primary' : ''}`}
                >
                  <step.icon className="w-5 h-5" />
                  {step.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="card bg-base-100 shadow-2xl border border-base-300/30"
        >
          <div className="card-body p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Topic Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BookOpenIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-content mb-2">Choose Interview Topic</h2>
                    <p className="text-base-content/60">Select the technology or subject area you want to be interviewed on</p>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-lg">Topic Area</span>
                    </label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      placeholder="e.g., JavaScript, React, Node.js, Data Structures, System Design"
                      className="input input-bordered input-lg focus:input-primary transition-all duration-300"
                      required
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/60">
                        Be specific for more relevant questions
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {["JavaScript", "React", "Python", "Node.js", "SQL", "System Design", "Algorithms", "CSS"].map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, topic }))}
                        className={`btn btn-outline ${formData.topic === topic ? 'btn-primary' : ''}`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Difficulty Level */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <TargetIcon className="w-8 h-8 text-warning" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-content mb-2">Select Difficulty Level</h2>
                    <p className="text-base-content/60">Choose the complexity level that matches your current skills</p>
                  </div>

                  <div className="grid gap-4">
                    {difficultyLevels.map((level) => (
                      <label key={level.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="level"
                          value={level.value}
                          checked={formData.level === level.value}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div className={`card border-2 transition-all duration-300 hover:scale-105 ${
                          formData.level === level.value 
                            ? 'border-primary shadow-lg' 
                            : 'border-base-300 hover:border-base-400'
                        }`}>
                          <div className="card-body">
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">{level.icon}</span>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{level.label}</h3>
                                <p className="text-base-content/60">{level.description}</p>
                              </div>
                              <div className={`badge ${level.color} badge-lg`}>
                                {level.label}
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Duration */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-info/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ClockIcon className="w-8 h-8 text-info" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-content mb-2">Set Interview Duration</h2>
                    <p className="text-base-content/60">Choose how long you want the interview to last</p>
                  </div>

                  <div className="form-control">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Duration: {formData.duration} minutes</span>
                      <div className="badge badge-primary badge-lg">
                        {formData.duration} min
                      </div>
                    </div>
                    
                    <input
                      type="range"
                      name="duration"
                      min="5"
                      max="120"
                      value={formData.duration}
                      onChange={handleChange}
                      className="range range-primary range-lg"
                      step="5"
                    />
                    
                    <div className="flex justify-between text-sm text-base-content/60 px-2 mt-2">
                      <span>5 min</span>
                      <span>Quick (15 min)</span>
                      <span>Standard (30 min)</span>
                      <span>Comprehensive (60 min)</span>
                      <span>120 min</span>
                    </div>

                    <div className="flex gap-2 mt-4 justify-center">
                      {[15, 30, 45, 60].map((duration) => (
                        <button
                          key={duration}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, duration }))}
                          className={`btn btn-sm ${formData.duration === duration ? 'btn-primary' : 'btn-outline'}`}
                        >
                          {duration}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-success" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-content mb-2">Review Your Interview</h2>
                    <p className="text-base-content/60">Everything looks good? Let's start your interview!</p>
                  </div>

                  <div className="card bg-base-200/50 border border-base-300/30">
                    <div className="card-body">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5" />
                        Interview Configuration
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                          <span className="font-medium">Topic</span>
                          <span className="badge badge-primary">{formData.topic || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                          <span className="font-medium">Difficulty Level</span>
                          <span className="badge badge-warning capitalize">{formData.level}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                          <span className="font-medium">Duration</span>
                          <span className="badge badge-info">{formData.duration} minutes</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-base-100 rounded-lg">
                          <span className="font-medium">Format</span>
                          <span className="badge badge-secondary">Voice & Text Responses</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <InformationIcon className="w-5 h-5" />
                    <div>
                      <span className="font-medium">Pro Tip:</span> Ensure you're in a quiet environment for voice responses.
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-base-300/30">
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  className="btn btn-ghost gap-2"
                  disabled={currentStep === 1}
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Previous
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                    className="btn btn-primary gap-2"
                    disabled={!formData.topic.trim()}
                  >
                    Next
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg gap-3 shadow-lg hover:shadow-xl transition-all"
                    disabled={createMutation.isPending || !formData.topic.trim()}
                  >
                    {createMutation.isPending ? (
                      <>
                        <LoaderIcon className="w-5 h-5 animate-spin" />
                        Creating Interview...
                      </>
                    ) : (
                      <>
                        <RocketIcon className="w-5 h-5" />
                        Start Interview
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Helper component for right arrow
const ArrowRightIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

// Helper component for information icon
const InformationIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default InterviewSetupPage;