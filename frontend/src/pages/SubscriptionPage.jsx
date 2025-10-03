"use client";

import React, { useState, useEffect } from "react";
import { useActivateSubscription } from "../hooks/useSubscription";
import useAuthUser from "../hooks/useAuthUser";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCardIcon,
  CheckIcon,
  StarIcon,
  ShieldIcon,
  RocketIcon,
  LoaderIcon,
  AlertCircleIcon,
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  CodeIcon,
  MapIcon,
  MicIcon,
  CheckCircleIcon,
  LightbulbIcon,
  ZapIcon,
  LockIcon,
  CrownIcon,
  SparklesIcon,
  MessageCircleIcon,
  BotIcon,
  XIcon,
  PlayIcon,
  PauseIcon,
} from "lucide-react";

export default function SubscriptionComponent() {
  const [plan, setPlan] = useState("monthly");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [processingStep, setProcessingStep] = useState(null);
  const { activate, isPending, error } = useActivateSubscription();
  const [message, setMessage] = useState(null);
  const { authUser, isLoading: authLoading, isAuthenticated } = useAuthUser();
  
  // AI Assistant State
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isAITyping, setIsAITyping] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  // AI Assistant Responses
  const aiResponses = {
    greeting: "Hello! I'm your subscription assistant. I can help you choose the right plan, explain features, or answer any questions about our premium offerings!",
    features: "Our premium plans include: AI Code Generation, Learning Roadmaps, Mock Interviews, Advanced Security, and much more. Which feature are you most interested in?",
    pricing: "We offer monthly ($100) and yearly ($900) plans. The yearly plan saves you $300 annually and includes all the same great features!",
    payment: "We accept all major credit cards. Payments are processed securely with SSL encryption and 3D secure authentication.",
    trial: "All plans include a 14-day free trial. You can cancel anytime during the trial period without any charges.",
    support: "Premium subscribers get priority 24/7 support with average response time under 2 hours.",
  };

  const features = [
    {
      icon: FileTextIcon,
      title: "Post Creation",
      description: "Create engaging posts with advanced formatting and AI assistance.",
      features: [
        "Rich text editor with markdown support",
        "AI-powered content suggestions",
        "Multi-format media embedding",
        "Real-time collaboration",
      ],
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      icon: CodeIcon,
      title: "AI Code Generation",
      description: "Generate and debug code with AI assistance across multiple languages.",
      features: [
        "20+ programming languages",
        "Code review and optimization",
        "Error detection and fixes",
        "Integration with popular IDEs",
      ],
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
    },
    {
      icon: MapIcon,
      title: "Learning Roadmaps",
      description: "Structured learning paths with progress tracking.",
      features: [
        "100+ technology roadmaps",
        "Interactive progress tracking",
        "Skill assessment tests",
        "Personalized recommendations",
      ],
      gradient: "from-orange-500/20 to-red-500/20",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
    },
    {
      icon: MicIcon,
      title: "Mock Interviews",
      description: "Practice interviews with real-time feedback and analytics.",
      features: [
        "50+ interview categories",
        "Real-time voice analysis",
        "Performance scorecards",
        "Video recording and playback",
      ],
      gradient: "from-red-500/20 to-pink-500/20",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600",
    },
    {
      icon: ShieldIcon,
      title: "Advanced Security",
      description: "Enterprise-grade security for your data.",
      features: [
        "End-to-end encryption",
        "Two-factor authentication",
        "Privacy controls",
        "Secure data storage",
      ],
      gradient: "from-green-500/20 to-teal-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
    },
    {
      icon: BotIcon,
      title: "AI Assistant",
      description: "24/7 intelligent assistance for all your needs.",
      features: [
        "Instant answers to questions",
        "Personalized recommendations",
        "Learning guidance",
        "Technical support",
      ],
      gradient: "from-indigo-500/20 to-purple-500/20",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
    },
  ];

  const plans = {
    monthly: {
      price: 100,
      originalPrice: 120,
      name: "Monthly Pro",
      description: "Flexible billing for short-term needs",
      billing: "per month",
      features: features,
      popular: false,
    },
    yearly: {
      price: 900,
      originalPrice: 1200,
      name: "Yearly Pro",
      description: "Best value with annual savings",
      billing: "per year",
      features: features,
      popular: true,
    },
  };

  // Initialize AI Assistant
  useEffect(() => {
    if (showAIAssistant && aiMessages.length === 0) {
      addAIMessage(aiResponses.greeting, "ai");
    }
  }, [showAIAssistant]);

  const addAIMessage = (text, sender) => {
    setAiMessages(prev => [...prev, { text, sender, id: Date.now() }]);
  };

  const handleAISubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    addAIMessage(userInput, "user");
    const userMessage = userInput.toLowerCase();
    setUserInput("");
    setIsAITyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));

    let response = aiResponses.greeting;
    if (userMessage.includes("feature") || userMessage.includes("what include")) {
      response = aiResponses.features;
    } else if (userMessage.includes("price") || userMessage.includes("cost")) {
      response = aiResponses.pricing;
    } else if (userMessage.includes("payment") || userMessage.includes("card")) {
      response = aiResponses.payment;
    } else if (userMessage.includes("trial") || userMessage.includes("free")) {
      response = aiResponses.trial;
    } else if (userMessage.includes("support") || userMessage.includes("help")) {
      response = aiResponses.support;
    }

    addAIMessage(response, "ai");
    setIsAITyping(false);
  };

  const isSubscribed = authUser?.subscription && authUser.subscription !== "free";
  const currentSubscription = authUser?.subscription;
  const subscriptionExpiresAt = authUser?.subscriptionExpiresAt;

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?(\d{1,3})?/);
    if (match) {
      const parts = [match[1], match[2], match[3], match[4], match[5]].filter(Boolean);
      return parts.join(" ");
    }
    return value;
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardInput = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      const formatted = formatCardNumber(value);
      setCardDetails((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === "expiry") {
      const formatted = formatExpiry(value);
      setCardDetails((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setCardDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isValidCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, "");
    return /^\d{16}$|^\d{19}$/.test(cleaned);
  };

  const isValidExpiry = (expiry) => {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10);
    const currentYear = new Date().getFullYear() % 100;
    return month >= 1 && month <= 12 && year >= currentYear;
  };

  const isValidCVC = (cvc) => {
    return /^\d{3,4}$/.test(cvc);
  };

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      setMessage("Please login to subscribe");
      return;
    }
    
    if (isSubscribed) {
      setMessage("You already have an active subscription!");
      return;
    }
    
    setShowPaymentModal(true);
  };

  const processPaymentSteps = async () => {
    const steps = [
      { name: "initial", message: "Initializing payment...", duration: 800 },
      { name: "validation", message: "Validating card details...", duration: 1200 },
      { name: "bank", message: "Contacting bank...", duration: 1500 },
      { name: "authentication", message: "3D Secure authentication...", duration: 2000 },
      { name: "verify", message: "Finalizing transaction...", duration: 1000 },
    ];

    for (const step of steps) {
      setProcessingStep(step.name);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    setProcessingStep(null);
    setShowSuccessAnimation(true);
    
    setTimeout(() => {
      setShowSuccessAnimation(false);
      setShowVerificationModal(true);
    }, 3000);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!isAuthenticated) {
      setMessage("Please login to complete payment");
      return;
    }

    const { cardNumber, expiry, cvc, name } = cardDetails;

    if (!name.trim()) {
      setMessage("Please enter cardholder name");
      return;
    }

    if (!isValidCardNumber(cardNumber)) {
      setMessage("Card number must be 16 or 19 digits");
      return;
    }

    if (!isValidExpiry(expiry)) {
      setMessage("Invalid expiry date (MM/YY)");
      return;
    }

    if (!isValidCVC(cvc)) {
      setMessage("CVC must be 3 or 4 digits");
      return;
    }

    setShowPaymentModal(false);
    await processPaymentSteps();
  };

  const handleVerifyAndActivate = async () => {
    try {
      await activate(plan, {
        onSuccess: (data) => {
          setMessage(data?.message || "Subscription activated successfully!");
          setShowVerificationModal(false);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        onError: (err) => {
          setMessage(err?.message || "Activation failed. Please try again.");
          setShowVerificationModal(false);
        },
      });
    } catch (err) {
      setMessage("Activation failed. Please try again.");
    }
  };

  const currentPlan = plans[plan];
  const savings = currentPlan.originalPrice - currentPlan.price;

  // Floating AI Assistant Button


  // AI Assistant Modal
  const AIAssistantModal = () => (
    <AnimatePresence>
      {showAIAssistant && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="bg-base-100 rounded-2xl w-full max-w-md h-[600px] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <BotIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Subscription Assistant</h3>
                    <p className="text-white/80 text-sm">Ask me about plans & features</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIAssistant(false)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <XIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {aiMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.sender === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-base-300 text-base-content rounded-bl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              {isAITyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-base-300 text-base-content rounded-2xl rounded-bl-none p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-base-content/50 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-base-content/50 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-base-content/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleAISubmit} className="p-4 border-t border-base-300">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask about plans, features, or pricing..."
                  className="input input-bordered flex-1"
                  disabled={isAITyping}
                />
                <button
                  type="submit"
                  disabled={isAITyping || !userInput.trim()}
                  className="btn btn-primary"
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 py-12 px-4 sm:px-6 lg:px-8">
      
        <AIAssistantModal />
        
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg"
            >
              <CrownIcon className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Premium Member
            </h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto mb-6">
              You're already enjoying our premium features! Thank you for your subscription.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-base-100 shadow-xl border border-green-200 max-w-md mx-auto"
            >
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-700 capitalize">
                  {currentSubscription} Plan
                </h3>
                <p className="text-base-content/60 mb-4">
                  Active Subscription
                </p>
                
                {subscriptionExpiresAt && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <CalendarIcon className="w-5 h-5" />
                      <span className="font-semibold">
                        Expires: {new Date(subscriptionExpiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-2 text-sm text-base-content/60">
                  <SparklesIcon className="w-4 h-4 text-yellow-500" />
                  <span>All premium features unlocked</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                }}
                className="group relative bg-base-100 rounded-2xl p-6 shadow-lg border border-green-200/50 hover:border-green-300 transition-all duration-300"
              >
                <div className="absolute -top-2 -right-2">
                  <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    UNLOCKED
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center`}>
                    <feature.icon className={`w-6 h-6 text-green-600`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-base-content">{feature.title}</h4>
                    <p className="text-sm text-base-content/70 mb-3">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.features.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center text-sm text-base-content/80">
                          <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 flex items-center justify-center">
        <div className="text-center">
          <LoaderIcon className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-base-content/70">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <LockIcon className="w-10 h-10 text-warning" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-base-content/70 mb-6">
            Please log in to view and purchase subscription plans.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 py-12 px-4 sm:px-6 lg:px-8">
      
      <AIAssistantModal />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity },
            }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-6 shadow-lg"
          >
            <ZapIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
            Unlock Premium Features
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Access powerful tools for content creation, learning, and career growth. All plans include a 14-day free trial.
          </p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {Object.entries(plans).map(([key, planData], index) => (
              <motion.div
                key={key}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
                }}
                className={`group relative bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-base-300/50 hover:border-primary/30 transition-all duration-500 overflow-hidden ${
                  plan === key ? "border-primary shadow-xl" : ""
                } ${planData.popular ? "ring-2 ring-primary/20" : ""}`}
              >
                {planData.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-4 py-1 rounded-full flex items-center gap-2">
                      <StarIcon className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-base-content group-hover:text-primary">{planData.name}</h3>
                    <p className="text-base-content/60 text-sm">{planData.description}</p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-base-content">${planData.price}</span>
                      <span className="text-base-content/60">{planData.billing}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="text-base-content/60 line-through">${planData.originalPrice}</span>
                        <span className="text-success font-semibold">Save ${savings}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    {planData.features.slice(0, 4).map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + idx * 0.05 }}
                        className="flex items-center text-sm text-base-content/60 group-hover:text-base-content/80"
                      >
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature.title}</span>
                      </motion.div>
                    ))}
                    {planData.features.length > 4 && (
                      <div className="text-sm text-primary font-medium flex items-center gap-2">
                        <LightbulbIcon className="w-4 h-4" />
                        +{planData.features.length - 4} more features
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setPlan(key);
                      handleSubscribe();
                    }}
                    className={`btn w-full gap-2 ${plan === key ? "btn-primary" : "btn-outline"}`}
                  >
                    {plan === key && <CheckIcon className="w-4 h-4" />}
                    Select Plan
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={cardVariants}
            className="card bg-base-100 shadow-xl border border-base-300/30 sticky top-6"
          >
            <div className="card-body">
              <h3 className="card-title flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5" />
                Order Summary
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-base-200/50 rounded-lg">
                  <div>
                    <div className="font-semibold">{currentPlan.name}</div>
                    <div className="text-sm text-base-content/60">{currentPlan.billing}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${currentPlan.price}</div>
                    <div className="text-sm text-base-content/60">{currentPlan.billing}</div>
                  </div>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span className="font-semibold">You Save</span>
                    </div>
                    <div className="font-bold text-success">${savings}</div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 mb-6 text-base-content/60">
                <div className="flex items-center gap-1">
                  <ShieldIcon className="w-4 h-4" />
                  <span className="text-xs">Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <LockIcon className="w-4 h-4" />
                  <span className="text-xs">SSL Encrypted</span>
                </div>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={isPending}
                className="btn btn-primary btn-lg w-full gap-3 shadow-lg hover:shadow-xl"
              >
                {isPending ? (
                  <>
                    <LoaderIcon className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RocketIcon className="w-5 h-5" />
                    Subscribe Now - ${currentPlan.price}
                  </>
                )}
              </button>

              <div className="text-center mt-6 space-y-3">
                <div className="flex items-center justify-center gap-4 text-sm text-base-content/60">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UsersIcon className="w-4 h-4" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
                <div className="text-xs text-base-content/50">
                  🔒 This is a simulated payment. No real charges will be made.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-base-100 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Enter Card Details</h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="btn btn-ghost btn-sm btn-circle"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Cardholder Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={cardDetails.name}
                      onChange={handleCardInput}
                      placeholder="John Doe"
                      className="input input-bordered"
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Card Number</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardInput}
                        placeholder="1234 5678 9012 3456"
                        className="input input-bordered w-full pl-12"
                        maxLength={24}
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <CreditCardIcon className="w-5 h-5 text-base-content/40" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Expiry Date</span>
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleCardInput}
                        placeholder="MM/YY"
                        className="input input-bordered"
                        maxLength={5}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">CVC</span>
                      </label>
                      <input
                        type="text"
                        name="cvc"
                        value={cardDetails.cvc}
                        onChange={handleCardInput}
                        placeholder="123"
                        className="input input-bordered"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="btn btn-outline flex-1"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      className="btn btn-primary flex-1"
                      disabled={isPending}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isPending ? <LoaderIcon className="w-5 h-5 animate-spin" /> : "Pay Now"}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Processing Animation */}
        <AnimatePresence>
          {processingStep && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-base-100 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <ShieldIcon className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-4">
                  {processingStep === "initial" && "Processing Payment..."}
                  {processingStep === "validation" && "Validating Card..."}
                  {processingStep === "bank" && "Contacting Bank..."}
                  {processingStep === "authentication" && "3D Secure..."}
                  {processingStep === "verify" && "Finalizing..."}
                </h3>
                
                <p className="text-base-content/70 mb-6">
                  {processingStep === "initial" && "Initializing secure payment processing"}
                  {processingStep === "validation" && "Validating your card details"}
                  {processingStep === "bank" && "Connecting to your bank for authorization"}
                  {processingStep === "authentication" && "Completing 3D Secure verification"}
                  {processingStep === "verify" && "Finalizing transaction details"}
                </p>

                <div className="w-full bg-base-300 rounded-full h-2 mb-4">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: 
                      processingStep === "initial" ? "20%" :
                      processingStep === "validation" ? "40%" :
                      processingStep === "bank" ? "60%" :
                      processingStep === "authentication" ? "80%" :
                      "100%"
                    }}
                    transition={{ duration: 0.5 }}
                    className="bg-primary h-2 rounded-full"
                  />
                </div>

                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Success Animation */}
        <AnimatePresence>
          {showSuccessAnimation && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="bg-success rounded-full p-8 relative mb-6"
                >
                  <CheckIcon className="w-16 h-16 text-white" />
                  <motion.div
                    className="absolute inset-0 bg-success/50 rounded-full"
                    animate={{ scale: [1, 1.5, 0], opacity: [0.5, 0.3, 0] }}
                    transition={{ duration: 1.5, repeat: 1 }}
                  />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  Payment Successful!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-white/80"
                >
                  Your subscription has been processed successfully
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rest of the component remains the same */}
        <AnimatePresence>
          {showVerificationModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-base-100 rounded-lg p-6 max-w-md w-full"
              >
                <h3 className="text-xl font-bold mb-4">Verify Subscription</h3>
                <p className="mb-4">Payment verification failed. Would you like to activate the subscription without payment for testing?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowVerificationModal(false)}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleVerifyAndActivate}
                    className="btn btn-primary flex-1"
                    disabled={isPending}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPending ? <LoaderIcon className="w-5 h-5 animate-spin" /> : "Activate Now"}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`alert fixed bottom-4 right-4 max-w-md ${
                message.includes("failed") || message.includes("Invalid") ? "alert-error" : "alert-success"
              }`}
            >
              {message.includes("failed") || message.includes("Invalid") ? (
                <AlertCircleIcon className="w-5 h-5" />
              ) : (
                <CheckIcon className="w-5 h-5" />
              )}
              <span>{message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 card bg-base-100 shadow-xl border border-base-300/30"
        >
          <div className="card-body">
            <h3 className="card-title justify-center text-2xl mb-8">All Plan Features</h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid lg:grid-cols-2 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
                  }}
                  className="group relative bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-base-300/50 hover:border-primary/30 transition-all duration-500 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}
                      >
                        <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                      </motion.div>
                      <div>
                        <h4 className="text-lg font-bold text-base-content group-hover:text-primary">{feature.title}</h4>
                        <p className="text-sm text-base-content/70">{feature.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + idx * 0.05 }}
                          className="flex items-center text-sm text-base-content/60 group-hover:text-base-content/80"
                        >
                          <CheckCircleIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}