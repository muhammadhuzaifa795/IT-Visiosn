// import { useState } from "react";
// import { ShipWheelIcon, Mail, Scan, ArrowRight, Eye, EyeOff, Shield, Zap } from "lucide-react";
// import { Link } from "react-router";
// import useLogin from "../hooks/useLogin";
// import { useLoginWithFace } from "../hooks/useFaceAuth";
// import FaceCapture from "../components/FaceCapture";

// const LoginPage = () => {
//   const [loginData, setLoginData] = useState({ email: "", password: "" });
//   const [selectedMethod, setSelectedMethod] = useState(null); // 'email' or 'face'
//   const [showPassword, setShowPassword] = useState(false);

//   // classic email+password
//   const { isPending, error, loginMutation } = useLogin();

//   // face-login
//   const {
//     mutate: loginWithFace,
//     isPending: facePending,
//     error: faceError,
//   } = useLoginWithFace();

//   const handleEmailLogin = (e) => {
//     e.preventDefault();
//     loginMutation(loginData);
//   };

//   const handleFaceCapture = (blob) => {
//     const form = new FormData();
//     form.append("face", blob, "face.jpg");
//     loginWithFace(form);
//   };

//   const resetSelection = () => {
//     setSelectedMethod(null);
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-base-200 via-base-100 to-base-200"
//       data-theme="forest"
//     >
//       <div className="w-full max-w-7xl mx-auto">
//         <div className="grid lg:grid-cols-2 gap-0 bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-primary/10">
          
//           {/* LEFT PANEL - Login Form */}
//           <div className="p-8 lg:p-12 flex flex-col justify-center min-h-[600px] relative">
            
//             {/* Header */}
//             <div className="mb-8">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
//                   <ShipWheelIcon className="size-8 text-base-100" />
//                 </div>
//                 <span className="text-4xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
//                   CodeZynx
//                 </span>
//               </div>
              
//               <div className="space-y-2">
//                 <h1 className="text-3xl font-bold text-base-content">Welcome Back</h1>
//                 <p className="text-base-content/70 text-lg">
//                   Choose your preferred way to access your workspace
//                 </p>
//               </div>
//             </div>

//             {/* Error Messages */}
//             {(error || faceError) && (
//               <div className="alert alert-error mb-6 animate-pulse">
//                 <div className="flex items-center gap-2">
//                   <Shield className="size-5" />
//                   <span>
//                     {(error || faceError)?.response?.data?.message || "Authentication failed"}
//                   </span>
//                 </div>
//               </div>
//             )}

//             {/* Method Selection */}
//             {!selectedMethod && (
//               <div className="space-y-6 animate-fade-in">
//                 <div className="grid gap-4">
                  
//                   {/* Email Login Method */}
//                   <div 
//                     className="group relative p-6 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-primary/5 to-secondary/5"
//                     onClick={() => setSelectedMethod('email')}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-4">
//                         <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
//                           <Mail className="size-6 text-primary" />
//                         </div>
//                         <div>
//                           <h3 className="text-xl font-semibold text-base-content">Email & Password</h3>
//                           <p className="text-base-content/70">Traditional secure login</p>
//                         </div>
//                       </div>
//                       <ArrowRight className="size-5 text-primary group-hover:translate-x-1 transition-transform" />
//                     </div>
//                     <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   </div>

//                   {/* Face Login Method */}
//                   <div 
//                     className="group relative p-6 rounded-xl border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-secondary/5 to-accent/5"
//                     onClick={() => setSelectedMethod('face')}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-4">
//                         <div className="p-3 rounded-lg bg-secondary/20 group-hover:bg-secondary/30 transition-colors">
//                           <Scan className="size-6 text-secondary" />
//                         </div>
//                         <div>
//                           <h3 className="text-xl font-semibold text-base-content">Face Recognition</h3>
//                           <p className="text-base-content/70">Quick & secure biometric login</p>
//                           <div className="flex items-center gap-1 mt-1">
//                             <Zap className="size-3 text-accent" />
//                             <span className="text-xs text-accent font-medium">INSTANT ACCESS</span>
//                           </div>
//                         </div>
//                       </div>
//                       <ArrowRight className="size-5 text-secondary group-hover:translate-x-1 transition-transform" />
//                     </div>
//                     <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary/0 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   </div>

//                 </div>
//               </div>
//             )}

//             {/* Email Login Form */}
//             {selectedMethod === 'email' && (
//               <div className="space-y-6 animate-fade-in">
//                 <div className="flex items-center gap-2 mb-4">
//                   <button 
//                     onClick={resetSelection}
//                     className="btn btn-ghost btn-sm"
//                   >
//                     ← Back
//                   </button>
//                   <div className="flex items-center gap-2">
//                     <Mail className="size-5 text-primary" />
//                     <span className="font-semibold">Email Login</span>
//                   </div>
//                 </div>

//                 <form onSubmit={handleEmailLogin} className="space-y-5">
                  
//                   {/* Email Input */}
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-base-content/80">Email Address</label>
//                     <div className="relative">
//                       <input
//                         type="email"
//                         placeholder="you@codezynx.dev"
//                         className="input input-bordered w-full pl-4 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
//                         value={loginData.email}
//                         onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Password Input */}
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-base-content/80">Password</label>
//                     <div className="relative">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter your password"
//                         className="input input-bordered w-full pl-4 pr-12 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
//                         value={loginData.password}
//                         onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
//                         required
//                       />
//                       <button
//                         type="button"
//                         className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-base-content/50 hover:text-base-content transition-colors"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     className="btn btn-primary w-full py-3 text-base font-semibold hover:scale-[1.02] transition-all duration-200 shadow-lg"
//                     disabled={isPending}
//                   >
//                     {isPending && (
//                       <span className="loading loading-spinner loading-sm"></span>
//                     )}
//                     <Mail className="size-5" />
//                     {isPending ? "Signing in..." : "Sign In with Email"}
//                   </button>

//                 </form>
//               </div>
//             )}

//             {/* Face Login Section */}
//             {selectedMethod === 'face' && (
//               <div className="space-y-6 animate-fade-in">
//                 <div className="flex items-center gap-2 mb-4">
//                   <button 
//                     onClick={resetSelection}
//                     className="btn btn-ghost btn-sm"
//                   >
//                     ← Back
//                   </button>
//                   <div className="flex items-center gap-2">
//                     <Scan className="size-5 text-secondary" />
//                     <span className="font-semibold">Face Recognition</span>
//                   </div>
//                 </div>

//                 <div className="text-center space-y-4">
//                   <div className="mx-auto w-fit p-4 rounded-xl bg-secondary/10">
//                     <FaceCapture onCapture={handleFaceCapture} />
//                   </div>
                  
//                   {facePending && (
//                     <div className="flex items-center justify-center gap-2 text-secondary">
//                       <span className="loading loading-spinner loading-md"></span>
//                       <span className="font-medium">Verifying your identity...</span>
//                     </div>
//                   )}
                  
//                   <p className="text-sm text-base-content/60">
//                     Position your face in the camera frame and capture when ready
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Footer Links */}
//             <div className="mt-8 pt-6 border-t border-base-300 space-y-3 text-center">
//               <p className="text-base-content/70">
//                 New to CodeZynx?{" "}
//                 <Link to="/signup" className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors">
//                   Create your account
//                 </Link>
//               </p>
//               <p className="text-base-content/70">
//                 Forgot your password?{" "}
//                 <Link to="/password-reset" className="text-secondary hover:text-secondary/80 font-medium hover:underline transition-colors">
//                   Reset it here
//                 </Link>
//               </p>
//             </div>
//           </div>

//           {/* RIGHT PANEL - Hero Section */}
//           <div className="hidden lg:flex bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 items-center justify-center p-12 relative overflow-hidden">
            
//             {/* Background Pattern */}
//             <div className="absolute inset-0 opacity-5">
//                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%227%22 cy=%227%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
//             </div>

//             <div className="relative z-10 max-w-md text-center space-y-8">
              
//               {/* Hero Image */}
//               <div className="relative">
//                 <div className="w-80 h-80 mx-auto rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
//                   <img
//                     src="/i.png"
//                     alt="Developer collaboration illustration"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
                
//                 {/* Floating Elements */}
//                 <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-bounce"></div>
//                 <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary rounded-full animate-bounce delay-300"></div>
//               </div>

//               {/* Hero Content */}
//               <div className="space-y-4">
//                 <h2 className="text-3xl font-bold text-base-content">
//                   Connect. Code. 
//                   <span className="text-primary"> Collaborate.</span>
//                 </h2>
//                 <p className="text-lg text-base-content/70 leading-relaxed">
//                   Join a thriving community of developers. Share innovative ideas, build revolutionary applications, and accelerate your professional growth.
//                 </p>
                
//                 {/* Feature Pills */}
//                 <div className="flex flex-wrap justify-center gap-2 pt-4">
//                   <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
//                     Real-time Collaboration
//                   </div>
//                   <div className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
//                     Secure Authentication
//                   </div>
//                   <div className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
//                     Advanced Tools
//                   </div>
//                 </div>
//               </div>

//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;






// admin 


import { useState } from "react";
import {
  ShipWheelIcon,
  Mail,
  Scan,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  Zap,
} from "lucide-react";
import { Link } from "react-router"; // 🔁 ✅ FIXED
import useLogin from "../hooks/useLogin";
import { useLoginWithFace } from "../hooks/useFaceAuth";
import FaceCapture from "../components/FaceCapture";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, loginMutation } = useLogin();

  const {
    mutate: loginWithFace,
    isPending: facePending,
    error: faceError,
  } = useLoginWithFace();

  const handleEmailLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  const handleFaceCapture = (blob) => {
    const form = new FormData();
    form.append("face", blob, "face.jpg");
    loginWithFace(form);
  };

  const resetSelection = () => {
    setSelectedMethod(null);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-base-200 via-base-100 to-base-200"
      data-theme="forest"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-0 bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-primary/10">
          {/* LEFT PANEL */}
          <div className="p-8 lg:p-12 flex flex-col justify-center min-h-[600px] relative">
            {/* Header */}
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
                <h1 className="text-3xl font-bold text-base-content">
                  Welcome Back
                </h1>
                <p className="text-base-content/70 text-lg">
                  Choose your preferred way to access your workspace
                </p>
              </div>
            </div>

            {/* Error Alert */}
            {(error || faceError) && (
              <div className="alert alert-error mb-6 animate-pulse">
                <div className="flex items-center gap-2">
                  <Shield className="size-5" />
                  <span>
                    {(error || faceError)?.response?.data?.message ||
                      "Authentication failed"}
                  </span>
                </div>
              </div>
            )}

            {/* Method Selection */}
            {!selectedMethod && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid gap-4">
                  {/* Email */}
                  <div
                    className="group relative p-6 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-primary/5 to-secondary/5"
                    onClick={() => setSelectedMethod("email")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                          <Mail className="size-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-base-content">
                            Email & Password
                          </h3>
                          <p className="text-base-content/70">
                            Traditional secure login
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="size-5 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Face Login */}
                  <div
                    className="group relative p-6 rounded-xl border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-secondary/5 to-accent/5"
                    onClick={() => setSelectedMethod("face")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-secondary/20 group-hover:bg-secondary/30 transition-colors">
                          <Scan className="size-6 text-secondary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-base-content">
                            Face Recognition
                          </h3>
                          <p className="text-base-content/70">
                            Quick & secure biometric login
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Zap className="size-3 text-accent" />
                            <span className="text-xs text-accent font-medium">
                              INSTANT ACCESS
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="size-5 text-secondary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Login Form */}
            {selectedMethod === "email" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={resetSelection} className="btn btn-ghost btn-sm">
                    ← Back
                  </button>
                  <div className="flex items-center gap-2">
                    <Mail className="size-5 text-primary" />
                    <span className="font-semibold">Email Login</span>
                  </div>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-base-content/80">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@codezynx.dev"
                      className="input input-bordered w-full py-3 text-base"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-base-content/80">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="input input-bordered w-full pr-12 py-3 text-base"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full py-3 text-base font-semibold shadow-md"
                    disabled={isPending}
                  >
                    {isPending && <span className="loading loading-spinner loading-sm"></span>}
                    Sign In with Email
                  </button>
                </form>
              </div>
            )}

            {/* Face Login */}
            {selectedMethod === "face" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={resetSelection} className="btn btn-ghost btn-sm">
                    ← Back
                  </button>
                  <div className="flex items-center gap-2">
                    <Scan className="size-5 text-secondary" />
                    <span className="font-semibold">Face Recognition</span>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <div className="mx-auto w-fit p-4 rounded-xl bg-secondary/10">
                    <FaceCapture onCapture={handleFaceCapture} />
                  </div>

                  {facePending && (
                    <div className="flex items-center justify-center gap-2 text-secondary">
                      <span className="loading loading-spinner loading-md"></span>
                      <span className="font-medium">Verifying your identity...</span>
                    </div>
                  )}

                  <p className="text-sm text-base-content/60">
                    Position your face in the camera frame and capture when ready
                  </p>
                </div>
              </div>
            )}

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-base-300 space-y-3 text-center">
              <p className="text-base-content/70">
                New to CodeZynx?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:underline font-medium"
                >
                  Create your account
                </Link>
              </p>
              <p className="text-base-content/70">
                Forgot your password?{" "}
                <Link
                  to="/password-reset"
                  className="text-secondary hover:underline font-medium"
                >
                  Reset it here
                </Link>
              </p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="hidden lg:flex bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 items-center justify-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23000 fill-opacity=0.1%3E%3Ccircle cx=7 cy=7 r=1/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>

            <div className="relative z-10 max-w-md text-center space-y-8">
              <div className="relative">
                <div className="w-80 h-80 mx-auto rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="/i.png"
                    alt="Developer collaboration illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-base-content">
                  Connect. Code.{" "}
                  <span className="text-primary">Collaborate.</span>
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

export default LoginPage;
