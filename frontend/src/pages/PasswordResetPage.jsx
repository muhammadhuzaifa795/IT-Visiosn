import { useState, useEffect } from "react";
import { ShipWheelIcon, ArrowLeft, CheckCircle, Phone, Lock, Shield, Mail, Smartphone } from "lucide-react";
import { Link } from "react-router";
import { useSendOTP, useResendOTP, useVerifyOTP, useResetPassword } from "../hooks/usePasswordReset";

const PasswordResetPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contactMethod, setContactMethod] = useState("email"); // "email" or "phone"
  const [contactData, setContactData] = useState({
    email: "",
    phone: ""
  });
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [countdown, setCountdown] = useState(0);

  const { sendOTPMutation, isSendingOTP, sendOTPError, otpSent } = useSendOTP();
  const { resendOTPMutation, isResendingOTP, resendOTPError, otpResent } = useResendOTP();
  const { verifyOTPMutation, isVerifyingOTP, verifyOTPError, otpVerified, resetVerifyOTP } = useVerifyOTP();
  const { resetPasswordMutation, isResettingPassword, resetPasswordError, passwordReset, resetPasswordReset } = useResetPassword();

  // Reset states when going back to previous steps
  const handleBackToPhone = () => {
    setCurrentStep(1);
    setOtp("");
    resetVerifyOTP();
  };

  const handleBackToOTP = () => {
    setCurrentStep(2);
    setPasswords({ newPassword: "", confirmPassword: "" });
    resetPasswordReset();
  };

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-advance steps based on success states
  useEffect(() => {
    if (otpSent) {
      setCurrentStep(2);
      setCountdown(30); // 30 seconds countdown
    }
  }, [otpSent]);

  useEffect(() => {
    if (otpVerified) {
      setCurrentStep(3);
    }
  }, [otpVerified]);

  const handleSendOTP = (e) => {
    e.preventDefault();
    const currentContact = contactMethod === "email" ? contactData.email : contactData.phone;
    if (!currentContact.trim()) return;
    
    const payload = contactMethod === "email" 
      ? { email: contactData.email }
      : { phone: contactData.phone };
    
    sendOTPMutation(payload);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    
    const payload = contactMethod === "email" 
      ? { email: contactData.email }
      : { phone: contactData.phone };
    
    verifyOTPMutation({ data: payload, otp });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return;
    }
    if (!passwords.newPassword.trim()) return;
    
    const payload = contactMethod === "email" 
      ? { email: contactData.email }
      : { phone: contactData.phone };
    
    resetPasswordMutation({ data: payload, newPassword: passwords.newPassword });
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      setOtp(""); // Clear previous OTP
      if (contactMethod === "email") {
        resendOTPMutation(contactData.email);
      } else {
        const payload = { phone: contactData.phone };
        sendOTPMutation(payload);
      }
      setCountdown(30);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= step
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-200 text-base-content/50'
              }`}
            >
              {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 3 && (
              <div
                className={`w-12 h-1 mx-2 ${
                  currentStep > step ? 'bg-primary' : 'bg-base-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPhoneStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Forgot Password?</h2>
        <p className="text-base-content/70">
          Choose how you'd like to receive your verification code to reset your password.
        </p>
      </div>

      {/* Contact Method Selection */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={`p-4 rounded-lg border-2 transition-all ${
              contactMethod === "email"
                ? "border-primary bg-primary/10 text-primary"
                : "border-base-300 hover:border-base-400"
            }`}
            onClick={() => setContactMethod("email")}
          >
            <div className="flex flex-col items-center space-y-2">
              <Mail className="w-6 h-6" />
              <span className="text-sm font-medium">Email</span>
            </div>
          </button>
          <button
            type="button"
            className={`p-4 rounded-lg border-2 transition-all ${
              contactMethod === "phone"
                ? "border-primary bg-primary/10 text-primary"
                : "border-base-300 hover:border-base-400"
            }`}
            onClick={() => setContactMethod("phone")}
          >
            <div className="flex flex-col items-center space-y-2">
              <Smartphone className="w-6 h-6" />
              <span className="text-sm font-medium">Phone</span>
            </div>
          </button>
        </div>
      </div>
      {sendOTPError && (
        <div className="alert alert-error">
          <span>{sendOTPError.response?.data?.message || 'Failed to send OTP'}</span>
        </div>
      )}

      <form onSubmit={handleSendOTP} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              {contactMethod === "email" ? "Email Address" : "Phone Number"}
            </span>
          </label>
          <input
            type={contactMethod === "email" ? "email" : "tel"}
            placeholder={contactMethod === "email" ? "your@email.com" : "+1 (555) 123-4567"}
            className="input input-bordered w-full"
            value={contactMethod === "email" ? contactData.email : contactData.phone}
            onChange={(e) => setContactData({
              ...contactData,
              [contactMethod]: e.target.value
            })}
            disabled={isSendingOTP}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full"
          disabled={isSendingOTP || !(contactMethod === "email" ? contactData.email.trim() : contactData.phone.trim())}
        >
          {isSendingOTP ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Sending...
            </>
          ) : (
            'Send Verification Code'
          )}
        </button>
      </form>
    </div>
  );

  const renderOTPStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Enter Verification Code</h2>
        <p className="text-base-content/70">
          We've sent a 6-digit code to {contactMethod === "email" ? contactData.email : contactData.phone}. Enter it below to verify your identity.
        </p>
      </div>

      {verifyOTPError && (
        <div className="alert alert-error">
          <span>{verifyOTPError.response?.data?.message || 'Invalid or expired OTP'}</span>
        </div>
      )}

      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Verification Code</span>
          </label>
          <input
            type="text"
            placeholder="123456"
            className="input input-bordered w-full text-center text-2xl tracking-wider"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength="6"
            required
          />
          <label className="label">
            <span className="label-text-alt">Code expires in 30 minutes</span>
          </label>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full"
          disabled={isVerifyingOTP || otp.length !== 6}
        >
          {isVerifyingOTP ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-base-content/70">
            Didn't receive the code?{" "}
            <button
              type="button"
              className={`link link-primary ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleResendOTP}
              disabled={countdown > 0 || isResendingOTP}
            >
              {isResendingOTP ? 'Resending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
            </button>
          </p>
        </div>
      </form>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Create New Password</h2>
        <p className="text-base-content/70">
          Choose a strong password to secure your account.
        </p>
      </div>

      {resetPasswordError && (
        <div className="alert alert-error">
          <span>{resetPasswordError.response?.data?.message || 'Failed to reset password'}</span>
        </div>
      )}

      {passwordReset ? (
        <div className="space-y-6">
          <div className="alert alert-success">
            <CheckCircle className="w-6 h-6" />
            <span>Password reset successfully! You can now sign in with your new password.</span>
          </div>
          <Link to="/login" className="btn btn-primary w-full">
            Continue to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="input input-bordered w-full"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              required
              minLength="6"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm New Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="input input-bordered w-full"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              required
              minLength="6"
            />
            {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
              <label className="label">
                <span className="label-text-alt">Passwords do not match</span>
              </label>
            )}
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            <p className="text-sm text-base-content/70 mb-2">Password requirements:</p>
            <ul className="text-xs text-base-content/60 space-y-1">
              <li>• At least 6 characters long</li>
              <li>• Mix of letters and numbers recommended</li>
              <li>• Avoid common passwords</li>
            </ul>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={isResettingPassword || passwords.newPassword !== passwords.confirmPassword || !passwords.newPassword}
          >
            {isResettingPassword ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-base-100 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            {currentStep === 1 ? (
              <Link to="/login" className="btn btn-ghost btn-sm">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            ) : currentStep === 2 ? (
              <button onClick={handleBackToPhone} className="btn btn-ghost btn-sm">
                <ArrowLeft className="w-4 h-4" />
                Change Phone
              </button>
            ) : (
              <button onClick={handleBackToOTP} className="btn btn-ghost btn-sm">
                <ArrowLeft className="w-4 h-4" />
                Back to OTP
              </button>
            )}
            <div className="flex items-center gap-2">
              <ShipWheelIcon className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold">CodeZynx</span>
            </div>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step Content */}
          {currentStep === 1 && renderPhoneStep()}
          {currentStep === 2 && renderOTPStep()}
          {currentStep === 3 && renderPasswordStep()}

          {/* Footer */}
          {!passwordReset && (
            <div className="mt-8 text-center">
              <p className="text-sm text-base-content/70">
                Remember your password?{" "}
                <Link to="/login" className="link link-primary">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;