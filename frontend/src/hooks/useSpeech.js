import { useState, useEffect } from 'react';

export const useSpeech = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const startListening = () => {
    if (!isSupported) return;
    
    setListening(true);
    setTranscript('');
    // Implement speech recognition logic here
  };

  const stopListening = () => {
    setListening(false);
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    listening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    speak: (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };
};