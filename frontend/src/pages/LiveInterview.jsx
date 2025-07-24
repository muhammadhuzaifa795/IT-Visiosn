import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useInterview from "../hooks/useInterview";
import { io } from "socket.io-client";
import { Mic, Square } from "lucide-react";

// Use the same BASE_URL logic as axios.js
const isDevTunnel = window.location.origin.includes(".devtunnels.ms");
const BASE_URL = isDevTunnel
  ? "https://qs93k5gj-5000.inc1.devtunnels.ms"
  : import.meta.env.MODE === "development"
  ? "http://localhost:5000"
  : "https://your-production-backend.com";

const socket = io(BASE_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
});

export default function LiveInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [transcript, setTranscript] = useState("");
  const recognition = useRef(null);
  const { startMutation, endMutation } = useInterview();

  useEffect(() => {
    // Start the interview
    startMutation.mutate(id, {
      onError: (error) => {
        console.error("Failed to start interview:", error);
        alert("Failed to start interview. Please try again.");
      },
    });

    // WebSocket setup
    socket.emit("join-room", id);
    socket.on("connect", () => console.log("WebSocket connected"));
    socket.on("connect_error", (error) => console.error("WebSocket connection error:", error));
    socket.on("question", (q) => {
      console.log("Received question:", q);
      setQuestion(q);
      speak(q);
      setTranscript((t) => t + `AI: ${q}\n`);
    });
    socket.on("transcript", (txt) => {
      console.log("Received transcript:", txt);
      setTranscript((t) => t + `User: ${txt}\n`);
    });
    socket.on("error", (msg) => {
      console.error("WebSocket error:", msg);
      alert(`WebSocket error: ${msg}`);
    });

    // Speech recognition setup
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser");
      return;
    }
    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.lang = "en-US";
    recognition.current.onresult = (e) => {
      const last = e.results[e.results.length - 1];
      if (!last.isFinal) return;
      const text = last[0].transcript.trim();
      console.log("Speech recognition result:", text);
      socket.emit("answer", { interviewId: id, question, answer: text });
    };
    recognition.current.onerror = (error) => {
      console.error("Speech recognition error:", error);
    };
    recognition.current.start();

    // Cleanup on unmount
    return () => {
      recognition.current?.stop();
      socket.off("question");
      socket.off("transcript");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("error");
    };
  }, [id, startMutation]);

  const speak = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => console.log("Speech synthesis finished");
    utterance.onerror = (error) => console.error("Speech synthesis error:", error);
    speechSynthesis.speak(utterance);
  };

  const finish = () => {
    recognition.current?.stop();
    endMutation.mutate(id, {
      onSuccess: () => navigate(`/result/${id}`),
      onError: (error) => {
        console.error("Failed to end interview:", error);
        alert("Failed to end interview. Please try again.");
      },
    });
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content">
        <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Live Interview</h2>
            <div className="alert alert-info">
              <Mic size={20} />
              <span>{question || "Waiting for question..."}</span>
            </div>
            <div className="mockup-code">
              <pre className="px-4 py-2 text-sm">
                <code>{transcript || "No transcript yet..."}</code>
              </pre>
            </div>
            <div className="card-actions justify-end">
              <button
                onClick={finish}
                className="btn btn-error"
                disabled={endMutation.isPending}
              >
                <Square size={16} className="mr-1" />
                End Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}