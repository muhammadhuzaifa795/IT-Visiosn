"use client"

import { useState, useEffect, useCallback } from "react"

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = "en-US"

        recognitionInstance.onresult = (event) => {
          let currentTranscript = ""
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript
          }
          setTranscript(currentTranscript)
        }

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error", event.error)
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          if (isListening) {
            recognitionInstance.start()
          }
        }

        setRecognition(recognitionInstance)
      } else {
        console.error("Speech recognition not supported in this browser")
      }
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition) {
      setTranscript("")
      setIsListening(true)
      recognition.start()
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      setIsListening(false)
      recognition.stop()
    }
  }, [recognition])

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  }
}

export default useSpeechRecognition
