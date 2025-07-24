import { useState } from "react";
import  useInterview  from "../hooks/useInterview";
import { useNavigate } from "react-router";
import { PlayCircle } from "lucide-react";

export default function InterviewSetupPage() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("easy");
  const [duration, setDuration] = useState(5);
  const [uniqueTopics] = useState(new Set()); // Set to track unique topics
  const { createMutation } = useInterview();
  const navigate = useNavigate();

  const handleTopicChange = (e) => {
    const newTopic = e.target.value;
    setTopic(newTopic);
    uniqueTopics.add(newTopic); // Add topic to Set
  };

  const handleCreate = () => {
    if (!topic.trim()) {
      alert("Please enter a valid topic");
      return;
    }
    createMutation.mutate(
      { topic, level, duration },
      {
        onSuccess: (response) => {
          // Handle different response structures
          const interviewId = response?.data?.interviewId || response?.interviewId || response?._id;
          if (!interviewId) {
            console.error("No interviewId found in response:", response);
            alert("Failed to retrieve interview ID. Please try again.");
            return;
          }
          navigate(`/interview/${interviewId}`);
        },
        onError: (error) => {
          console.error("Failed to create interview:", error);
          alert("Failed to create interview. Please try again.");
        },
      }
    );
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Setup Interview</h2>

            <label className="form-control">
              <span className="label-text">Topic</span>
              <input
                type="text"
                value={topic}
                onChange={handleTopicChange}
                className="input input-bordered"
                placeholder="React"
              />
            </label>

            <label className="form-control">
              <span className="label-text">Level</span>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="select select-bordered"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            <label className="form-control">
              <span className="label-text">Duration (min)</span>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(+e.target.value)}
                className="input input-bordered"
                min="1"
                max="60"
              />
            </label>

            <div className="card-actions justify-end">
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending || !topic.trim()}
                className="btn btn-primary"
              >
                {createMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating…
                  </>
                ) : (
                  <>
                    <PlayCircle size={16} className="mr-1" />
                    Start Interview
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}  