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
} from "lucide-react";

export default function SubscriptionComponent() {
  const [plan, setPlan] = useState("monthly");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [processingStep, setProcessingStep] = useState(null);
  const { activate, isPending, error } = useActivateSubscription();
  const [message, setMessage] = useState(null);
  const { authUser, isLoading: authLoading, isAuthenticated } = useAuthUser();

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

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!isAuthenticated) {
      setMessage("Please login to complete payment");
      return;
    }

    const { cardNumber, expiry, cvc } = cardDetails;

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
    setProcessingStep("initial");

    // Simulate payment processing
    setTimeout(() => setProcessingStep("bank"), 1000);
    setTimeout(() => setProcessingStep("verify"), 3000);
    setTimeout(() => {
      setProcessingStep(null);
      setShowSuccessAnimation(true);
    }, 5000);

    setTimeout(() => {
      setShowSuccessAnimation(false);
      setShowVerificationModal(true);
    }, 7000);
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

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 py-12 px-4 sm:px-6 lg:px-8">
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

        <AnimatePresence>
          {showPaymentModal && (
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
                <h3 className="text-xl font-bold mb-4">Enter Card Details</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Card Number</span>
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardInput}
                      placeholder="1234 5678 9012 3456"
                      className="input input-bordered"
                      maxLength={24}
                    />
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
                      onClick={handlePaymentSubmit}
                      className="btn btn-primary flex-1"
                      disabled={isPending}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isPending ? <LoaderIcon className="w-5 h-5 animate-spin" /> : "Pay Now"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                className="bg-base-100 rounded-lg p-6 max-w-md w-full text-center"
              >
                <LoaderIcon className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  {processingStep === "initial" && "Processing Payment..."}
                  {processingStep === "bank" && "Contacting Bank..."}
                  {processingStep === "verify" && "Verifying Transaction..."}
                </h3>
                <p className="text-base-content/70">
                  {processingStep === "initial" && "Initiating secure payment processing"}
                  {processingStep === "bank" && "Connecting to your bank for authorization"}
                  {processingStep === "verify" && "Finalizing transaction details"}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSuccessAnimation && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            >
              <div className="bg-success rounded-full p-8 relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <CheckIcon className="w-16 h-16 text-white" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-success/50 rounded-full"
                  animate={{ scale: [1, 1.5, 0], opacity: [0.5, 0.3, 0] }}
                  transition={{ duration: 1.5 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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