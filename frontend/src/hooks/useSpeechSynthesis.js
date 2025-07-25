"use client"

import { useState, useEffect, useCallback } from "react"

const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([])
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true)

      // Get voices
      const updateVoices = () => {
        setVoices(window.speechSynthesis.getVoices())
      }

      updateVoices()

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices
      }
    }
  }, [])

  const speak = useCallback(
    (text, voiceIndex = 0, rate = 1, pitch = 1) => {
      if (!supported) return

      // Cancel any ongoing speech first
      window.speechSynthesis.cancel()

      if (!text) return

      const utterance = new SpeechSynthesisUtterance(text)

      if (voices.length > 0) {
        utterance.voice = voices[voiceIndex % voices.length]
      }

      utterance.rate = rate
      utterance.pitch = pitch

      utterance.onstart = () => {
        setSpeaking(true)
      }

      utterance.onend = () => {
        setSpeaking(false)
      }

      utterance.onerror = () => {
        setSpeaking(false)
      }

      // Add a small delay to ensure previous speech is cancelled
      setTimeout(() => {
        window.speechSynthesis.speak(utterance)
      }, 100)
    },
    [supported, voices],
  )

  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [supported])

  return {
    speak,
    cancel,
    speaking,
    supported,
    voices,
  }
}

export default useSpeechSynthesis
