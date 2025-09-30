import { useRef, useState, useEffect } from "react";
import { Camera, X, Loader, CheckCircle, AlertCircle, RotateCcw, Scan, UserCheck } from "lucide-react";

export default function FaceCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [captured, setCaptured] = useState(false);
  const [error, setError] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [scanStage, setScanStage] = useState("position"); // position, scanning, verifying

  const startCamera = async () => {
    try {
      setError(null);
      setFaceDetected(false);
      setScanStage("position");
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user' 
        } 
      });
      setStream(s);
      videoRef.current.srcObject = s;
      
      // Simulate face detection after camera starts
      setTimeout(() => {
        setFaceDetected(true);
      }, 1000);
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setScanProgress(0);
    setIsCapturing(false);
    setCaptured(false);
    setFaceDetected(false);
    setScanStage("position");
  };

  const startFaceScan = () => {
    setIsCapturing(true);
    setScanStage("scanning");
    setScanProgress(0);
    
    // Simulate biometric scanning process
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          setScanStage("verifying");
          setTimeout(() => {
            capture();
          }, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
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
      }, 2000);
    }, "image/jpeg", 0.8);
    
    setScanProgress(0);
    setIsCapturing(false);
  };

  const reset = () => {
    setCaptured(false);
    setError(null);
    setFaceDetected(false);
    setScanStage("position");
  };

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, [stream]);

  // Face detection dots animation
  const FaceDetectionDots = () => (
    <div className="absolute inset-0 pointer-events-none">
      {/* Animated scanning dots around face area */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-48 h-56 relative">
          {/* Top left dot */}
          <div className={`absolute -top-2 -left-2 w-4 h-4 rounded-full bg-green-400 animate-ping ${faceDetected ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}></div>
          {/* Top right dot */}
          <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full bg-green-400 animate-ping ${faceDetected ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 delay-150`}></div>
          {/* Bottom left dot */}
          <div className={`absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-green-400 animate-ping ${faceDetected ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 delay-300`}></div>
          {/* Bottom right dot */}
          <div className={`absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-green-400 animate-ping ${faceDetected ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 delay-450`}></div>
        </div>
      </div>
    </div>
  );

  // Scanning lines animation
  const ScanningLines = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Horizontal scanning line */}
      <div 
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-lg shadow-green-400/50"
        style={{
          top: `${scanProgress}%`,
          transition: 'top 0.1s linear'
        }}
      ></div>
      
      {/* Vertical scanning line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-400 to-transparent shadow-lg shadow-blue-400/50"
        style={{
          left: `${scanProgress}%`,
          transition: 'left 0.1s linear'
        }}
      ></div>
      
      {/* Circular scan effect */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-purple-400 shadow-lg shadow-purple-400/50"
        style={{
          width: `${scanProgress * 2}px`,
          height: `${scanProgress * 2}px`,
          transition: 'all 0.1s linear',
          opacity: scanProgress > 0 && scanProgress < 100 ? 0.6 : 0
        }}
      ></div>
    </div>
  );

  // Biometric verification steps
  const VerificationSteps = () => (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 space-y-2">
      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
        <div className={`w-2 h-2 rounded-full ${scanStage === 'position' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
        <span className={scanStage === 'position' ? 'font-semibold' : ''}>Position Face</span>
        
        <div className={`w-2 h-2 rounded-full ${scanStage === 'scanning' ? 'bg-yellow-400 animate-pulse' : scanStage === 'verifying' || scanStage === 'completed' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
        <span className={scanStage === 'scanning' ? 'font-semibold' : ''}>Biometric Scan</span>
        
        <div className={`w-2 h-2 rounded-full ${scanStage === 'verifying' ? 'bg-yellow-400 animate-pulse' : scanStage === 'completed' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
        <span className={scanStage === 'verifying' ? 'font-semibold' : ''}>Verification</span>
      </div>
    </div>
  );

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
            <h3 className="font-semibold text-success mb-1">Identity Verified!</h3>
            <p className="text-sm text-base-content/70">Welcome back! Redirecting...</p>
          </div>
          <div className="loading loading-dots loading-sm text-success"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      
      {/* Video Container */}
      <div className="relative rounded-2xl overflow-hidden bg-base-300 shadow-lg border-2 border-base-400">
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
                <div className={`w-48 h-56 border-2 ${faceDetected ? 'border-green-400' : 'border-yellow-400'} rounded-2xl relative transition-colors duration-500`}>
                  {/* Corner indicators with animation */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-current rounded-tl-lg animate-pulse"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-current rounded-tr-lg animate-pulse delay-100"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-current rounded-bl-lg animate-pulse delay-200"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-current rounded-br-lg animate-pulse delay-300"></div>
                  
                  {/* Center guidance text */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 whitespace-nowrap font-medium">
                    {faceDetected ? 'Face Detected ✓' : 'Position Face in Frame'}
                  </div>

                  {/* Progress ring */}
                  {isCapturing && (
                    <div className="absolute -inset-4 rounded-full border-4 border-transparent border-t-green-400 animate-spin-slow"></div>
                  )}
                </div>
              </div>

              {/* Face Detection Dots */}
              <FaceDetectionDots />

              {/* Scanning Lines */}
              {isCapturing && <ScanningLines />}

              {/* Verification Steps */}
              <VerificationSteps />

              {/* Status Indicator */}
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className={`w-2 h-2 rounded-full ${faceDetected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-pulse'}`}></div>
                  <span className="text-white text-xs font-medium">
                    {faceDetected ? 'Ready to Scan' : 'Detecting Face...'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {isCapturing && (
                <div className="absolute top-4 right-4 left-20 bg-black/50 backdrop-blur-sm rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-100 ease-linear"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              )}

            </div>
          </>
        ) : (
          <div className="w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Camera className="size-8 text-secondary" />
              </div>
              <p className="text-base-content/70 font-medium">Camera Ready</p>
              <p className="text-xs text-base-content/50">Click start to begin facial recognition</p>
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
            className="btn btn-secondary btn-wide shadow-lg hover:scale-105 transition-all duration-200 gap-2" 
            onClick={startCamera}
          >
            <Camera className="size-5" />
            Start Camera
          </button>
        ) : (
          <>
            <button 
              className="btn btn-success shadow-lg hover:scale-105 transition-all duration-200 gap-2 relative overflow-hidden disabled:opacity-50" 
              onClick={startFaceScan}
              disabled={isCapturing || !faceDetected}
            >
              {isCapturing ? (
                <>
                  <Loader className="size-5 animate-spin" />
                  Scanning... {scanProgress}%
                </>
              ) : (
                <>
                  <Scan className="size-5" />
                  Start Face Scan
                </>
              )}
            </button>
            
            <button 
              className="btn btn-ghost hover:scale-105 transition-all duration-200 gap-2" 
              onClick={stopCamera}
              disabled={isCapturing}
            >
              <X className="size-5" />
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
        <div className="bg-base-200/50 rounded-lg p-3">
          <div className="text-lg mb-1">👤</div>
          <p className="text-xs text-base-content/70 font-medium">Center your face in frame</p>
        </div>
        <div className="bg-base-200/50 rounded-lg p-3">
          <div className="text-lg mb-1">💡</div>
          <p className="text-xs text-base-content/70 font-medium">Ensure good lighting</p>
        </div>
        <div className="bg-base-200/50 rounded-lg p-3">
          <div className="text-lg mb-1">⚡</div>
          <p className="text-xs text-base-content/70 font-medium">Hold still during scan</p>
        </div>
      </div>

      {/* Scan Progress Info */}
      {isCapturing && (
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-base-content/70">
            <UserCheck className="size-4 text-green-400" />
            <span>Scanning biometric data...</span>
          </div>
          <div className="text-xs text-base-content/50">
            {scanProgress < 30 && "Initializing facial recognition..."}
            {scanProgress >= 30 && scanProgress < 60 && "Analyzing facial features..."}
            {scanProgress >= 60 && scanProgress < 90 && "Matching biometric patterns..."}
            {scanProgress >= 90 && "Finalizing verification..."}
          </div>
        </div>
      )}

    </div>
  );
}