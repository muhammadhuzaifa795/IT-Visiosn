"use client"

import { useState } from "react";
import { ShipWheelIcon, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    const payload = {
      ...signupData,
      role: signupData.email.includes("admin") ? "admin" : "user",
    };
    signupMutation(payload);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-base-200 via-base-100 to-base-200"
      data-theme="forest"
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-0 bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-primary/10">
          {/* Left Panel - SignUp Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
                  <ShipWheelIcon className="size-8 text-base-100" />
                </div>
                <span className="text-4xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  CodeZynx
                </span>
              </div>
              <Link to="/login" className="btn btn-ghost btn-sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>

            <div className="space-y-6 max-w-md mx-auto w-full">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-base-content">Join CodeZynx</h1>
                <p className="text-base-content/70 text-lg">
                  Create your developer profile and start building with the community.
                </p>
              </div>

              {error && (
                <div className="alert alert-error animate-pulse">
                  <span>{error.response?.data?.message || "Signup failed. Please try again."}</span>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/80 font-medium">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ada Lovelace"
                      className="input input-bordered w-full pl-4 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/80 font-medium">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="coder@codezynx.dev"
                      className="input input-bordered w-full pl-4 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/80 font-medium">Phone</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+92 123 456 7890"
                      className="input input-bordered w-full pl-4 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/80 font-medium">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="input input-bordered w-full pl-4 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      minLength="6"
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/70">
                        Minimum 6 characters — make it secure like your code!
                      </span>
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm checkbox-primary"
                        required
                      />
                      <span className="text-sm text-base-content/80">
                        I accept the{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          terms of use
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          privacy policy
                        </Link>
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  className="btn btn-primary w-full py-3 text-base font-semibold hover:scale-[1.02] transition-all duration-200 shadow-lg"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating Account...
                    </>
                  ) : (
                    "Create Developer Account"
                  )}
                </button>
              </form>

              <div className="text-center mt-6">
                <p className="text-base-content/70 text-sm">
                  Already coding with us?{" "}
                  <Link to="/login" className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Hero Section */}
          <div className="hidden lg:flex bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 items-center justify-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%227%22 cy=%227%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
            </div>
            <div className="relative z-10 max-w-md text-center space-y-8">
              <div className="relative">
                <div className="w-80 h-80 mx-auto rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="/i.png"
                    alt="Developer collaboration illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary rounded-full animate-bounce delay-300"></div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-base-content">
                  Connect. Code. <span className="text-primary">Collaborate.</span>
                </h2>
                <p className="text-lg text-base-content/70 leading-relaxed">
                  Join a thriving community of developers. Share innovative ideas, build revolutionary applications, and accelerate your professional growth.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                  <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    Real-time Collaboration
                  </div>
                  <div className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
                    Secure Authentication
                  </div>
                  <div className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                    Advanced Tools
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;