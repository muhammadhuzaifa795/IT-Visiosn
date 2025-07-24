import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, RotateCcw, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceInput = ({ onTranscript, placeholder = "Click to speak..." }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            setConfidence(result[0].confidence);
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        if (finalTranscript) {
          const newTranscript = transcript + finalTranscript + ' ';
          setTranscript(newTranscript);
          onTranscript?.(newTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [transcript, onTranscript]);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    onTranscript?.('');
    setConfidence(0);
  };

  const applyTranscript = () => {
    onTranscript?.(transcript);
  };

  if (!isSupported) {
    return (
      <div className="alert alert-warning">
        <Volume2 className="w-5 h-5" />
        <span>Speech recognition is not supported in this browser</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Voice Control Panel */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? stopListening : startListening}
          className={`btn btn-circle ${
            isListening 
              ? 'btn-error animate-pulse' 
              : 'btn-primary hover:btn-secondary'
          } shadow-lg`}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="mic-off"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <MicOff className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="mic-on"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                transition={{ duration: 0.2 }}
              >
                <Mic className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">
              {isListening ? 'Listening...' : 'Voice Input Ready'}
            </span>
            {confidence > 0 && (
              <div className="badge badge-success badge-sm">
                {Math.round(confidence * 100)}% confident
              </div>
            )}
          </div>
          
          {isListening && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    animate={{
                      height: [4, 16, 4],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-primary animate-pulse">
                Speak clearly into your microphone
              </span>
            </div>
          )}
        </div>

        {transcript && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={applyTranscript}
              className="btn btn-success btn-sm gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Apply
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetTranscript}
              className="btn btn-ghost btn-sm"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Live Transcript Display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-base-200 rounded-xl p-4 border-l-4 border-primary"
          >
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Live Transcript</span>
              {confidence > 0.8 && (
                <div className="badge badge-success badge-xs">High Quality</div>
              )}
            </div>
            <p className="text-sm leading-relaxed">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="text-xs text-base-content/60 space-y-1">
        <p>• Click the microphone to start/stop voice input</p>
        <p>• Speak clearly and at a normal pace for best results</p>
        <p>• Click "Apply" to use the transcribed text</p>
      </div>
    </div>
  );
};

export default VoiceInput;