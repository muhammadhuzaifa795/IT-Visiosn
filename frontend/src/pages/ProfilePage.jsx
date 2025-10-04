import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "../lib/api";
import {
  CalendarIcon,
  Edit3Icon,
  ShuffleIcon,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  Save,
  Trash2,
  Plus,
  Crown,
  Sparkles,
  Zap,
  Star,
  Target,
  Trophy,
  Users,
  TrendingUp,
  BadgeCheck,
  Shield
} from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import SkillSelector from "../components/SkillSelector";
import { LANGUAGES } from "../constants";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePage = () => {
  const { authUser: user, isLoading } = useAuthUser();
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    bio: "",
    nativeLanguage: "",
    location: "",
    phone: "",
    dateOfBirth: "",
    skills: [],
    profilePic: "",
  });

  // Check subscription status
  const isSubscribed = user?.subscription && user.subscription !== "free";
  const subscriptionType = user?.subscription;

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        email: user.email || "",
        bio: user.bio || "",
        nativeLanguage: user.nativeLanguage || "",
        location: user.location || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth?.split("T")[0] || "",
        skills: user.skills || [],
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success("🎉 Profile updated successfully!");
      setIsEditing(false);
    },
    onError: () => toast.error("❌ Failed to update profile"),
  });

  const { mutate: removeSkillMutation } = useMutation({
    mutationFn: (updatedSkills) => updateUserProfile({ skills: updatedSkills }),
    onSuccess: () => toast.success("🗑️ Skill removed"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation(profile);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const avatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setProfile((prev) => ({ ...prev, profilePic: avatar }));
    toast.success("🔄 Random profile picture generated!");
  };

  const handleImgError = () => {
    setProfile((prev) => ({ ...prev, profilePic: "/fallback-avatar.png" }));
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = profile.skills.filter((skill) => skill !== skillToRemove);
    setProfile((prev) => ({ ...prev, skills: updatedSkills }));
    removeSkillMutation(updatedSkills);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="loading loading-spinner loading-lg text-primary mb-4"
          />
          <p className="text-base-content/70">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(var(--b1), 0.95)',
            color: 'hsl(var(--bc))',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(var(--bc), 0.1)',
            borderRadius: '12px',
            padding: '12px 16px',
          },
        }}
      />
      
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="max-w-6xl mx-auto mb-8"
      >
        <div className="bg-base-100/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-base-300/30 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-75" />
                <Edit3Icon className="w-12 h-12 text-primary relative z-10" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Profile Settings
                </h1>
                <p className="text-base-content/70 mt-2 text-lg">
                  Manage your personal information and preferences
                </p>
              </div>
            </div>
            
            {/* Subscription Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                isSubscribed 
                  ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30' 
                  : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
              }`}
            >
              <div className={`p-2 rounded-lg ${isSubscribed ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`}>
                {isSubscribed ? (
                  <Crown className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Star className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {isSubscribed ? `${subscriptionType} Member` : 'Free Member'}
                </p>
                <p className="text-xs opacity-70">
                  {isSubscribed ? 'Premium Features Unlocked' : 'Upgrade for Premium Features'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="btn btn-primary btn-lg gap-3 shadow-lg hover:shadow-xl"
              >
                <Edit3Icon className="w-5 h-5" />
                Edit Profile
                <Sparkles className="w-4 h-4" />
              </motion.button>
            ) : (
              <div className="flex gap-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost btn-lg border border-base-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="btn btn-primary btn-lg gap-3 shadow-lg hover:shadow-xl"
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                      <Zap className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Enhanced Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Profile Card */}
          <div className="card bg-base-100/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-base-300/30 overflow-hidden">
            <div className="card-body items-center text-center p-6">
              <div className="relative group mb-4">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring-4 ring-primary ring-offset-4 ring-offset-base-100 transition-all duration-500 group-hover:ring-secondary group-hover:scale-105">
                    {profile.profilePic ? (
                      <img
                        src={profile.profilePic}
                        alt="Profile"
                        onError={handleImgError}
                        className="object-cover w-full h-full rounded-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full">
                        <User className="w-16 h-16 text-primary/60" />
                      </div>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRandomAvatar}
                    className="btn btn-circle btn-primary btn-sm absolute bottom-2 right-2 shadow-lg"
                    title="Generate random avatar"
                  >
                    <ShuffleIcon className="w-4 h-4" />
                  </motion.button>
                )}
                {/* Online Status */}
                <div className="absolute bottom-2 left-2 w-4 h-4 bg-success rounded-full border-2 border-base-100 shadow-lg" />
                
                {/* Subscription Crown */}
                {isSubscribed && (
                  <div className="absolute -top-1 -right-1">
                    <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500 drop-shadow-lg" />
                  </div>
                )}
              </div>

              <motion.h3 
                className="font-bold text-2xl text-base-content mb-2"
                whileHover={{ scale: 1.05 }}
              >
                {profile.fullName || "Your Name"}
              </motion.h3>
              
              <p className="text-base-content/70 mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {profile.email}
              </p>
              
              {profile.location && (
                <div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 w-full mt-4">
                <div className="text-center">
                  <div className="font-bold text-xl text-primary">{profile.skills.length}</div>
                  <div className="text-xs text-base-content/60">Skills</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl text-secondary">0</div>
                  <div className="text-xs text-base-content/60">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl text-accent">0</div>
                  <div className="text-xs text-base-content/60">Friends</div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Features Card */}
          {!isSubscribed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-xl rounded-2xl border border-primary/20 overflow-hidden"
            >
              <div className="card-body p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  <h3 className="font-bold text-lg">Go Premium</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                    <span>Advanced AI Features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>Priority Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-500" />
                    <span>Exclusive Tools</span>
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/subscription'}
                  className="btn btn-primary btn-sm w-full mt-4 gap-2"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade Now
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Quick Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card bg-base-100/80 backdrop-blur-xl rounded-2xl border border-base-300/30 overflow-hidden"
          >
            <div className="card-body p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-success" />
                <h3 className="font-semibold">Your Progress</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>Profile Completion</span>
                  <span className="font-semibold text-success">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Skills Mastered</span>
                  <span className="font-semibold text-info">{profile.skills.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Member Since</span>
                  <span className="font-semibold">{new Date(user?.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Main Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="card bg-base-100/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-base-300/30 overflow-hidden">
            <div className="card-body p-8">
              <div className="flex items-center gap-3 mb-8">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Personal Information</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: User, name: "fullName", label: "Full Name", type: "text", placeholder: "Enter your full name" },
                    { icon: Mail, name: "email", label: "Email Address", type: "email", placeholder: "your@email.com", disabled: true },
                    { icon: Phone, name: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 123-4567" },
                    { icon: MapPin, name: "location", label: "Location", type: "text", placeholder: "City, Country" },
                  ].map((field, index) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="form-control"
                    >
                      <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2">
                          <field.icon className="w-4 h-4 text-primary" />
                          {field.label}
                        </span>
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type={field.type}
                        className="input input-bordered w-full transition-all duration-300 bg-base-200/50"
                        name={field.name}
                        value={profile[field.name]}
                        onChange={handleChange}
                        disabled={!isEditing || field.disabled}
                        placeholder={field.placeholder}
                      />
                      {field.disabled && (
                        <label className="label">
                          <span className="label-text-alt text-base-content/50">Email cannot be changed</span>
                        </label>
                      )}
                    </motion.div>
                  ))}

                  {/* Language and Date of Birth */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="form-control"
                  >
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        Native Language
                      </span>
                    </label>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      name="nativeLanguage"
                      className="select select-bordered w-full transition-all duration-300 bg-base-200/50"
                      value={profile.nativeLanguage}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="">Select your native language</option>
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </motion.select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="form-control"
                  >
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        Date of Birth
                      </span>
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="date"
                      className="input input-bordered w-full transition-all duration-300 bg-base-200/50"
                      name="dateOfBirth"
                      value={profile.dateOfBirth}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </motion.div>
                </div>

                {/* Bio Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="form-control"
                >
                  <label className="label">
                    <span className="label-text font-semibold">Bio</span>
                    <span className={`label-text-alt ${profile.bio.length > 450 ? 'text-error' : 'text-base-content/50'}`}>
                      {profile.bio.length}/500
                    </span>
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    name="bio"
                    className="textarea textarea-bordered h-32 w-full transition-all duration-300 bg-base-200/50 resize-none"
                    value={profile.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself, your interests, and your goals..."
                    maxLength={500}
                  />
                </motion.div>

                {/* Enhanced Skills Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="form-control"
                >
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      Skills & Expertise
                    </span>
                  </label>
                  <div className="min-h-[100px] p-6 border-2 border-dashed border-base-300 rounded-2xl bg-base-200/30 transition-all duration-300 hover:border-primary/50">
                    <AnimatePresence mode="popLayout">
                      {profile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {profile.skills.map((skill, i) => (
                            <motion.div
                              key={i}
                              layout
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className="badge badge-primary badge-lg gap-3 py-4 px-4 text-sm font-semibold shadow-lg"
                            >
                              {skill}
                              {isEditing && (
                                <motion.button
                                  whileHover={{ scale: 1.2, rotate: 90 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="btn btn-ghost btn-xs btn-circle hover:bg-error/20"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </motion.button>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center text-base-content/50 py-8"
                        >
                          <Award className="w-12 h-12 mx-auto mb-4 opacity-30" />
                          <p className="text-lg mb-2">No skills added yet</p>
                          <p className="text-sm">Add your skills to showcase your expertise</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {isEditing && (
                    <div className="mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setShowSkillModal(true)}
                        className="btn btn-outline btn-lg gap-3 w-full md:w-auto"
                      >
                        <Plus className="w-5 h-5" />
                        Add New Skill
                        <Sparkles className="w-4 h-4" />
                      </motion.button>
                    </div>
                  )}
                </motion.div>

                {/* Premium Features Notice */}
                {!isSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Crown className="w-6 h-6 text-yellow-500" />
                      <h4 className="font-semibold text-lg">Unlock Premium Features</h4>
                    </div>
                    <p className="text-base-content/70 mb-4">
                      Upgrade to premium for advanced profile customization, AI-powered skill recommendations, and exclusive badges.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.href = '/subscription'}
                      className="btn btn-primary btn-sm gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Explore Premium
                    </motion.button>
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Skill Selector Modal */}
      <AnimatePresence>
        {showSkillModal && (
          <SkillSelector
            selectedSkills={profile.skills}
            onAddSkill={(skill) => {
              const updated = [...new Set([...profile.skills, skill])];
              setProfile((prev) => ({ ...prev, skills: updated }));
              updateProfileMutation({ ...profile, skills: updated });
              setShowSkillModal(false);
              toast.success(`✅ ${skill} added to your skills!`);
            }}
            onClose={() => setShowSkillModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;