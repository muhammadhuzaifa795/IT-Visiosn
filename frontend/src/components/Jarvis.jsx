import { useState, useEffect, useRef } from "react";
import { Mic, Keyboard, X, User, FileText, MessageSquare, Brain, Map, Bot, Bell, Users, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

const info = {
  "/": "Welcome to CodeZynx, the ultimate IT community hub founded by Rajeel Siddiqui.",
  "/signup": "Create a new account to join the CodeZynx community.",
  "/landing": "Explore the CodeZynx landing page for an overview of our platform.",
  "/add-face": "Set up facial recognition for secure login.",
  "/password-reset": "Reset your password to regain access to your account.",
  "/login": "Log in to access your personalized CodeZynx experience.",
  "/notifications": "View your latest updates, comments, and interview invitations.",
  "/onboarding": "Get started with a personalized onboarding experience.",
  "/profile": "Access your profile to showcase your skills and AI-crafted CVs.",
  "/create-post": "Share your insights, solutions, or tech breakthroughs.",
  "/friends": "Connect with IT professionals, mentors, and collaborators.",
  "/users": "Explore our community of developers, designers, and innovators.",
  "/ai-prompt": "Unleash creativity with our AI playground for code and content.",
  "/roadmap": "Track your learning journey with our interactive roadmap.",
  "/interviews": "Access your interview dashboard for practice and live sessions.",
  "/create-interview": "Set up AI-powered interviews tailored to your tech stack.",
  "/cv-list": "Manage your AI-generated CVs with ease and precision.",
  "/cv-form": "Build a standout tech CV with our AI-guided builder.",
  "/chatbot": "Interact with our AI chatbot powered by Gemini for instant answers.",
};

const patterns = [
  { keys: ["about website", "about site", "about founder", "who created", "rajeel siddiqui"], route: "/about-site-info" },
  { keys: ["home", "feed", "dashboard"], route: "/" },
  { keys: ["signup", "sign up"], route: "/signup" },
  { keys: ["landing", "landing page"], route: "/landing" },
  { keys: ["add face", "face setup"], route: "/add-face" },
  { keys: ["password reset", "reset password"], route: "/password-reset" },
  { keys: ["login", "sign in"], route: "/login" },
  { keys: ["notifications"], route: "/notifications" },
  { keys: ["onboarding"], route: "/onboarding" },
  { keys: ["profile", "my profile"], route: "/profile" },
  { keys: ["create post", "upload post", "new post"], route: "/create-post" },
  { keys: ["friends", "friend list"], route: "/friends" },
  { keys: ["users", "people"], route: "/users" },
  { keys: ["ai prompt"], route: "/ai-prompt" },
  { keys: ["roadmap"], route: "/roadmap" },
  { keys: ["interviews"], route: "/interviews" },
  { keys: ["create interview", "setup interview"], route: "/create-interview" },
  { keys: ["cv list", "my cvs"], route: "/cv-list" },
  { keys: ["cv form", "create cv"], route: "/cv-form" },
  { keys: ["chatbot", "open chatbot", "talk to ai"], route: "/chatbot" },
  { keys: ["face login", "login with face"], route: "/face-login" },
  { keys: ["problem solving", "solve problem"], route: "/problem-solving" },
];

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  utter.lang = "en-US";
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

async function fetchGeminiResponse(message) {
  try {
    const response = await fetch("https://api.gemini.com/v1/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: message,
        max_tokens: 150,
      }),
    });
    const data = await response.json();
    return data.choices[0].text.trim();
  } catch (error) {
    return "Sorry, I couldn't connect to the Gemini AI. Please try again.";
  }
}

function matchRoute(msg) {
  const lowerMsg = msg.toLowerCase();
  for (const pattern of patterns) {
    for (const key of pattern.keys) {
      if (lowerMsg.includes(key)) {
        return typeof pattern.route === "function" ? pattern.route(lowerMsg) : pattern.route;
      }
    }
  }
  return null;
}

export default function Jarvis() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [chatMessages, setChatMessages] = useState(JSON.parse(localStorage.getItem("jarvisChat")) || []);
  const [isTyping, setIsTyping] = useState(false);
  const [faceLoginActive, setFaceLoginActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const socketRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("https://api.codezynx.com");
    socketRef.current.on("chat-message", (msg) => {
      setChatMessages((prev) => {
        const newMessages = [...prev, { sender: "other", text: msg }];
        localStorage.setItem("jarvisChat", JSON.stringify(newMessages.slice(-50))); // Store last 50 messages
        return newMessages;
      });
    });
    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const rec = new window.webkitSpeechRecognition();
    rec.continuous = false;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const said = e.results[0][0].transcript.trim();
      setText(said);
      handleCommand(said);
    };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const wake = new window.webkitSpeechRecognition();
    wake.continuous = true;
    wake.lang = "en-US";
    wake.onresult = (e) => {
      for (let i = 0; i < e.results.length; i++) {
        const t = e.results[i][0].transcript.toLowerCase();
        if (t.includes("hi jarvis") || t.includes("hey jarvis")) {
          wake.stop();
          setOpen(true);
          setMode("voice");
          setListening(true);
          recognitionRef.current?.start();
          break;
        }
      }
    };
    wake.start();
    return () => wake.stop();
  }, []);

  useEffect(() => {
    if (faceLoginActive) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setInterval(captureFace, 1000);
      });
    }
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [faceLoginActive]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        setMode("");
        setFaceLoginActive(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function captureFace() {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    canvasRef.current.toBlob((blob) => {
      fetch("https://api.codezynx.com/face-auth", {
        method: "POST",
        body: blob,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            speak("Face login successful. Welcome back!");
            setFaceLoginActive(false);
            navigate("/profile");
          } else {
            speak("Face login failed. Try again.");
            setChatMessages((prev) => [
              ...prev,
              { sender: "jarvis", text: "Face login failed. Try again." },
            ]);
          }
        });
    });
  }

  async function handleCommand(msg) {
    setIsLoading(true);
    setChatMessages((prev) => {
      const newMessages = [...prev, { sender: "user", text: msg }];
      localStorage.setItem("jarvisChat", JSON.stringify(newMessages.slice(-50)));
      return newMessages;
    });
    const route = matchRoute(msg);
    if (route === "/about-site-info") {
      const response = "CodeZynx, founded by Rajeel Siddiqui, is your AI-powered IT community. Create smart CVs, solve coding problems, schedule interviews, and connect with professionals worldwide.";
      speak(response);
      setChatMessages((prev) => {
        const newMessages = [...prev, { sender: "jarvis", text: response }];
        localStorage.setItem("jarvisChat", JSON.stringify(newMessages.slice(-50)));
        return newMessages;
      });
      setOpen(false);
      setMode("");
    } else if (route === "/face-login") {
      setFaceLoginActive(true);
      speak("Initiating face login. Please look at the camera.");
    } else if (route === "/problem-solving") {
      speak("Opening problem-solving hub. Choose a challenge or share your solution.");
      navigate(route);
    } else if (route === "/chatbot") {
      speak("Opening Gemini-powered chatbot. Ask away!");
      setMode("chatbot");
    } else if (route) {
      const sentence = info[route] || "Navigating...";
      speak(sentence);
      setChatMessages((prev) => {
        const newMessages = [...prev, { sender: "jarvis", text: sentence }];
        localStorage.setItem("jarvisChat", JSON.stringify(newMessages.slice(-50)));
        return newMessages;
      });
      setOpen(false);
      setMode("");
      setText("");
      navigate(route);
    } else {
      const geminiResponse = await fetchGeminiResponse(msg);
      setChatMessages((prev) => {
        const newMessages = [...prev, { sender: "jarvis", text: geminiResponse }];
        localStorage.setItem("jarvisChat", JSON.stringify(newMessages.slice(-50)));
        return newMessages;
      });
      speak(geminiResponse);
    }
    socketRef.current.emit("chat-message", msg);
    setIsLoading(false);
  }

  async function handleChatbotMessage() {
    if (!text.trim()) return;
    setIsLoading(true);
    setChatMessages((prev) => {
      const newMessages = [...prev, { sender: "user", text }];
      localStorage.setItem("jarvisChat", JSON.stringify(newMessages.slice(-50)));
      return newMessages;
    });
    const geminiResponse = await fetchGeminiResponse(text);
    setChatMessages((prev) => {
      const newMessages = [...prev, { sender: "jarvis", text: geminiResponse }];
      localStorage.setItem("jarvisChat", JSON.stringify(newMessages.slice(-50)));
      return newMessages;
    });
    speak(geminiResponse);
    setText("");
    setIsTyping(false);
    setIsLoading(false);
  }

  function sendChatMessage() {
    if (!text.trim()) return;
    socketRef.current.emit("chat-message", text);
    setChatMessages((prev) => {
      const newMessages = [...prev, { sender: "user", text }];
      localStorage.setItem("jarvisChat", JSON.stringify(newMessages.slice(-50)));
      return newMessages;
    });
    setText("");
    setIsTyping(false);
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Open Jarvis Assistant"
          >
            <Mic size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-700/50 p-6 rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg max-h-[80vh] overflow-y-auto"
            role="dialog"
            aria-labelledby="jarvis-title"
          >
            <div className="flex justify-between items-center mb-4">
              <span id="jarvis-title" className="font-bold text-xl text-neutral-800 dark:text-neutral-100">
                CodeZynx Jarvis
              </span>
              <button
                onClick={() => {
                  setOpen(false);
                  setMode("");
                  setFaceLoginActive(false);
                }}
                className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-1"
                aria-label="Close Jarvis"
              >
                <X size={24} />
              </button>
            </div>

            {faceLoginActive ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Scanning your face...</p>
                <video ref={videoRef} className="w-full rounded-lg" width="320" height="240" />
                <canvas ref={canvasRef} className="hidden" width="320" height="240" />
                <button
                  onClick={() => setFaceLoginActive(false)}
                  className="bg-red-500 text-white rounded-lg py-2 px-4 text-sm hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="relative max-h-64 overflow-y-auto mb-4 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-lg p-4">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-100/80 dark:bg-neutral-800/80">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          msg.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-neutral-200/80 dark:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {!mode && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => setMode("text")}
                      className="bg-neutral-200/50 dark:bg-neutral-700/50 rounded-lg py-3 text-sm flex items-center justify-center gap-2 hover:bg-neutral-300/50 dark:hover:bg-neutral-600/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                      aria-label="Text Input Mode"
                    >
                      <Keyboard size={18} /> Text Input
                    </button>
                    <button
                      onClick={() => {
                        setMode("voice");
                        setListening(true);
                        recognitionRef.current?.start();
                      }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg py-3 text-sm flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                      aria-label="Voice Command Mode"
                    >
                      <Mic size={18} /> Voice Command
                    </button>
                    <button
                      onClick={() => setMode("chatbot")}
                      className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg py-3 text-sm flex items-center justify-center gap-2 hover:from-green-600 hover:to-teal-600 transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
                      aria-label="Chatbot Mode"
                    >
                      <Bot size={18} /> Chatbot
                    </button>
                  </div>
                )}

                {mode === "text" && (
                  <div className="space-y-3">
                    <input
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value);
                        setIsTyping(true);
                      }}
                      placeholder="Type a command or message…"
                      className="w-full border border-neutral-300/50 dark:border-neutral-600/50 rounded-lg px-4 py-2 text-sm bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onKeyDown={(e) => e.key === "Enter" && (text.includes("chat") ? sendChatMessage() : handleCommand(text))}
                      aria-label="Text command input"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => (text.includes("chat") ? sendChatMessage() : handleCommand(text))}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg py-2 text-sm hover:from-blue-600 hover:to-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                        disabled={isLoading}
                      >
                        {text.includes("chat") ? "Send Message" : "Execute Command"}
                      </button>
                      <button
                        onClick={() => setMode("")}
                        className="bg-neutral-200/50 dark:bg-neutral-700/50 rounded-lg py-2 px-4 text-sm hover:bg-neutral-300/50 dark:hover:bg-neutral-600/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}

                {mode === "voice" && (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {listening ? (
                        <>
                          Listening… <span className="text-blue-500">{text || "say a command"}</span>
                        </>
                      ) : (
                        "Click to start voice input."
                      )}
                    </p>
                    <button
                      onClick={() => {
                        setListening(true);
                        recognitionRef.current?.start();
                      }}
                      disabled={listening}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-4 disabled:opacity-50 hover:from-blue-600 hover:to-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                      aria-label="Start Voice Input"
                    >
                      <Mic size={24} />
                    </button>
                    <button
                      onClick={() => setMode("")}
                      className="bg-neutral-200/50 dark:bg-neutral-700/50 rounded-lg py-2 px-4 text-sm hover:bg-neutral-300/50 dark:hover:bg-neutral-600/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Back
                    </button>
                  </div>
                )}

                {mode === "chatbot" && (
                  <div className="space-y-3">
                    <input
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value);
                        setIsTyping(true);
                      }}
                      placeholder="Ask the Gemini AI anything…"
                      className="w-full border border-neutral-300/50 dark:border-neutral-600/50 rounded-lg px-4 py-2 text-sm bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                      onKeyDown={(e) => e.key === "Enter" && handleChatbotMessage()}
                      aria-label="Chatbot input"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleChatbotMessage}
                        className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg py-2 text-sm hover:from-green-600 hover:to-teal-600 transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
                        disabled={isLoading}
                      >
                        Send to Chatbot
                      </button>
                      <button
                        onClick={() => setMode("")}
                        className="bg-neutral-200/50 dark:bg-neutral-700/50 rounded-lg py-2 px-4 text-sm hover:bg-neutral-300/50 dark:hover:bg-neutral-600/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {[
                    { command: "profile", icon: User, label: "Profile" },
                    { command: "cv-form", icon: FileText, label: "CV Builder" },
                    { command: "chatbot", icon: Bot, label: "Chatbot" },
                    { command: "ai-prompt", icon: Brain, label: "AI Prompt" },
                    { command: "roadmap", icon: Map, label: "Roadmap" },
                    { command: "notifications", icon: Bell, label: "Notifications" },
                    { command: "friends", icon: Users, label: "Friends" },
                    { command: "create-post", icon: PlusCircle, label: "Create Post" },
                  ].map(({ command, icon: Icon, label }) => (
                    <button
                      key={command}
                      onClick={() => handleCommand(command)}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                      aria-label={`Navigate to ${label}`}
                    >
                      <Icon size={20} className="text-neutral-600 dark:text-neutral-400" />
                      <span className="text-xs mt-1 text-neutral-700 dark:text-neutral-300">{label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}