"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateInterview } from "../hooks/useInterview";
import useAuthUser from "../hooks/useAuthUser";

const InterviewSetupPage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const [formData, setFormData] = useState({
    topic: "",
    level: "beginner",
    duration: 30,
  });

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

  if (!authUser) {
    return <div className="text-center py-10">Loading user...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-8">Create New Interview</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-medium">Interview Topic</span>
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., JavaScript, React, Node.js, Data Structures"
                className="input input-bordered input-lg"
                required
              />
              <label className="label">
                <span className="label-text-alt">Choose a specific technology or subject area</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-medium">Difficulty Level</span>
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="select select-bordered select-lg"
              >
                <option value="beginner">🟢 Beginner - Basic concepts and fundamentals</option>
                <option value="intermediate">🟡 Intermediate - Practical applications</option>
                <option value="advanced">🔴 Advanced - Complex scenarios and optimization</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-medium">Duration</span>
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  name="duration"
                  min="15"
                  max="120"
                  value={formData.duration}
                  onChange={handleChange}
                  className="range range-primary flex-1"
                  step="5"
                />
                <div className="badge badge-lg badge-primary">{formData.duration} min</div>
              </div>
              <div className="flex justify-between text-xs px-2 mt-1">
                <span>15 min</span>
                <span>30 min</span>
                <span>60 min</span>
                <span>90 min</span>
                <span>120 min</span>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="font-bold">📋 Interview Preview</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Topic:</strong> {formData.topic || "Not specified"}
                  </p>
                  <p>
                    <strong>Level:</strong>{" "}
                    <span className="capitalize">{formData.level}</span>
                  </p>
                  <p>
                    <strong>Duration:</strong> {formData.duration} minutes
                  </p>
                  <p>
                    <strong>Format:</strong> Voice-based Q&A with AI feedback
                  </p>
                </div>
              </div>
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={createMutation.isPending || !formData.topic.trim()}
              >
                {createMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Interview...
                  </>
                ) : (
                  <>🚀 Start Interview</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetupPage;
