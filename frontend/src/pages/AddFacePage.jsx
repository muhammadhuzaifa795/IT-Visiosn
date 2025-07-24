import { useState } from 'react';
import { useAddFace } from '../hooks/useFaceAuth';
import useAuthUser from '../hooks/useAuthUser';
import FaceCapture from '../components/FaceCapture';
import { ShipWheelIcon, UserPlus, CheckCircle, ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router';

export default function AddFacePage() {
  const { authUser } = useAuthUser();
  const { mutate, isPending, error, isSuccess } = useAddFace();
  const [step, setStep] = useState('capture'); // 'capture', 'processing', 'success'

  const handleCapture = (blob) => {
    if (!authUser) return;
    setStep('processing');
    const form = new FormData();
    form.append('face', blob, 'face.jpg');
    form.append('userId', authUser._id);
    mutate(form, {
      onSuccess: () => {
        setStep('success');
      },
      onError: () => {
        setStep('capture');
      }
    });
  };

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-200">
        <div className="card w-96 shadow-2xl bg-base-100 border border-error/20">
          <div className="card-body text-center">
            <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="size-8 text-error" />
            </div>
            <h2 className="card-title justify-center text-error">Access Denied</h2>
            <p className="text-base-content/70">You must be logged in to register your face.</p>
            <div className="card-actions justify-center mt-4">
              <Link to="/login" className="btn btn-primary">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4">
      
      {/* Header */}
      <div className="container mx-auto max-w-4xl pt-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="btn btn-ghost gap-2">
            <ArrowLeft className="size-5" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
              <ShipWheelIcon className="size-6 text-base-100" />
            </div>
            <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              CodeZynx
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl">
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              step === 'capture' ? 'bg-primary/20 text-primary' : 'bg-success/20 text-success'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                step === 'capture' ? 'bg-primary animate-pulse' : 'bg-success'
              }`}></div>
              <span className="text-sm font-medium">Capture Face</span>
            </div>
            
            <div className="w-8 h-px bg-base-300"></div>
            
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              step === 'processing' ? 'bg-secondary/20 text-secondary' : 
              step === 'success' ? 'bg-success/20 text-success' : 'bg-base-200 text-base-content/50'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                step === 'processing' ? 'bg-secondary animate-pulse' : 
                step === 'success' ? 'bg-success' : 'bg-base-content/30'
              }`}></div>
              <span className="text-sm font-medium">Processing</span>
            </div>
            
            <div className="w-8 h-px bg-base-300"></div>
            
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              step === 'success' ? 'bg-success/20 text-success' : 'bg-base-200 text-base-content/50'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                step === 'success' ? 'bg-success' : 'bg-base-content/30'
              }`}></div>
              <span className="text-sm font-medium">Complete</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="card bg-base-100 shadow-2xl border border-primary/10">
          <div className="card-body p-8">
            
            {step === 'capture' && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
                    <UserPlus className="size-8 text-base-100" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-base-content mb-2">Register Your Face</h2>
                    <p className="text-base-content/70 text-lg">
                      Set up secure face recognition for quick login access
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <FaceCapture onCapture={handleCapture} />
                </div>

                {error && (
                  <div className="alert alert-error">
                    <div className="flex items-center gap-2">
                      <Shield className="size-5" />
                      <span>{error.response?.data?.message || "Failed to register face"}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'processing' && (
              <div className="text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                  <div className="loading loading-spinner loading-lg text-secondary"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-base-content mb-2">Processing Your Face Data</h2>
                  <p className="text-base-content/70">
                    We're securely encoding your facial features. This may take a moment...
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="bg-secondary/10 rounded-full px-6 py-2">
                    <span className="text-secondary font-medium">Analyzing biometric data...</span>
                  </div>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <CheckCircle className="size-10 text-success" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-success mb-2">Face Registration Complete!</h2>
                  <p className="text-base-content/70 text-lg">
                    You can now use face recognition for quick and secure login.
                  </p>
                </div>
                
                <div className="bg-success/10 border border-success/20 rounded-xl p-6">
                  <h3 className="font-semibold text-success mb-2">What's Next?</h3>
                  <ul className="text-sm text-base-content/70 space-y-1">
                    <li>• Use the face login option on the sign-in page</li>
                    <li>• Your face data is encrypted and stored securely</li>
                    <li>• You can still use your email and password as backup</li>
                  </ul>
                </div>

                <div className="flex justify-center gap-4">
                  <Link to="/" className="btn btn-primary btn-wide">
                    <CheckCircle className="size-5" />
                    Go to Dashboard
                  </Link>
                  <Link to="/login" className="btn btn-ghost">
                    Try Face Login
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="bg-info/10 border border-info/20 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="size-4 text-info" />
              <span className="font-medium text-info text-sm">Security & Privacy</span>
            </div>
            <p className="text-xs text-base-content/60">
              Your facial data is encrypted using industry-standard security measures and is never shared with third parties. 
              You can remove this data anytime from your account settings.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}