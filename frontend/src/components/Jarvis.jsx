"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import {
  isUrdu,
  urduResponses,
  urduNavigationCommands,
  getRandomUrduResponse,
  getUrduGreeting,
  formatTimeInUrdu,
  formatDateInUrdu,
  normalizeUrduText,
} from "../utils/urdu";

const WAKE_WORDS = ["hi jarvis", "hello jarvis", "jarvis", "kaise ho jarvis", "سلام jarvis", "کیسے ہو jarvis"];

const NAVIGATION_COMMANDS = {
  "go to dashboard": "/dashboard",
  "open dashboard": "/dashboard",
  "dashboard": "/dashboard",
  "go to profile": "/profile",
  "open profile": "/profile",
  "my profile": "/profile",
  "go to cv builder": "/cv-builder",
  "open cv builder": "/cv-builder",
  "create cv": "/cv-builder",
  "cv builder": "/cv-builder",
  "go to interviews": "/interviews",
  "open interviews": "/interviews",
  "interviews": "/interviews",
  "go to network": "/network",
  "open network": "/network",
  "my network": "/network",
  "go home": "/",
  "home page": "/",
  "main page": "/",
  ...urduNavigationCommands,
};

export default function JarvisSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Say 'Hi JARVIS' to activate");

  const recognitionRef = useRef(null);
  const wakeWordRecognitionRef = useRef(null);
  const isMountedRef = useRef(true);

  const speak = useCallback((text, lang = "en-US") => {
    return new Promise((resolve) => {
      if (!isMountedRef.current || !("speechSynthesis" in window)) {
        resolve();
        return;
      }
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = lang === "ur-PK" ? 0.8 : 0.9;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        if (isMountedRef.current) setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        if (isMountedRef.current) setIsSpeaking(false);
        resolve();
      };
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    });
  }, []);

  const handleNavigation = useCallback((route) => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", route);
      const routeName = route === "/" ? "Home" : route.replace("/", "").replace("-", " ");
      const navMessage = isUrdu(route) ? `${routeName} پر جا رہے ہیں...` : `Navigating to ${routeName}...`;
      speak(navMessage, isUrdu(route) ? "ur-PK" : "en-US");
    }
  }, [speak]);

  const getContextualResponse = useCallback((command) => {
    const lowerCommand = normalizeUrduText(command.toLowerCase());
    if (lowerCommand.includes("سلام") || lowerCommand.includes("آداب")) return getRandomUrduResponse(urduResponses.greeting);
    if (lowerCommand.includes("کیسے ہو") || lowerCommand.includes("کیا حال")) return getRandomUrduResponse(urduResponses.howAreYou);
    if (lowerCommand.includes("مدد") || lowerCommand.includes("help")) return getRandomUrduResponse(urduResponses.help);
    if (lowerCommand.includes("شکریہ") || lowerCommand.includes("thank")) return getRandomUrduResponse(urduResponses.thanks);
    if (lowerCommand.includes("وقت") || lowerCommand.includes("time")) return isUrdu(command) ? `ابھی وقت ${formatTimeInUrdu()} ہے۔` : `The current time is ${new Date().toLocaleTimeString()}.`;
    if (lowerCommand.includes("تاریخ") || lowerCommand.includes("date")) return isUrdu(command) ? `آج ${formatDateInUrdu()} ہے۔` : `Today is ${new Date().toLocaleDateString()}.`;
    if (lowerCommand.includes("hello") || lowerCommand.includes("hi")) return "Hello! How can I help you today?";
    if (lowerCommand.includes("how are you")) return "I'm doing great! Ready to assist you with anything you need.";
    return null;
  }, []);

  const processCommand = useCallback(async (command) => {
    if (!isMountedRef.current) return;
    setIsProcessing(true);
    const detectedUrdu = isUrdu(command);
    setStatus(detectedUrdu ? "عمل کاری..." : "Processing...");

    try {
      setMessages(prev => [...prev.slice(-4), { role: "user", content: command, time: new Date().toLocaleTimeString() }]);
      const lowerCommand = command.toLowerCase();
      const navRoute = NAVIGATION_COMMANDS[lowerCommand];

      if (navRoute) {
        handleNavigation(navRoute);
        const routeName = navRoute === "/" ? "Home" : navRoute.replace("/", "").replace("-", " ");
        const content = detectedUrdu ? `${routeName} پر جا رہے ہیں...` : `Navigating to ${routeName}...`;
        setMessages(prev => [...prev.slice(-4), { role: "assistant", content, time: new Date().toLocaleTimeString() }]);
      } else {
        const contextualResponse = getContextualResponse(command);
        if (contextualResponse) {
          setMessages(prev => [...prev.slice(-4), { role: "assistant", content: contextualResponse, time: new Date().toLocaleTimeString() }]);
          await speak(contextualResponse, detectedUrdu ? "ur-PK" : "en-US");
        } else {
          const { text } = await generateText({
            model: google("gemini-1.5-flash"),
            system: `You are JARVIS, an AI assistant for the CodeZynx platform. Be conversational and brief. Respond in the user's language (English or Urdu). Current time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' })}. Platform owner: Rajeel Siddiqui. Available pages: Dashboard, Profile, CV Builder, Interviews, Network, Home.`,
            prompt: command,
          });
          setMessages(prev => [...prev.slice(-4), { role: "assistant", content: text, time: new Date().toLocaleTimeString() }]);
          await speak(text, detectedUrdu ? "ur-PK" : "en-US");
        }
      }
    } catch (error) {
      console.error("Error processing command:", error);
      const errorMsg = "Sorry, I encountered an issue. Please try again.";
      setMessages(prev => [...prev.slice(-4), { role: "assistant", content: errorMsg, time: new Date().toLocaleTimeString() }]);
      await speak(errorMsg, "en-US");
    } finally {
      if (isMountedRef.current) {
        setIsProcessing(false);
        setStatus(detectedUrdu ? "سن رہا ہوں..." : "Listening...");
        if (isOpen && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error("Error restarting command recognition:", e);
          }
        }
      }
    }
  }, [isOpen, speak, handleNavigation, getContextualResponse]);

  useEffect(() => {
    isMountedRef.current = true;
    if (!("webkitSpeechRecognition" in window)) {
      setStatus("Speech recognition not supported");
      return;
    }

    const wakeWordRecognition = new window.webkitSpeechRecognition();
    wakeWordRecognition.continuous = true;
    wakeWordRecognition.interimResults = true;
    wakeWordRecognition.lang = "en-US";

    const commandRecognition = new window.webkitSpeechRecognition();
    commandRecognition.continuous = false;
    commandRecognition.interimResults = false;
    commandRecognition.lang = "en-US";

    wakeWordRecognitionRef.current = wakeWordRecognition;
    recognitionRef.current = commandRecognition;

    wakeWordRecognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(result => result[0].transcript).join('').toLowerCase();
      if (WAKE_WORDS.some(word => transcript.includes(word))) {
        if (!isOpen) {
            const isUrduWakeWord = transcript.includes("سلام") || transcript.includes("کیسے");
            setIsOpen(true);
            speak(
                isUrduWakeWord ? `${getUrduGreeting()} میں JARVIS ہوں، آپ کی کیا مدد کر سکتا ہوں؟` : "JARVIS activated. How can I help?",
                isUrduWakeWord ? "ur-PK" : "en-US"
            );
        }
      }
    };

    wakeWordRecognition.onend = () => {
      if (isMountedRef.current && !isOpen) {
        setTimeout(() => wakeWordRecognitionRef.current?.start(), 500);
      }
    };

    commandRecognition.onstart = () => isMountedRef.current && setIsListening(true);
    commandRecognition.onend = () => isMountedRef.current && setIsListening(false);
    commandRecognition.onerror = (event) => {
        if (isMountedRef.current) {
            setIsListening(false);
            if (event.error !== 'no-speech') console.error("Command recognition error:", event.error);
        }
    };
    commandRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (transcript && isMountedRef.current) {
        processCommand(transcript);
      }
    };

    return () => {
      isMountedRef.current = false;
      wakeWordRecognitionRef.current?.stop();
      recognitionRef.current?.stop();
      speechSynthesis.cancel();
    };
  }, [processCommand]);

  useEffect(() => {
    if (!wakeWordRecognitionRef.current || !recognitionRef.current) return;
    if (isOpen) {
      wakeWordRecognitionRef.current.stop();
      setStatus("Listening...");
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting command recognition:", e)
      }
    } else {
      recognitionRef.current.stop();
      setStatus("Say 'Hi JARVIS' to activate");
      try {
        wakeWordRecognitionRef.current.start();
      } catch (e) {
        console.error("Error starting wake word recognition:", e)
      }
    }
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  const handleListen = () => {
    if (recognitionRef.current && !isListening && !isProcessing) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting manual listen:", e);
      }
    }
  };
  
  const handleOpen = () => {
    if (!isOpen) {
        setIsOpen(true);
        speak("How can I assist you?", "en-US");
    }
  }

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 text-center">
          <button
            onClick={handleOpen}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </button>
          <div className="text-xs mt-2 text-gray-600">Say or Tap JARVIS</div>
        </div>
      )}

      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isListening
                    ? "bg-red-400 animate-pulse"
                    : isSpeaking
                    ? "bg-green-400 animate-pulse"
                    : isProcessing
                    ? "bg-yellow-400 animate-spin"
                    : "bg-white"
                }`}
              ></div>
              <h2 className="font-bold">JARVIS</h2>
            </div>
            <button onClick={handleClose} className="text-white hover:text-gray-200">✕</button>
          </div>

          <div className="p-3 bg-gray-50 border-b text-sm text-center text-gray-600">{status}</div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>👋 Hi! I'm JARVIS</p>
                <p className="text-sm mt-2">Ask me anything or say:</p>
                <div className="text-xs mt-3 space-y-1 text-left bg-gray-100 p-3 rounded">
                  <p>• "Go to dashboard" / "ڈیش بورڈ جاؤ"</p>
                  <p>• "Open CV builder" / "سی وی بنانا"</p>
                  <p>• "What time is it?" / "وقت کیا ہے؟"</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <button
              onClick={handleListen}
              disabled={isListening || isProcessing}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${isListening ? "bg-red-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"} disabled:opacity-50`}
            >
              {isListening ? "🎤 سن رہا ہوں..." : "🎤 Tap to Speak"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}