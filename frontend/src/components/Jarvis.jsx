import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, Send, X, Code, Keyboard, BrainCircuit } from "lucide-react";
import { useNavigate } from "react-router";

const siteInfo = {
  name: "CodeZynx",
  founder: "Rajeel Siddiqui",
  description: "CodeZynx is a premier, AI-driven ecosystem for the global IT community. Conceptualized and founded by Rajeel Siddiqui, our platform empowers professionals to build dynamic CVs with AI, engage in collaborative problem-solving, conduct real-time interviews, and forge meaningful connections. We are redefining professional networking and career development through technology.",
};

const navigationMap = {
  "/": "Navigating to the main feed, the central hub of our IT community.",
  "/profile": "Accessing your professional profile. Showcase your AI-crafted CVs and track your achievements.",
  "/notifications": "Displaying your latest notifications for posts, network updates, and interview invitations.",
  "/network": "Opening your professional network. Discover and connect with peers and industry leaders.",
  "/members": "Browse all members. Find mentors, collaborators, or your next strategic hire.",
  "/create-post": "Activating the post creator. Share your insights, challenges, or breakthroughs with the community.",
  "/ai-engine": "Launching the AI Engine. Leverage our advanced tools for code optimization and creative brainstorming.",
  "/cv-dashboard": "Showing your CV Dashboard. Manage, preview, and share all your AI-generated résumés.",
  "/cv-builder": "Initializing the AI CV Builder. Let's craft the perfect technical résumé together.",
  "/interviews": "Loading your interview dashboard. Review practice sessions, live interviews, and performance analytics.",
  "/schedule-interview": "Setting up a new AI-powered interview. Define the stack, set the difficulty, and go live.",
  "/skill-roadmap": "Displaying the interactive skill roadmap. Chart your learning journey and certify your expertise.",
  "/onboarding": "Welcome to CodeZynx! Let's personalize your experience for maximum impact.",
};

const commandPatterns = [
  { keys: ["about codezynx", "about the website", "about the site", "about rajeel", "who is the founder"], route: "/about-site-info" },
  { keys: ["home", "main feed", "dashboard"], route: "/" },
  { keys: ["my profile", "view profile"], route: "/profile" },
  { keys: ["notifications", "show updates"], route: "/notifications" },
  { keys: ["friends", "my network"], route: "/network" },
  { keys: ["users", "members", "find people"], route: "/members" },
  { keys: ["new post", "create a post"], route: "/create-post" },
  { keys: ["ai engine", "ai prompt"], route: "/ai-engine" },
  { keys: ["cv dashboard", "my cvs", "cv list"], route: "/cv-dashboard" },
  { keys: ["create cv", "build a cv", "cv builder"], route: "/cv-builder" },
  { keys: ["interviews", "my interviews"], route: "/interviews" },
  { keys: ["schedule interview", "new interview"], route: "/schedule-interview" },
  { keys: ["roadmap", "skill path"], route: "/skill-roadmap" },
  { keys: ["onboarding", "setup account"], route: "/onboarding" },
  { keys: ["chat with", "open chat for"], route: (cmd) => `/chat/${(cmd.match(/\d+/) || [""])[0]}` },
  { keys: ["call", "start video call with"], route: (cmd) => `/call/${(cmd.match(/\d+/) || [""])[0]}` },
];

const matchRoute = (command) => {
  const lowerCmd = command.toLowerCase();
  for (const pattern of commandPatterns) {
    if (pattern.keys.some(key => lowerCmd.includes(key))) {
      return typeof pattern.route === "function" ? pattern.route(lowerCmd) : pattern.route;
    }
  }
  return null;
};

const speak = (text, onEndCallback = () => {}) => {
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  utterance.onend = onEndCallback;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
};

export default function CodeZynxAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState("idle");
  const [wakeWordHeard, setWakeWordHeard] = useState(false);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const visualizerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const processCommand = useCallback((command) => {
    setStatus("processing");
    const route = matchRoute(command);
    if (route === "/about-site-info") {
      speak(siteInfo.description, () => {
        setIsOpen(false);
        setMode(null);
        setStatus("idle");
      });
    } else if (route) {
      const response = navigationMap[route] || "Navigating as requested.";
      speak(response, () => {
        setIsOpen(false);
        setMode(null);
        setStatus("idle");
        navigate(route);
      });
    } else {
      speak("I didn't recognize that command. Please try again.", () => {
        setStatus("listening");
        if (mode === 'voice' && recognitionRef.current) {
          recognitionRef.current.start();
        } else {
          setStatus("idle");
        }
      });
    }
  }, [navigate, mode]);

  const setupVisualizer = useCallback(() => {
    if (audioContextRef.current) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      audioContextRef.current = audioContext;
    }).catch(() => {
      console.error("Microphone access denied for visualizer.");
    });
  }, []);

  const drawVisualizer = useCallback(() => {
    const canvas = visualizerRef.current;
    if (!canvas || !analyserRef.current) return;
    const canvasCtx = canvas.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = "rgba(10, 10, 25, 1)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(59, 130, 246)";
      canvasCtx.beginPath();
      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };
    draw();
  }, []);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech recognition not supported.");
      return;
    }

    const commandRecognition = new window.webkitSpeechRecognition();
    commandRecognition.continuous = false;
    commandRecognition.lang = "en-US";
    commandRecognition.onresult = (event) => {
      const command = event.results[0][0].transcript.trim();
      setInputValue(command);
      processCommand(command);
    };
    commandRecognition.onend = () => {
      if (status === 'listening') setStatus('idle');
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    recognitionRef.current = commandRecognition;

    const wakeWordRecognition = new window.webkitSpeechRecognition();
    wakeWordRecognition.continuous = true;
    wakeWordRecognition.lang = "en-US";
    wakeWordRecognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript.toLowerCase().trim();
        if (transcript.includes("hey codezynx") || transcript.includes("hi codezynx")) {
          setWakeWordHeard(true);
        }
      }
    };
    wakeWordRecognition.start();

    return () => {
      wakeWordRecognition.stop();
      if (recognitionRef.current) recognitionRef.current.stop();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [processCommand, status]);

  useEffect(() => {
    if (wakeWordHeard) {
      setIsOpen(true);
      setMode('voice');
      speak("How can I help you?", () => {
        setStatus('listening');
        if (recognitionRef.current) recognitionRef.current.start();
      });
      setWakeWordHeard(false);
    }
  }, [wakeWordHeard]);

  useEffect(() => {
    if (mode === 'voice' && status === 'listening') {
      setupVisualizer();
      setTimeout(drawVisualizer, 100);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [mode, status, setupVisualizer, drawVisualizer]);
  
  const handleVoiceButtonClick = () => {
    setMode('voice');
    speak("I'm listening.", () => {
        setStatus('listening');
        if (recognitionRef.current) recognitionRef.current.start();
    });
  };

  const statusText = () => {
    switch (status) {
      case 'listening': return "Listening...";
      case 'processing': return "Processing command...";
      default: return `Awaiting your command.`;
    }
  };
  
  const handleOpen = () => {
    setIsOpen(true);
    speak("CodeZynx AI activated.");
  };

  const handleClose = () => {
    setIsOpen(false);
    setMode(null);
    setStatus("idle");
    setInputValue("");
    speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
  };
  
  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-8 right-8 z-[999] w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
        aria-label="Open CodeZynx AI"
      >
        <BrainCircuit size={32} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1000] bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-neutral-900 to-gray-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-2xl text-white relative flex flex-col overflow-hidden" style={{ minHeight: '350px' }}>
            <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <BrainCircuit className="text-blue-500" size={24} />
                <div>
                  <h2 className="font-bold text-lg">{siteInfo.name} AI</h2>
                  <p className="text-xs text-neutral-400">A {siteInfo.founder} Initiative</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-neutral-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-grow p-8 flex flex-col justify-center items-center">
              {!mode && (
                <div className="flex flex-col md:flex-row gap-6">
                  <button onClick={() => setMode('text')} className="group flex flex-col items-center justify-center w-48 h-48 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg p-6 transition-all duration-300 transform hover:-translate-y-1">
                    <Keyboard size={48} className="text-neutral-400 group-hover:text-blue-400 transition-colors" />
                    <span className="mt-4 font-semibold text-lg">Text Command</span>
                    <span className="text-sm text-neutral-500">Type your request</span>
                  </button>
                  <button onClick={handleVoiceButtonClick} className="group flex flex-col items-center justify-center w-48 h-48 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg p-6 transition-all duration-300 transform hover:-translate-y-1">
                    <Mic size={48} className="text-neutral-400 group-hover:text-blue-400 transition-colors" />
                    <span className="mt-4 font-semibold text-lg">Voice Command</span>
                    <span className="text-sm text-neutral-500">Speak your request</span>
                  </button>
                </div>
              )}

              {mode === 'text' && (
                <div className="w-full max-w-lg flex flex-col items-center">
                  <Code size={40} className="text-blue-500 mb-4" />
                  <p className="text-neutral-300 mb-4">Enter a command to navigate or interact.</p>
                  <div className="w-full flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-full p-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && processCommand(inputValue)}
                      placeholder="e.g., 'Create a new CV' or 'Show my network'"
                      className="w-full bg-transparent text-white placeholder-neutral-500 focus:outline-none px-4"
                      autoFocus
                    />
                    <button onClick={() => processCommand(inputValue)} disabled={!inputValue || status === 'processing'} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-colors disabled:bg-neutral-600 disabled:cursor-not-allowed">
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              )}

              {mode === 'voice' && (
                <div className="w-full flex flex-col items-center justify-center h-full">
                  <p className="text-lg font-medium text-neutral-300 h-8 mb-4">{statusText()}</p>
                  <div className="w-full h-24 mb-4">
                     <canvas ref={visualizerRef} width="600" height="100" className="w-full h-full"></canvas>
                  </div>
                  <button 
                    onClick={() => {
                      if (status !== 'listening') {
                        setStatus('listening');
                        if (recognitionRef.current) recognitionRef.current.start();
                      }
                    }}
                    disabled={status === 'listening' || status === 'processing'}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${status === 'listening' ? 'bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                  >
                    <Mic size={40} className="text-white" />
                    {status === 'listening' && <div className="absolute inset-0 rounded-full bg-red-500 animate-ping"></div>}
                  </button>
                </div>
              )}

            </div>

             {mode && (
                <div className="p-2 border-t border-neutral-700 text-center">
                    <button onClick={() => setMode(null)} className="text-xs text-neutral-400 hover:text-white transition-colors">Back to selection</button>
                </div>
             )}
          </div>
        </div>
      )}
    </>
  );
}