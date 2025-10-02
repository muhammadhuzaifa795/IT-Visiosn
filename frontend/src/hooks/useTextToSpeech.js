// hooks/useTextToSpeech.js
import { useState, useCallback, useEffect } from 'react'

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [voices, setVoices] = useState([])

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
      
      // Set default voice - try to find male and female voices
      if (availableVoices.length > 0 && !selectedVoice) {
        // Prefer Microsoft voices for Windows, Google voices for Chrome
        const femaleVoice = availableVoices.find(voice => 
          voice.name.includes('Female') || 
          voice.name.includes('Zira') ||
          voice.name.includes('Google UK English Female') ||
          voice.name.toLowerCase().includes('female')
        )
        
        const maleVoice = availableVoices.find(voice => 
          voice.name.includes('Male') || 
          voice.name.includes('David') ||
          voice.name.includes('Google UK English Male') ||
          voice.name.toLowerCase().includes('male')
        )
        
        // Set female voice as default if available, otherwise first voice
        setSelectedVoice(femaleVoice || availableVoices[0])
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [selectedVoice])

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Use selected voice if available
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
      
      // Voice settings based on voice type
      if (selectedVoice?.name.toLowerCase().includes('female') || selectedVoice?.name.includes('Zira')) {
        utterance.rate = 0.9
        utterance.pitch = 1.2
        utterance.volume = 1
      } else {
        // Male voice settings
        utterance.rate = 0.9
        utterance.pitch = 0.8
        utterance.volume = 1
      }
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    }
  }, [selectedVoice])

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  const setVoice = useCallback((voiceType) => {
    const availableVoices = window.speechSynthesis.getVoices()
    
    if (voiceType === 'female') {
      // Find female voice
      const femaleVoice = availableVoices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Zira') ||
        voice.name.includes('Google UK English Female') ||
        voice.name.toLowerCase().includes('female') ||
        voice.name.includes('Karen') || // Australian female
        voice.name.includes('Samantha') // macOS female
      )
      if (femaleVoice) {
        setSelectedVoice(femaleVoice)
        return true
      }
    } else if (voiceType === 'male') {
      // Find male voice
      const maleVoice = availableVoices.find(voice => 
        voice.name.includes('Male') || 
        voice.name.includes('David') ||
        voice.name.includes('Google UK English Male') ||
        voice.name.toLowerCase().includes('male') ||
        voice.name.includes('Daniel') || // Australian male
        voice.name.includes('Alex') // macOS male
      )
      if (maleVoice) {
        setSelectedVoice(maleVoice)
        return true
      }
    }
    
    // Fallback to first available voice
    if (availableVoices.length > 0) {
      setSelectedVoice(availableVoices[0])
    }
    
    return false
  }, [])

  return {
    isSpeaking,
    speak,
    stopSpeaking,
    setVoice,
    selectedVoice: selectedVoice?.name || 'Default',
    voices: voices.map(v => v.name)
  }
}

export default useTextToSpeech