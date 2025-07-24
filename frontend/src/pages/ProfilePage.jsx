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
  Camera,
  Save,
  Trash2,
  Plus
} from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import SkillSelector from "../components/SkillSelector";
import { LANGUAGES } from "../constants";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

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
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
   
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Edit3Icon className="w-8 h-8 text-primary" />
              Profile Settings
            </h1>
            <p className="text-base-content/70 mt-2">
              Manage your personal information and preferences
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary gap-2"
              >
                <Edit3Icon className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="btn btn-primary gap-2"
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body items-center text-center">
              <h3 className="card-title mb-4">Profile Picture</h3>
              
              <div className="relative">
                <div className="avatar">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {profile.profilePic ? (
                      <img
                        src={profile.profilePic}
                        alt="Profile"
                        onError={handleImgError}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-base-200">
                        <User className="w-12 h-12 text-base-content/50" />
                      </div>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={handleRandomAvatar}
                    className="btn btn-circle btn-sm btn-primary absolute -bottom-2 -right-2"
                    title="Generate random avatar"
                  >
                    <ShuffleIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-lg">{profile.fullName || "Your Name"}</h4>
                <p className="text-base-content/70">{profile.email}</p>
                {profile.location && (
                  <div className="flex items-center justify-center gap-1 text-sm text-base-content/60">
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
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-6">Personal Information</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
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
                    <input
                      type="email"
                      className="input input-bordered"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled
                      placeholder="your@email.com"
                    />
                    <label className="label">
                      <span className="label-text-alt">Email cannot be changed</span>
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered"
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
                    <input
                      type="text"
                      className="input input-bordered"
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
                    <select
                      name="nativeLanguage"
                      className="select select-bordered"
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
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Date of Birth
                      </span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered"
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
                  <textarea
                    name="bio"
                    className="textarea textarea-bordered h-24"
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
                  
                  <div className="min-h-[60px] p-4 border border-base-300 rounded-lg bg-base-50">
                    {profile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, i) => (
                          <div key={i} className="badge badge-primary gap-2">
                            {skill}
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="btn btn-ghost btn-xs btn-circle"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-base-content/50 py-4">
                        <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No skills added yet</p>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setShowSkillModal(true)}
                        className="btn btn-outline btn-sm gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Skill
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Save Button */}
                {isEditing && (
                  <div className="lg:hidden pt-4">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="btn btn-primary w-full gap-2"
                    >
                      {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-xs" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Skill Selector Modal */}
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
    </div>
  );
};

export default ProfilePage;