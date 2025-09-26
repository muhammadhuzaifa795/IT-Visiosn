"use client"

import { useState, useEffect } from "react";
import { ShipWheelIcon, ArrowLeft, CheckCircle, Mail, Shield } from "lucide-react";
import { Link } from "react-router";
import { useSendOTP, useResendOTP, useVerifyOTP, useResetPassword } from "../hooks/usePasswordReset";

const PasswordResetPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contactData, setContactData] = useState({ email: "" });
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [countdown, setCountdown] = useState(0);

  const { sendOTPMutation, isSendingOTP, sendOTPError, otpSent } = useSendOTP();
  const { resendOTPMutation, isResendingOTP, resendOTPError } = useResendOTP();
  const { verifyOTPMutation, isVerifyingOTP, verifyOTPError, otpVerified, resetVerifyOTP } = useVerifyOTP();
  const { resetPasswordMutation, isResettingPassword, resetPasswordError, passwordReset, resetPasswordReset } = useResetPassword();

  const handleBackToEmail = () => {
    setCurrentStep(1);
    setOtp("");
    resetVerifyOTP();
  };

  const handleBackToOTP = () => {
    setCurrentStep(2);
    setPasswords({ newPassword: "", confirmPassword: "" });
    resetPasswordReset();
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (otpSent) {
      setCurrentStep(2);
      setCountdown(30);
    }
  }, [otpSent]);

  useEffect(() => {
    if (otpVerified) {
      setCurrentStep(3);
    }
  }, [otpVerified]);

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!contactData.email.trim()) return;
    sendOTPMutation({ email: contactData.email });
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    verifyOTPMutation({ data: { email: contactData.email }, otp });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword || !passwords.newPassword.trim()) return;
    resetPasswordMutation({ data: { email: contactData.email }, newPassword: passwords.newPassword });
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      setOtp("");
      resendOTPMutation(contactData.email);
      setCountdown(30);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= step ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/50'}`}>
              {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 3 && <div className={`w-12 h-1 mx-2 ${currentStep > step ? 'bg-primary' : 'bg-base-200'}`} />}
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-base-content">Forgot Password?</h2>
        <p className="text-base-content/70 text-lg">Enter your email to receive a verification code.</p>
      </div>
      {sendOTPError && (
        <div className="alert alert-error mb-6 animate-pulse">
          <div className="flex items-center gap-2">
            <Shield className="size-5" />
            <span>{sendOTPError.response?.data?.message || 'Failed to send OTP'}</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSendOTP} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-base-content/80">Email Address</label>
          <div className="relative">
            <input
              type="email"
              placeholder="you@codezynx.dev"
              className="input input-bordered w-full pl-4 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={contactData.email}
              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              disabled={isSendingOTP}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full py-3 text-base font-semibold hover:scale-[1.02] transition-all duration-200 shadow-lg"
          disabled={isSendingOTP || !contactData.email.trim()}
        >
          {isSendingOTP ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Sending...
            </>
          ) : (
            <>
              <Mail className="size-5" />
              Send Verification Code
            </>
          )}
        </button>
      </form>
    </div>
  );

  const renderOTPStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-base-content">Enter Verification Code</h2>
        <p className="text-base-content/70 text-lg">We've sent a 6-digit code to {contactData.email}.</p>
      </div>
      {verifyOTPError && (
        <div className="alert alert-error mb-6 animate-pulse">
          <div className="flex items-center gap-2">
            <Shield className="size-5" />
            <span>{verifyOTPError.response?.data?.message || 'Invalid or expired OTP'}</span>
          </div>
        </div>
      )}
      <form onSubmit={handleVerifyOTP} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-base-content/80">Verification Code</label>
          <input
            type="text"
            placeholder="123456"
            className="input input-bordered w-full text-center text-2xl tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
          className="btn btn-primary w-full py-3 text-base font-semibold hover:scale-[1.02] transition-all duration-200 shadow-lg"
          disabled={isVerifyingOTP || otp.length !== 6}
        >
          {isVerifyingOTP ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Verifying...
            </>
          ) : (
            <>
              <Mail className="size-5" />
              Verify Code
            </>
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
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-base-content">Create New Password</h2>
        <p className="text-base-content/70 text-lg">Choose a strong password to secure your account.</p>
      </div>
      {resetPasswordError && (
        <div className="alert alert-error mb-6 animate-pulse">
          <div className="flex items-center gap-2">
            <Shield className="size-5" />
            <span>{resetPasswordError.response?.data?.message || 'Failed to reset password'}</span>
          </div>
        </div>
      )}
      {passwordReset ? (
        <div className="space-y-6">
          <div className="alert alert-success">
            <CheckCircle className="w-6 h-6" />
            <span>Password reset successfully! You can now sign in with your new password.</span>
          </div>
          <Link to="/login" className="btn btn-primary w-full py-3 text-base font-semibold hover:scale-[1.02] transition-all duration-200 shadow-lg">
            Continue to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-base-content/80">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="input input-bordered w-full pl-4 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              required
              minLength="6"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-base-content/80">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="input input-bordered w-full pl-4 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
            className="btn btn-primary w-full py-3 text-base font-semibold hover:scale-[1.02] transition-all duration-200 shadow-lg"
            disabled={isResettingPassword || passwords.newPassword !== passwords.confirmPassword || !passwords.newPassword}
          >
            {isResettingPassword ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Resetting...
              </>
            ) : (
              <>
                <Mail className="size-5" />
                Reset Password
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-base-200 via-base-100 to-base-200" data-theme="forest">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-0 bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-primary/10">
          <div className="p-8 lg:p-12 flex flex-col justify-center min-h-[600px] relative">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
                  <ShipWheelIcon className="size-8 text-base-100" />
                </div>
                <span className="text-4xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  CodeZynx
                </span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-base-content">Reset Your Password</h1>
                <p className="text-base-content/70 text-lg">Follow the steps to securely reset your password</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              {currentStep === 1 ? (
                <Link to="/login" className="btn btn-ghost btn-sm">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
              ) : currentStep === 2 ? (
                <button onClick={handleBackToEmail} className="btn btn-ghost btn-sm">
                  <ArrowLeft className="w-4 h-4" />
                  Change Email
                </button>
              ) : (
                <button onClick={handleBackToOTP} className="btn btn-ghost btn-sm">
                  <ArrowLeft className="w-4 h-4" />
                  Back to OTP
                </button>
              )}
            </div>
            {renderStepIndicator()}
            {currentStep === 1 && renderEmailStep()}
            {currentStep === 2 && renderOTPStep()}
            {currentStep === 3 && renderPasswordStep()}
            {!passwordReset && (
              <div className="mt-8 pt-6 border-t border-base-300 text-center">
                <p className="text-base-content/70">
                  Remember your password?{" "}
                  <Link to="/login" className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </div>
          <div className="hidden lg:flex bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 items-center justify-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%227%22 cy=%227%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
            </div>
            <div className="relative z-10 max-w-md text-center space-y-8">
              <div className="relative">
                <div className="w-80 h-80 mx-auto rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img src="/i.png" alt="Developer collaboration illustration" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary rounded-full animate-bounce delay-300"></div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-base-content">Connect. Code. <span className="text-primary">Collaborate.</span></h2>
                <p className="text-lg text-base-content/70 leading-relaxed">
                  Join a thriving community of developers. Share innovative ideas, build revolutionary applications, and accelerate your professional growth.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                  <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">Real-time Collaboration</div>
                  <div className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">Secure Authentication</div>
                  <div className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">Advanced Tools</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;