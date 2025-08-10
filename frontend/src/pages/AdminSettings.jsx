"use client"
import { motion } from "framer-motion"
import {
  SettingsIcon,
  UserIcon,
  BellIcon,
  ShieldIcon,
  PaletteIcon,
  DatabaseIcon,
  KeyIcon,
  EyeIcon,
  EyeOffIcon,
  CameraIcon,
  SaveIcon,
  RefreshCwIcon,
  TrashIcon,
  DownloadIcon,
  UploadIcon,
  MoonIcon,
  SunIcon,
  MonitorIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react"
import { useState, useEffect } from "react"
import useAuthUser from "../hooks/useAuthUser"

const AdminSettings = () => {
  const { authUser } = useAuthUser()
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)

  // Settings states
  const [settings, setSettings] = useState({
    profile: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      bio: "Full Stack Developer passionate about creating amazing user experiences",
      location: "San Francisco, CA",
      website: "https://johndoe.dev",
      profilePic: "/placeholder.svg?height=120&width=120",
    },
    appearance: {
      theme: "system",
      language: "en",
      timezone: "UTC-8",
      animations: true,
      compactMode: false,
    },
    notifications: {
      email: true,
      push: true,
      desktop: false,
      sound: true,
      marketing: false,
      updates: true,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showLocation: true,
      allowMessages: true,
      dataCollection: false,
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30,
      passwordStrength: "strong",
    },
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const settingSections = [
    {
      id: "profile",
      label: "Profile",
      icon: UserIcon,
      gradient: "from-blue-500/20 to-cyan-500/20",
      description: "Manage your personal information",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: PaletteIcon,
      gradient: "from-purple-500/20 to-pink-500/20",
      description: "Customize your interface",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: BellIcon,
      gradient: "from-green-500/20 to-emerald-500/20",
      description: "Control your notification preferences",
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: EyeIcon,
      gradient: "from-orange-500/20 to-red-500/20",
      description: "Manage your privacy settings",
    },
    {
      id: "security",
      label: "Security",
      icon: ShieldIcon,
      gradient: "from-indigo-500/20 to-purple-500/20",
      description: "Secure your account",
    },
    {
      id: "data",
      label: "Data",
      icon: DatabaseIcon,
      gradient: "from-teal-500/20 to-cyan-500/20",
      description: "Export and manage your data",
    },
  ]

  const handleSettingChange = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-base-200/30 rounded-xl border border-base-300/30 hover:bg-base-200/50 transition-all duration-300">
      <div className="flex-1">
        <h4 className="font-medium text-base-content">{label}</h4>
        {description && <p className="text-sm text-base-content/60 mt-1">{description}</p>}
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
          enabled ? "bg-primary" : "bg-base-300"
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 2 }}
          transition={{ duration: 0.2 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
        />
      </motion.button>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="inline-block mb-4"
          >
            <SettingsIcon className="size-16 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold text-base-content mb-2">Loading Settings...</h2>
          <p className="text-base-content/60">Preparing your preferences</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 backdrop-blur-sm border-b border-base-300/50"
      >
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <SettingsIcon className="size-16 text-primary" />
              </motion.div>
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
              Settings
            </h1>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-8">
              Customize your experience and manage your account preferences
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-base-content/60">
              <div className="flex items-center gap-2">
                <SparklesIcon className="size-4" />
                <span>Personalized</span>
              </div>
              <div className="flex items-center gap-2">
                <ZapIcon className="size-4" />
                <span>Real-time Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldIcon className="size-4" />
                <span>Secure</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-base-100/80 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-2xl overflow-hidden sticky top-8">
              <div className="p-6 border-b border-base-300/30 bg-gradient-to-r from-primary/5 to-secondary/5">
                <h2 className="text-xl font-bold text-base-content">Settings Menu</h2>
                <p className="text-sm text-base-content/60 mt-1">Choose a category</p>
              </div>
              <nav className="p-4 space-y-2">
                {settingSections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary shadow-lg"
                        : "hover:bg-base-200/50 hover:translate-x-1"
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${section.gradient} backdrop-blur-sm`}>
                      <section.icon className="size-4" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">{section.label}</span>
                      <p className="text-xs text-base-content/60 mt-0.5">{section.description}</p>
                    </div>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="bg-base-100/80 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-2xl overflow-hidden">
              {/* Profile Settings */}
              {activeSection === "profile" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-8 border-b border-base-300/30 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                        <UserIcon className="size-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-base-content">Profile Settings</h2>
                        <p className="text-base-content/60">Manage your personal information</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full ring-4 ring-primary/30 ring-offset-4 ring-offset-base-100 overflow-hidden">
                          <img
                            src={settings.profile.profilePic || "/placeholder.svg"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-content rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <CameraIcon className="size-4" />
                        </motion.button>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-base-content">Profile Picture</h3>
                        <p className="text-sm text-base-content/60 mb-3">Update your profile photo</p>
                        <div className="flex gap-2">
                          <button className="btn btn-sm btn-primary">
                            <UploadIcon className="size-4" />
                            Upload
                          </button>
                          <button className="btn btn-sm btn-ghost">
                            <TrashIcon className="size-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-base-content">Full Name</label>
                        <input
                          type="text"
                          value={settings.profile.fullName}
                          onChange={(e) => handleSettingChange("profile", "fullName", e.target.value)}
                          className="w-full px-4 py-3 bg-base-200/50 border border-base-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-base-content">Email</label>
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => handleSettingChange("profile", "email", e.target.value)}
                          className="w-full px-4 py-3 bg-base-200/50 border border-base-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-base-content">Location</label>
                        <input
                          type="text"
                          value={settings.profile.location}
                          onChange={(e) => handleSettingChange("profile", "location", e.target.value)}
                          className="w-full px-4 py-3 bg-base-200/50 border border-base-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-base-content">Website</label>
                        <input
                          type="url"
                          value={settings.profile.website}
                          onChange={(e) => handleSettingChange("profile", "website", e.target.value)}
                          className="w-full px-4 py-3 bg-base-200/50 border border-base-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-base-content">Bio</label>
                      <textarea
                        value={settings.profile.bio}
                        onChange={(e) => handleSettingChange("profile", "bio", e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-base-200/50 border border-base-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button className="btn btn-ghost">
                        <RefreshCwIcon className="size-4" />
                        Reset
                      </button>
                      <button className="btn btn-primary">
                        <SaveIcon className="size-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appearance Settings */}
              {activeSection === "appearance" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-8 border-b border-base-300/30 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                        <PaletteIcon className="size-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-base-content">Appearance</h2>
                        <p className="text-base-content/60">Customize your interface</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Theme Selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-base-content">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: "light", label: "Light", icon: SunIcon },
                          { id: "dark", label: "Dark", icon: MoonIcon },
                          { id: "system", label: "System", icon: MonitorIcon },
                        ].map((theme) => (
                          <motion.button
                            key={theme.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSettingChange("appearance", "theme", theme.id)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              settings.appearance.theme === theme.id
                                ? "border-primary bg-primary/10"
                                : "border-base-300/50 bg-base-200/30 hover:bg-base-200/50"
                            }`}
                          >
                            <theme.icon className="size-8 mx-auto mb-2 text-base-content" />
                            <p className="font-medium text-base-content">{theme.label}</p>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Other Appearance Settings */}
                    <div className="space-y-4">
                      <ToggleSwitch
                        enabled={settings.appearance.animations}
                        onChange={(value) => handleSettingChange("appearance", "animations", value)}
                        label="Enable Animations"
                        description="Show smooth transitions and animations"
                      />
                      <ToggleSwitch
                        enabled={settings.appearance.compactMode}
                        onChange={(value) => handleSettingChange("appearance", "compactMode", value)}
                        label="Compact Mode"
                        description="Reduce spacing for more content"
                      />
                    </div>

                    {/* Language & Region */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-base-content">Language</label>
                        <select
                          value={settings.appearance.language}
                          onChange={(e) => handleSettingChange("appearance", "language", e.target.value)}
                          className="w-full px-4 py-3 bg-base-200/50 border border-base-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-base-content">Timezone</label>
                        <select
                          value={settings.appearance.timezone}
                          onChange={(e) => handleSettingChange("appearance", "timezone", e.target.value)}
                          className="w-full px-4 py-3 bg-base-200/50 border border-base-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                        >
                          <option value="UTC-8">Pacific Time (UTC-8)</option>
                          <option value="UTC-5">Eastern Time (UTC-5)</option>
                          <option value="UTC+0">GMT (UTC+0)</option>
                          <option value="UTC+1">Central European Time (UTC+1)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Settings */}
              {activeSection === "notifications" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-8 border-b border-base-300/30 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                        <BellIcon className="size-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-base-content">Notifications</h2>
                        <p className="text-base-content/60">Control your notification preferences</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <ToggleSwitch
                      enabled={settings.notifications.email}
                      onChange={(value) => handleSettingChange("notifications", "email", value)}
                      label="Email Notifications"
                      description="Receive notifications via email"
                    />
                    <ToggleSwitch
                      enabled={settings.notifications.push}
                      onChange={(value) => handleSettingChange("notifications", "push", value)}
                      label="Push Notifications"
                      description="Receive push notifications on your device"
                    />
                    <ToggleSwitch
                      enabled={settings.notifications.desktop}
                      onChange={(value) => handleSettingChange("notifications", "desktop", value)}
                      label="Desktop Notifications"
                      description="Show notifications on your desktop"
                    />
                    <ToggleSwitch
                      enabled={settings.notifications.sound}
                      onChange={(value) => handleSettingChange("notifications", "sound", value)}
                      label="Sound Notifications"
                      description="Play sound for notifications"
                    />
                    <ToggleSwitch
                      enabled={settings.notifications.marketing}
                      onChange={(value) => handleSettingChange("notifications", "marketing", value)}
                      label="Marketing Emails"
                      description="Receive promotional and marketing emails"
                    />
                    <ToggleSwitch
                      enabled={settings.notifications.updates}
                      onChange={(value) => handleSettingChange("notifications", "updates", value)}
                      label="Product Updates"
                      description="Get notified about new features and updates"
                    />
                  </div>
                </motion.div>
              )}

              {/* Privacy Settings */}
              {activeSection === "privacy" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-8 border-b border-base-300/30 bg-gradient-to-r from-orange-500/5 to-red-500/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl">
                        <EyeIcon className="size-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-base-content">Privacy</h2>
                        <p className="text-base-content/60">Manage your privacy settings</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-base-content">Profile Visibility</label>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleSettingChange("privacy", "profileVisibility", e.target.value)}
                        className="w-full px-4 py-3 bg-base-200/50 border border-base-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                      >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className="space-y-6">
                      <ToggleSwitch
                        enabled={settings.privacy.showEmail}
                        onChange={(value) => handleSettingChange("privacy", "showEmail", value)}
                        label="Show Email Address"
                        description="Display your email on your public profile"
                      />
                      <ToggleSwitch
                        enabled={settings.privacy.showLocation}
                        onChange={(value) => handleSettingChange("privacy", "showLocation", value)}
                        label="Show Location"
                        description="Display your location on your profile"
                      />
                      <ToggleSwitch
                        enabled={settings.privacy.allowMessages}
                        onChange={(value) => handleSettingChange("privacy", "allowMessages", value)}
                        label="Allow Messages"
                        description="Let other users send you messages"
                      />
                      <ToggleSwitch
                        enabled={settings.privacy.dataCollection}
                        onChange={(value) => handleSettingChange("privacy", "dataCollection", value)}
                        label="Data Collection"
                        description="Allow collection of usage data for improvements"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeSection === "security" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-8 border-b border-base-300/30 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl">
                        <ShieldIcon className="size-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-base-content">Security</h2>
                        <p className="text-base-content/60">Secure your account</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Password Change */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-base-content">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-base-content">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="w-full px-4 py-3 pr-12 bg-base-200/50 border border-base-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                              placeholder="Enter current password"
                            />
                            <button
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-base-content/60 hover:text-base-content transition-colors"
                            >
                              {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-base-content">New Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 bg-base-200/50 border border-base-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                              placeholder="Enter new password"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-base-content">Confirm Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 bg-base-200/50 border border-base-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                        <button className="btn btn-primary">
                          <KeyIcon className="size-4" />
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Security Options */}
                    <div className="space-y-6">
                      <ToggleSwitch
                        enabled={settings.security.twoFactor}
                        onChange={(value) => handleSettingChange("security", "twoFactor", value)}
                        label="Two-Factor Authentication"
                        description="Add an extra layer of security to your account"
                      />
                      <ToggleSwitch
                        enabled={settings.security.loginAlerts}
                        onChange={(value) => handleSettingChange("security", "loginAlerts", value)}
                        label="Login Alerts"
                        description="Get notified when someone logs into your account"
                      />
                    </div>

                    {/* Session Timeout */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-base-content">Session Timeout (minutes)</label>
                      <select
                        value={settings.security.sessionTimeout}
                        onChange={(e) =>
                          handleSettingChange("security", "sessionTimeout", Number.parseInt(e.target.value))
                        }
                        className="w-full px-4 py-3 bg-base-200/50 border border-base-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                        <option value={0}>Never</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Data Management */}
              {activeSection === "data" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-8 border-b border-base-300/30 bg-gradient-to-r from-teal-500/5 to-cyan-500/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl">
                        <DatabaseIcon className="size-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-base-content">Data Management</h2>
                        <p className="text-base-content/60">Export and manage your data</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Export Data */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-base-content">Export Your Data</h3>
                      <p className="text-base-content/60">Download a copy of your data in various formats</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-4 bg-base-200/50 border border-base-300/50 rounded-xl hover:bg-base-200/70 transition-all duration-300"
                        >
                          <DownloadIcon className="size-8 mx-auto mb-2 text-primary" />
                          <p className="font-medium">Export as JSON</p>
                          <p className="text-sm text-base-content/60">Machine readable format</p>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-4 bg-base-200/50 border border-base-300/50 rounded-xl hover:bg-base-200/70 transition-all duration-300"
                        >
                          <DownloadIcon className="size-8 mx-auto mb-2 text-primary" />
                          <p className="font-medium">Export as CSV</p>
                          <p className="text-sm text-base-content/60">Spreadsheet format</p>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-4 bg-base-200/50 border border-base-300/50 rounded-xl hover:bg-base-200/70 transition-all duration-300"
                        >
                          <DownloadIcon className="size-8 mx-auto mb-2 text-primary" />
                          <p className="font-medium">Export as PDF</p>
                          <p className="text-sm text-base-content/60">Printable format</p>
                        </motion.button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="space-y-4 p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
                      <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                      <p className="text-base-content/60">These actions cannot be undone</p>
                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 hover:bg-red-500/20 transition-all duration-300"
                        >
                          <RefreshCwIcon className="size-4 inline mr-2" />
                          Reset All Settings
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 hover:bg-red-500/20 transition-all duration-300"
                        >
                          <TrashIcon className="size-4 inline mr-2" />
                          Delete Account
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
