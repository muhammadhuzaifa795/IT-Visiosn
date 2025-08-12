
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
  Plus
} from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import SkillSelector from "../components/SkillSelector";
import { LANGUAGES } from "../constants";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const AdminProfilePage = () => {
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
      toast.success("Profile updated successfully");
      setIsEditing(false);
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const { mutate: removeSkillMutation } = useMutation({
    mutationFn: (updatedSkills) => updateUserProfile({ skills: updatedSkills }),
    onSuccess: () => toast.success("Skill removed"),
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
    toast.success("Random profile picture generated!");
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
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto mb-12"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-base-100 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-4">
            <Edit3Icon className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-3xl font-extrabold text-base-content">Profile Settings</h1>
              <p className="text-base-content/70 mt-1 text-sm">
                Customize your personal information and preferences
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="btn btn-primary btn-md gap-2 shadow-md"
              >
                <Edit3Icon className="w-5 h-5" />
                Edit Profile
              </motion.button>
            ) : (
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost btn-md"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="btn btn-primary btn-md gap-2 shadow-md"
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
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="card bg-base-100 shadow-lg rounded-xl overflow-hidden">
            <div className="card-body items-center text-center p-6">
              <h3 className="card-title text-lg font-semibold mb-6">Profile Picture</h3>
              
              <div className="relative group">
                <div className="avatar">
                  <div className="w-36 h-36 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-all duration-300 group-hover:ring-offset-4">
                    {profile.profilePic ? (
                      <img
                        src={profile.profilePic}
                        alt="Profile"
                        onError={handleImgError}
                        className="object-cover w-full h-full rounded-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-base-200 rounded-full">
                        <User className="w-16 h-16 text-base-content/50" />
                      </div>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRandomAvatar}
                    className="btn btn-circle btn-sm btn-primary absolute bottom-0 right-0 shadow-md"
                    title="Generate random avatar"
                  >
                    <ShuffleIcon className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-xl text-base-content">
                  {profile.fullName || "Your Name"}
                </h4>
                <p className="text-base-content/70 text-sm">{profile.email}</p>
                {profile.location && (
                  <div className="flex items-center justify-center gap-2 text-sm text-base-content/60">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card bg-base-100 shadow-lg rounded-xl overflow-hidden">
            <div className="card-body p-6">
              <h3 className="card-title text-lg font-semibold mb-6">Personal Information</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </span>
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      className="input input-bordered w-full transition-all duration-200"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </span>
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="email"
                      className="input input-bordered w-full transition-all duration-200"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled
                      placeholder="your@email.com"
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/50">Email cannot be changed</span>
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </span>
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="tel"
                      className="input input-bordered w-full transition-all duration-200"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </span>
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      className="input input-bordered w-full transition-all duration-200"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Native Language
                      </span>
                    </label>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      name="nativeLanguage"
                      className="select select-bordered w-full transition-all duration-200"
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
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Date of Birth
                      </span>
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="date"
                      className="input input-bordered w-full transition-all duration-200"
                      name="dateOfBirth"
                      value={profile.dateOfBirth}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Bio Section */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Bio</span>
                    <span className="label-text-alt">{profile.bio.length}/500</span>
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    name="bio"
                    className="textarea textarea-bordered h-28 w-full transition-all duration-200"
                    value={profile.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                </div>

                {/* Skills Section */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Skills & Expertise
                    </span>
                  </label>
                  <div className="min-h-[80px] p-4 border border-base-300 rounded-lg bg-base-50">
                    <AnimatePresence>
                      {profile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="badge badge-primary badge-lg gap-2"
                            >
                              {skill}
                              {isEditing && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="btn btn-ghost btn-xs btn-circle"
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
                          className="text-center text-base-content/50 py-4"
                        >
                          <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No skills added yet</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {isEditing && (
                    <div className="mt-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setShowSkillModal(true)}
                        className="btn btn-outline btn-sm gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Skill
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Mobile Save Button */}
                {isEditing && (
                  <div className="lg:hidden pt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isPending}
                      className="btn btn-primary w-full gap-2 shadow-md"
                    >
                      {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-sm" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Skill Selector Modal */}
      <AnimatePresence>
        {showSkillModal && (
          <SkillSelector
            selectedSkills={profile.skills}
            onAddSkill={(skill) => {
              const updated = [...new Set([...profile.skills, skill])];
              setProfile((prev) => ({ ...prev, skills: updated }));
              updateProfileMutation({ ...profile, skills: updated });
              setShowSkillModal(false);
            }}
            onClose={() => setShowSkillModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProfilePage;