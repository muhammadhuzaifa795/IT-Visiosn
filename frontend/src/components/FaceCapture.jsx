import { useRef, useState, useEffect } from "react";
import { Camera, X, Loader, CheckCircle, AlertCircle, RotateCcw } from "lucide-react";

export default function FaceCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [captured, setCaptured] = useState(false);
  const [error, setError] = useState(null);

  const startCamera = async () => {
    try {
      setError(null);
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user' 
        } 
      });
      setStream(s);
      videoRef.current.srcObject = s;
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setCountdown(null);
    setIsCapturing(false);
    setCaptured(false);
  };

  const startCountdown = () => {
    setIsCapturing(true);
    let count = 3;
    setCountdown(count);
    
    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        setCountdown("📸");
        clearInterval(timer);
        setTimeout(capture, 300);
      }
    }, 1000);
  };

  const capture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      onCapture(blob);
      setCaptured(true);
      setTimeout(() => {
        stopCamera();
      }, 1500);
    }, "image/jpeg", 0.8);
    
    setCountdown(null);
    setIsCapturing(false);
  };

  const reset = () => {
    setCaptured(false);
    setError(null);
  };

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, [stream]);

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-error/10 border border-error/20 rounded-xl p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="size-6 text-error" />
          </div>
          <div>
            <h3 className="font-semibold text-error mb-1">Camera Error</h3>
            <p className="text-sm text-base-content/70">{error}</p>
          </div>
          <button 
            onClick={() => { setError(null); startCamera(); }}
            className="btn btn-error btn-sm"
          >
            <RotateCcw className="size-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (captured) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-success/10 border border-success/20 rounded-xl p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <CheckCircle className="size-6 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-success mb-1">Face Captured!</h3>
            <p className="text-sm text-base-content/70">Verifying your identity...</p>
          </div>
          <div className="loading loading-dots loading-sm text-success"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      
      {/* Video Container */}
      <div className="relative rounded-2xl overflow-hidden bg-base-300 shadow-lg">
        {stream ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full aspect-[4/3] object-cover"
            />
            
            {/* Overlay Elements */}
            <div className="absolute inset-0 pointer-events-none">
              
              {/* Face Detection Frame */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-48 h-56 border-2 border-secondary rounded-2xl relative">
                  {/* Corner indicators */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-secondary rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-secondary rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-secondary rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-secondary rounded-br-lg"></div>
                  
                  {/* Center guidance text */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-base-content/60 text-center whitespace-nowrap">
                    Position your face here
                  </div>
                </div>
              </div>

              {/* Countdown Overlay */}
              {countdown && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-6xl font-bold text-white animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Status Indicator */}
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-xs font-medium">Live</span>
                </div>
              </div>

            </div>
          </>
        ) : (
          <div className="w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                <Camera className="size-8 text-secondary" />
              </div>
              <p className="text-base-content/70 font-medium">Camera Ready</p>
            </div>
          </div>
        )}
      </div>

      {/* Canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!stream ? (
          <button 
            className="btn btn-secondary btn-wide shadow-lg hover:scale-105 transition-all duration-200" 
            onClick={startCamera}
          >
            <Camera className="size-5" />
            Start Camera
          </button>
        ) : (
          <>
            <button 
              className="btn btn-success shadow-lg hover:scale-105 transition-all duration-200 relative overflow-hidden" 
              onClick={startCountdown}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <>
                  <Loader className="size-5 animate-spin" />
                  Capturing...
                </>
              ) : (
                <>
                  <Camera className="size-5" />
                  Capture Face
                </>
              )}
            </button>
            
            <button 
              className="btn btn-ghost hover:scale-105 transition-all duration-200" 
              onClick={stopCamera}
            >
              <X className="size-5" />
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center space-y-2">
        <p className="text-sm text-base-content/60">
          • Position your face within the frame
        </p>
        <p className="text-sm text-base-content/60">
          • Ensure good lighting and look directly at the camera
        </p>
        <p className="text-sm text-base-content/60">
          • Keep still during the 3-second countdown
        </p>
      </div>

    </div>
  );
}