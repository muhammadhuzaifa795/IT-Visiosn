"use client"

import { motion } from "framer-motion"
import {
  FileTextIcon,
  CodeIcon,
  MapIcon,
  MicIcon,
  UsersIcon,
  MessageCircleIcon,
  BellIcon,
  ShieldIcon,
  KeyIcon,
  SettingsIcon,
  UserPlusIcon,
  HelpCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  SearchIcon,
  BookOpenIcon,
  VideoIcon,
  MailIcon,
  ZapIcon,
  GlobeIcon,
  LockIcon,
  SmartphoneIcon,
  BarChart3Icon,
  Users2Icon,
  PaletteIcon,
  DownloadIcon,
  ShareIcon,
  StarIcon,
  TrophyIcon,
  TargetIcon,
  ClockIcon,
  CheckCircleIcon,
  LightbulbIcon,
  HeartIcon,
  RocketIcon
} from "lucide-react"
import { Link } from "react-router"
import { useState } from "react"

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  }

  const categories = [
    { id: "all", label: "All Features", count: 11, icon: ZapIcon },
    { id: "content", label: "Content Creation", count: 3, icon: FileTextIcon },
    { id: "learning", label: "Learning Tools", count: 2, icon: BookOpenIcon },
    { id: "career", label: "Career Development", count: 2, icon: TargetIcon },
    { id: "social", label: "Social Features", count: 2, icon: Users2Icon },
    { id: "security", label: "Security", count: 2, icon: ShieldIcon },
  ]

  const features = [
    {
      icon: FileTextIcon,
      title: "Post Creation",
      description: "Create engaging posts with advanced formatting, code highlighting, and AI-powered assistance.",
      features: [
        "Rich text editor with markdown support",
        "Automatic code error detection",
        "AI-powered content suggestions",
        "Multi-format media embedding",
        "Real-time collaboration",
        "Version history and drafts"
      ],
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      category: "content",
      popularity: 95,
      level: "Beginner"
    },
    {
      icon: FileTextIcon,
      title: "CV Generation",
      description: "Create professional resumes with smart templates and AI-powered content optimization.",
      features: [
        "10+ professional templates",
        "AI-powered content suggestions",
        "ATS-friendly formatting",
        "Real-time preview and editing",
        "Export to PDF/DOCX",
        "Industry-specific examples"
      ],
      gradient: "from-green-500/20 to-emerald-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
      category: "career",
      popularity: 88,
      level: "All Levels"
    },
    {
      icon: CodeIcon,
      title: "AI Code Generation",
      description: "Generate, debug, and optimize code across multiple programming languages with AI assistance.",
      features: [
        "20+ programming languages",
        "Framework-specific code generation",
        "Code review and optimization",
        "Error detection and fixes",
        "Code documentation",
        "Integration with popular IDEs"
      ],
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      category: "content",
      popularity: 92,
      level: "Intermediate"
    },
    {
      icon: MapIcon,
      title: "Learning Roadmaps",
      description: "Structured learning paths with progress tracking and personalized recommendations.",
      features: [
        "100+ technology roadmaps",
        "Interactive progress tracking",
        "Skill assessment tests",
        "Personalized recommendations",
        "Milestone celebrations",
        "Community learning groups"
      ],
      gradient: "from-orange-500/20 to-red-500/20",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
      category: "learning",
      popularity: 85,
      level: "All Levels"
    },
    {
      icon: MicIcon,
      title: "Mock Interviews",
      description: "AI-powered interview practice with real-time feedback and performance analytics.",
      features: [
        "50+ interview categories",
        "Real-time voice analysis",
        "Performance scorecards",
        "Industry-specific questions",
        "Video recording and playback",
        "Expert feedback system"
      ],
      gradient: "from-red-500/20 to-pink-500/20",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600",
      category: "career",
      popularity: 90,
      level: "Intermediate"
    },
    {
      icon: UsersIcon,
      title: "Friend Invitations",
      description: "Connect with peers, collaborate on projects, and build your professional network.",
      features: [
        "Smart invitation system",
        "Collaboration workspace",
        "Activity feed integration",
        "Group project management",
        "Skill-based matching",
        "Privacy controls"
      ],
      gradient: "from-pink-500/20 to-rose-500/20",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-600",
      category: "social",
      popularity: 78,
      level: "Beginner"
    },
    {
      icon: MessageCircleIcon,
      title: "Conversations",
      description: "Real-time messaging with advanced features for seamless communication.",
      features: [
        "End-to-end encryption",
        "File and code sharing",
        "Voice and video calls",
        "Message reactions",
        "Chat organization",
        "Search and archive"
      ],
      gradient: "from-indigo-500/20 to-purple-500/20",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
      category: "social",
      popularity: 82,
      level: "Beginner"
    },
    {
      icon: BellIcon,
      title: "Notifications",
      description: "Smart notification system that keeps you informed without being overwhelming.",
      features: [
        "Customizable preferences",
        "Smart grouping and prioritization",
        "Do Not Disturb modes",
        "Email digests",
        "Mobile push notifications",
        "Notification analytics"
      ],
      gradient: "from-yellow-500/20 to-orange-500/20",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-600",
      category: "content",
      popularity: 75,
      level: "Beginner"
    },
  ]

  const securityFeatures = [
    {
      icon: ShieldIcon,
      title: "Face Recognition Login",
      description: "Biometric authentication using advanced facial recognition technology.",
      features: ["99.9% accuracy", "Liveness detection", "Multi-factor backup", "Privacy-first design"],
      gradient: "from-blue-500/20 to-indigo-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      category: "security"
    },
    {
      icon: KeyIcon,
      title: "Password Management",
      description: "Advanced password security with recovery options and breach monitoring.",
      features: ["Encrypted storage", "Two-factor authentication", "Recovery protocols", "Security alerts"],
      gradient: "from-green-500/20 to-teal-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
      category: "security"
    },
    {
      icon: SettingsIcon,
      title: "Account Management",
      description: "Complete control over your profile, preferences, and privacy settings.",
      features: ["Profile customization", "Privacy controls", "Data export", "Account deletion"],
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      category: "security"
    },
  ]

  const quickActions = [
    // { icon: VideoIcon, label: "Video Tutorials", description: "Watch step-by-step guides", count: "50+", color: "bg-red-500/10", textColor: "text-red-600" },
    // { icon: BookOpenIcon, label: "Documentation", description: "Detailed feature guides", count: "200+", color: "bg-blue-500/10", textColor: "text-blue-600" },
    // { icon: MessageCircleIcon, label: "Community Forum", description: "Get help from users", count: "10k+", color: "bg-green-500/10", textColor: "text-green-600" },
    // { icon: MailIcon, label: "Contact Support", description: "24/7 expert assistance", count: "1h", color: "bg-purple-500/10", textColor: "text-purple-600" },
  ]

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = activeCategory === "all" || feature.category === activeCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 border-b border-base-300/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl mb-6 shadow-lg"
            >
              <HelpCircleIcon className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-6">
              Help Center
            </h1>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover everything our platform offers. From content creation to career development, 
              we've got you covered with comprehensive guides and support.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="text"
                placeholder="Search features, guides, and tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-base-100 border border-base-300/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all duration-300 shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-base-300/30 hover:border-primary/20 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className={`w-6 h-6 ${action.textColor}`} />
              </div>
              <h3 className="font-semibold text-base-content mb-2">{action.label}</h3>
              <p className="text-sm text-base-content/60 mb-2">{action.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-base-content/40">{action.count} available</span>
                <ArrowRightIcon className="w-4 h-4 text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Categories Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "bg-base-100 text-base-content/70 hover:text-base-content hover:bg-base-200 border border-base-300/30"
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeCategory === category.id ? "bg-white/20" : "bg-base-300"
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-8 mb-16"
        >
          {filteredFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
              }}
              className="group relative bg-base-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-base-300/50 hover:border-primary/30 transition-all duration-500 overflow-hidden"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-14 h-14 ${feature.iconBg} backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}
                    >
                      <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-base-content group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h2>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`badge badge-sm ${feature.level === 'Beginner' ? 'badge-success' : feature.level === 'Intermediate' ? 'badge-warning' : 'badge-error'}`}>
                          {feature.level}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-base-content/60">
                          <StarIcon className="w-4 h-4 text-yellow-500" />
                          {feature.popularity}% popular
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-base-content/70 mb-6 leading-relaxed">{feature.description}</p>

                <div className="space-y-3">
                  {feature.features.slice(0, 4).map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + idx * 0.05 }}
                      className="flex items-center text-sm text-base-content/60 group-hover:text-base-content/80 transition-colors duration-300"
                    >
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                  {feature.features.length > 4 && (
                    <div className="text-sm text-primary font-medium flex items-center gap-2">
                      <LightbulbIcon className="w-4 h-4" />
                      +{feature.features.length - 4} more features
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-6 py-3 rounded-2xl mb-4">
              <ShieldIcon className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold text-primary">Security & Authentication</span>
            </div>
            <h2 className="text-4xl font-bold text-base-content mb-4">Enterprise-Grade Security</h2>
            <p className="text-base-content/70 max-w-2xl mx-auto text-lg">
              Your data's security is our top priority. We employ industry-leading practices to keep your information safe.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.3 },
                }}
                className="group relative bg-base-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-base-300/50 hover:border-primary/30 transition-all duration-500 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-16 h-16 ${feature.iconBg} backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </motion.div>

                  <h3 className="text-xl font-bold text-base-content mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-base-content/70 leading-relaxed mb-4">{feature.description}</p>

                  <div className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center text-sm text-base-content/60">
                        <LockIcon className="w-3 h-3 text-green-500 mr-2" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="group relative bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 rounded-3xl p-12 shadow-2xl border border-primary/20 mb-16 overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10 text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
              <RocketIcon className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-4xl font-bold text-base-content mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              Join thousands of users who are already accelerating their learning and career growth with our platform.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-lg gap-3 shadow-lg"
              >
                <SparklesIcon className="w-5 h-5" />
                Explore Features
              </motion.button>
              <Link to="/contacts">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline btn-lg gap-3"
                >
                  <MessageCircleIcon className="w-5 h-5" />
                  Contact Support
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Help