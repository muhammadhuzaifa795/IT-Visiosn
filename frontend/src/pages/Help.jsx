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
} from "lucide-react"

const Help = () => {
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

  const features = [
    {
      icon: FileTextIcon,
      title: "Post Creation",
      description: "Create posts with advanced features including user commands and automatic code error detection.",
      features: [
        "Write and publish posts",
        "Use user commands for enhanced functionality",
        "Automatic code error detection and highlighting",
        "Rich text formatting options",
      ],
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: FileTextIcon,
      title: "CV Generation",
      description: "Generate professional CVs automatically based on your profile and experience.",
      features: [
        "Multiple CV templates",
        "Auto-fill from profile data",
        "Export in various formats",
        "Professional formatting",
      ],
      gradient: "from-green-500/20 to-emerald-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: CodeIcon,
      title: "AI Code Generation",
      description: "Generate code using AI assistance for various programming languages and frameworks.",
      features: [
        "Multiple programming languages",
        "Framework-specific code",
        "Code optimization suggestions",
        "Error fixing assistance",
      ],
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: MapIcon,
      title: "Learning Roadmaps",
      description: "Access structured learning paths and roadmaps for different technologies and skills.",
      features: [
        "Technology-specific roadmaps",
        "Progress tracking",
        "Milestone achievements",
        "Resource recommendations",
      ],
      gradient: "from-orange-500/20 to-red-500/20",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: MicIcon,
      title: "Mock Interviews",
      description: "Practice with AI-powered mock interviews to prepare for real job interviews.",
      features: [
        "Various interview types",
        "Real-time feedback",
        "Performance analytics",
        "Industry-specific questions",
      ],
      gradient: "from-red-500/20 to-pink-500/20",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      icon: UsersIcon,
      title: "Friend Invitations",
      description: "Invite friends to join the platform and collaborate on projects together.",
      features: ["Send invitation links", "Track invitation status", "Friend management", "Collaborative features"],
      gradient: "from-pink-500/20 to-rose-500/20",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
    {
      icon: MessageCircleIcon,
      title: "Conversations",
      description: "Engage in conversations with other users and participate in community discussions.",
      features: ["Real-time messaging", "Group conversations", "Message history", "File sharing"],
      gradient: "from-indigo-500/20 to-purple-500/20",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: BellIcon,
      title: "Notifications",
      description: "Stay updated with real-time notifications about platform activities and updates.",
      features: ["Real-time alerts", "Customizable preferences", "Email notifications", "Activity summaries"],
      gradient: "from-yellow-500/20 to-orange-500/20",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
  ]

  const securityFeatures = [
    {
      icon: ShieldIcon,
      title: "Face Recognition Login",
      description: "Secure and convenient login using facial recognition technology for enhanced security.",
      gradient: "from-blue-500/20 to-indigo-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: KeyIcon,
      title: "Password Reset",
      description: "Easy password recovery system with secure email verification and reset process.",
      gradient: "from-green-500/20 to-teal-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: SettingsIcon,
      title: "Profile & Logout",
      description: "Manage your profile settings, personal information, and securely logout from the platform.",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-base-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-full blur-xl"
            />
            <div className="relative bg-base-100 p-4 rounded-full">
              <HelpCircleIcon className="w-12 h-12 text-primary" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-6">
            Help Center
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about using our platform. Discover powerful features and get the most out of
            your experience.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8 mb-16"
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
              className="group relative bg-base-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-base-300/50 hover:border-primary/30 transition-all duration-500 overflow-hidden"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-12 h-12 ${feature.iconBg} backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 group-hover:shadow-lg transition-all duration-300`}
                  >
                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-base-content group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h2>
                </div>

                <p className="text-base-content/70 mb-6 leading-relaxed">{feature.description}</p>

                <ul className="space-y-3">
                  {feature.features.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + idx * 0.05 }}
                      className="flex items-center text-sm text-base-content/60 group-hover:text-base-content/80 transition-colors duration-300"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 group-hover:scale-125 transition-transform duration-300" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Authentication & Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <ShieldIcon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Security & Authentication</span>
            </div>
            <h2 className="text-3xl font-bold text-base-content mb-4">Advanced Security Features</h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Your security is our priority. Explore our comprehensive authentication and security features.
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
                className="group relative bg-base-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-base-300/50 hover:border-primary/30 transition-all duration-500 text-center overflow-hidden"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 ${feature.iconBg} backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </motion.div>

                  <h3 className="text-xl font-bold text-base-content mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-base-content/70 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* User Generation Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="group relative bg-base-100 rounded-3xl p-12 shadow-xl hover:shadow-2xl border border-base-300/50 hover:border-primary/30 transition-all duration-500 mb-16 overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300"
            >
              <UserPlusIcon className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-base-content mb-6 group-hover:text-primary transition-colors duration-300">
              User Generation & Management
            </h2>

            <p className="text-base-content/70 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
              Create and manage user accounts with comprehensive profile setup, role assignments, and permission
              management. Generate user credentials and manage access levels across the platform with advanced user
              management tools and analytics.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <SparklesIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Advanced Analytics</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <ShieldIcon className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">Role Management</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="group relative bg-base-100 rounded-3xl p-12 shadow-xl hover:shadow-2xl border border-base-300/50 hover:border-primary/30 transition-all duration-500 text-center overflow-hidden"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8"
            >
              <HelpCircleIcon className="w-8 h-8 text-primary" />
            </motion.div>

            <h2 className="text-3xl font-bold text-base-content mb-6">Need More Help?</h2>

            <p className="text-base-content/70 mb-8 text-lg max-w-2xl mx-auto">
              Can't find what you're looking for? Our dedicated support team is here to help you succeed.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group/btn relative bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Contact Support
                <ArrowRightIcon className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Help
