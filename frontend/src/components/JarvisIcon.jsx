import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bot, Sparkles, Zap, MessageCircle, Brain, Crown, Lock } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";

const Jarvis = () => {
  const navigate = useNavigate();
  const { authUser, admin } = useAuthUser();
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  // Check if user has active subscription AND is not admin
  const isSubscribed = authUser?.subscription && authUser.subscription !== "free";
  const isRegularUser = !admin; // Only show to non-admin users

  // Auto-pulse effect only for subscribed regular users
  useEffect(() => {
    if (!isSubscribed || !isRegularUser) return;
    
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 2000);
    }, 5000);

    return () => clearInterval(interval);
  }, [isSubscribed, isRegularUser]);

  const handleClick = () => {
    if (!isSubscribed) {
      // Show message and redirect to subscription page for free users
      alert("🚀 Premium Feature!\n\nUpgrade to access Codezynx AI Assistant with advanced features.");
      navigate("/subscription");
      return;
    }
    navigate("/jarvis/chat");
  };

  // Don't show Jarvis button to admin users
  if (!isRegularUser) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="
        fixed bottom-8 right-8 z-50
        group cursor-pointer
        transition-all duration-500
        hover:scale-110 active:scale-95
      "
    >
      {/* Outer Glow Effect - Different colors based on subscription */}
      <div className={`
        absolute inset-0 rounded-full
        ${isSubscribed 
          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500' 
          : 'bg-gradient-to-r from-gray-500 via-gray-400 to-gray-300'
        }
        transition-all duration-1000
        ${isHovered ? 'animate-pulse scale-125 blur-md' : 'scale-100 blur-sm'}
        ${isPulsing && isSubscribed ? 'animate-ping' : ''}
      `} />

      {/* Main Button Container */}
      <div className={`
        relative rounded-full p-[2px]
        ${isSubscribed 
          ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600' 
          : 'bg-gradient-to-br from-gray-600 via-gray-500 to-gray-400'
        }
        shadow-2xl
        group-hover:shadow-3xl
        transition-all duration-500
      `}>
        {/* Inner Container */}
        <div className="
          relative bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-black
          rounded-full p-5
          flex items-center justify-center
          backdrop-blur-sm
          border border-white/10
          group-hover:border-white/20
          transition-all duration-500
        ">
          {/* Premium/Lock Badge */}
          <div className="absolute -top-1 -right-1 z-20">
            {isSubscribed ? (
              <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500 drop-shadow-lg" />
            ) : (
              <Lock className="w-3 h-3 text-gray-400 drop-shadow-lg" />
            )}
          </div>

          {/* Animated Brain/Bot Icon */}
          <div className="relative">
            {/* Main Icon */}
            <Brain className={`
              w-7 h-7
              ${isSubscribed 
                ? 'text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text' 
                : 'text-gray-400'
              }
              transition-all duration-500
              group-hover:scale-110
              ${isHovered ? 'rotate-12' : ''}
            `} />

            {/* Floating Particles - Only for subscribed users */}
            {isSubscribed && (
              <>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className={`
                    w-3 h-3 text-cyan-400
                    transition-all duration-500
                    ${isHovered ? 'scale-150 rotate-180' : 'scale-100'}
                    ${isPulsing ? 'animate-bounce' : ''}
                  `} />
                </div>

                <div className="absolute -bottom-1 -left-1">
                  <Zap className={`
                    w-3 h-3 text-pink-400
                    transition-all duration-500 delay-100
                    ${isHovered ? 'scale-150 -rotate-45' : 'scale-100'}
                    ${isPulsing ? 'animate-pulse' : ''}
                  `} />
                </div>
              </>
            )}
          </div>

          {/* Orbiting Dots - Only for subscribed users */}
          {isSubscribed && (
            <div className="absolute inset-0">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    absolute w-1 h-1 rounded-full
                    bg-gradient-to-r from-purple-400 to-cyan-400
                    transition-all duration-1000
                    ${isHovered ? 'opacity-100' : 'opacity-70'}
                    ${isHovered ? 'scale-150' : 'scale-100'}
                  `}
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `
                      translate(-50%, -50%)
                      rotate(${isHovered ? i * 120 + 180 : i * 120}deg)
                      translateX(${isHovered ? '28px' : '24px'})
                      rotate(${isHovered ? -i * 120 - 180 : -i * 120}deg)
                    `,
                    transition: `all 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Pulse Ring - Only for subscribed users */}
          {isSubscribed && (
            <div className={`
              absolute inset-0 rounded-full border-2
              border-transparent
              bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500
              bg-clip-border
              transition-all duration-1000
              ${isHovered ? 'scale-125 opacity-20' : 'scale-100 opacity-0'}
              ${isPulsing ? 'animate-ping' : ''}
            `} />
          )}
        </div>
      </div>

      {/* Tooltip */}
      <div className={`
        absolute right-full mr-4 top-1/2 transform -translate-y-1/2
        bg-black/90 backdrop-blur-md text-white text-sm
        px-3 py-2 rounded-lg whitespace-nowrap
        border border-white/10
        transition-all duration-300
        ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        group-hover:opacity-100
      `}>
        <div className="flex items-center gap-2">
          <MessageCircle className={`w-4 h-4 ${isSubscribed ? 'text-cyan-400' : 'text-gray-400'}`} />
          <span className="font-medium">Codezynx AI</span>
          <div className="flex items-center gap-1">
            <div className={`w-1 h-1 rounded-full ${isSubscribed ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className={`text-xs ${isSubscribed ? 'text-green-400' : 'text-gray-400'}`}>
              {isSubscribed ? 'Premium' : 'Locked'}
            </span>
          </div>
        </div>
        {!isSubscribed && (
          <div className="text-xs text-yellow-400 mt-1">Subscribe to unlock</div>
        )}
      </div>

      {/* Connection Lines Animation - Only for subscribed users */}
      {isSubscribed && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className={`
            absolute inset-0
            bg-gradient-to-r from-transparent via-white/5 to-transparent
            skew-x-12
            transition-all duration-2000
            ${isHovered ? 'translate-x-full' : '-translate-x-full'}
          `} />
        </div>
      )}

      {/* Hover Sparkle Effect - Only for subscribed users */}
      {isHovered && isSubscribed && (
        <div className="absolute inset-0 rounded-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${0.5 + Math.random() * 1}s`
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
};

export default Jarvis;