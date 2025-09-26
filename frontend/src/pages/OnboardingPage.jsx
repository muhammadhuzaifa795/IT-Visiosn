
"use client"

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { completeOnboarding } from "../lib/api";
import { ShipWheelIcon, ArrowLeft, CameraIcon, MapPinIcon, LoaderIcon, TagIcon } from "lucide-react";
import toast from "react-hot-toast";
import SkillSelector from "../components/SkillSelector";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    language: authUser?.language || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
    skills: authUser?.skills || [],
  });
  const [showSkillSelector, setShowSkillSelector] = useState(false);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error during onboarding");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleImgError = (e) => {
    const fallbackAvatar = "/fallback-avatar.png";
    if (e.currentTarget.src !== fallbackAvatar) {
      e.currentTarget.src = fallbackAvatar;
    }
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState((prev) => ({ ...prev, profilePic: randomAvatar }));
    toast.success("Random profile picture generated!");
  };

  const handleAddSkill = (skill) => {
    setFormState((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
    setShowSkillSelector(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormState((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-base-200 via-base-100 to-base-200" data-theme="forest">
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-0 bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-primary/10">
          {/* Left Panel - Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
                  <ShipWheelIcon className="size-8 text-base-100" />
                </div>
                <span className="text-4xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  CodeZynx
                </span>
              </div>
              <Link to="/dashboard" className="btn btn-ghost btn-sm hover:scale-105 transition-transform">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>

            <div className="space-y-6 max-w-md mx-auto w-full">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-base-content">Complete Your Profile</h1>
                <p className="text-base-content/70 text-lg">
                  Set up your developer profile to join the CodeZynx community.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-base-300 overflow-hidden">
                    {formState.profilePic ? (
                      <img
                        src={formState.profilePic}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                        onError={handleImgError}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <CameraIcon className="w-10 h-10 text-base-content opacity-40" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="btn btn-accent btn-sm flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <CameraIcon className="w-4 h-4" />
                    Generate Random Avatar
                  </button>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content/80 font-medium">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formState.fullName}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    className="input input-bordered w-full pl-4 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content/80 font-medium">Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formState.bio}
                    onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                    className="textarea textarea-bordered h-24 w-full p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Tell others about yourself and your coding goals"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content/80 font-medium">Skills</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formState.skills.map((skill) => (
                      <div
                        key={skill}
                        className="badge badge-primary badge-md flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 text-primary-content hover:text-error"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSkillSelector(true)}
                    className="btn btn-outline btn-sm flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <TagIcon className="w-4 h-4" />
                    Add Skills
                  </button>
                </div>

                <div className="form-control md:w-1/2">
                  <label className="label">
                    <span className="label-text text-base-content/80 font-medium">Native Language</span>
                  </label>
                  <select
                    name="language"
                    value={formState.language}
                    onChange={(e) => setFormState({ ...formState, language: e.target.value })}
                    className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content/80 font-medium">Location</span>
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-base-content opacity-70" />
                    <input
                      type="text"
                      name="location"
                      value={formState.location}
                      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                      className="input input-bordered w-full pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <button
                  className="btn btn-primary w-full py-3 text-base font-semibold hover:scale-[1.02] transition-all duration-200 shadow-lg"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? (
                    <>
                      <LoaderIcon className="animate-spin w-5 h-5 mr-2" />
                      Onboarding...
                    </>
                  ) : (
                    <>
                      <ShipWheelIcon className="w-5 h-5 mr-2" />
                      Complete Onboarding
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel - Hero Section */}
          <div className="hidden lg:flex bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 items-center justify-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%227%22 cy=%227%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
            </div>
            <div className="relative z-10 max-w-md text-center space-y-8">
              <div className="relative">
                <div className="w-80 h-80 mx-auto rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="/i.png"
                    alt="Developer collaboration illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary rounded-full animate-bounce delay-300"></div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-base-content">
                  Connect. Code. <span className="text-primary">Collaborate.</span>
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

      {showSkillSelector && (
        <SkillSelector
          selectedSkills={formState.skills}
          onAddSkill={handleAddSkill}
          onClose={() => setShowSkillSelector(false)}
        />
      )}
    </div>
  );
};

export default OnboardingPage;
