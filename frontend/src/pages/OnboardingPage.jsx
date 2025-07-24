// import { useState } from "react";
// import useAuthUser from "../hooks/useAuthUser";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { completeOnboarding } from "../lib/api";
// import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";
// import { LANGUAGES } from "../constants";

// const OnboardingPage = () => {
//   const { authUser } = useAuthUser();
//   const queryClient = useQueryClient();

//   const [formState, setFormState] = useState({
//     fullName: authUser?.fullName || "",
//     bio: authUser?.bio || "",
//     nativeLanguage: authUser?.nativeLanguage || "",
//     location: authUser?.location || "",
//     profilePic: authUser?.profilePic || "",
//   });

//   const { mutate: onboardingMutation, isPending } = useMutation({
//     mutationFn: completeOnboarding,
//     onSuccess: () => {
//       toast.success("Profile onboarded successfully");
//       queryClient.invalidateQueries({ queryKey: ["authUser"] });
//     },

//     onError: (error) => {
//       toast.error(error.response.data.message);
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     onboardingMutation(formState);
//   };

//   const handleRandomAvatar = () => {
//     const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
//     // const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

// const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
// const fallbackAvatar = `https://ui-avatars.com/api/?name=User${idx}`;

// const avatarUrl = randomAvatar || fallbackAvatar;


//     setFormState({ ...formState, profilePic: randomAvatar });
//     toast.success("Random profile picture generated!");
//   };

//   return (
//     <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
//       <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
//         <div className="card-body p-6 sm:p-8">
//           <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* PROFILE PIC CONTAINER */}
//             <div className="flex flex-col items-center justify-center space-y-4">
//               {/* IMAGE PREVIEW */}
//               <div className="size-32 rounded-full bg-base-300 overflow-hidden">
//                 {formState.profilePic ? (
//                   <img
//                     src={formState.profilePic}
//                     alt="Profile Preview"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <CameraIcon className="size-12 text-base-content opacity-40" />
//                   </div>
//                 )}
//               </div>

//               {/* Generate Random Avatar BTN */}
//               <div className="flex items-center gap-2">
//                 <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
//                   <ShuffleIcon className="size-4 mr-2" />
//                   Generate Random Avatar
//                 </button>
//               </div>
//             </div>

//             {/* FULL NAME */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Full Name</span>
//               </label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formState.fullName}
//                 onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
//                 className="input input-bordered w-full"
//                 placeholder="Your full name"
//               />
//             </div>

//             {/* BIO */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Bio</span>
//               </label>
//               <textarea
//                 name="bio"
//                 value={formState.bio}
//                 onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
//                 className="textarea textarea-bordered h-24"
//                 placeholder="Tell others about yourself and your language learning goals"
//               />
//             </div>

//             {/* LANGUAGES */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* NATIVE LANGUAGE */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Native Language</span>
//                 </label>
//                 <select
//                   name="nativeLanguage"
//                   value={formState.nativeLanguage}
//                   onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
//                   className="select select-bordered w-full"
//                 >
//                   <option value="">Select your native language</option>
//                   {LANGUAGES.map((lang) => (
//                     <option key={`native-${lang}`} value={lang.toLowerCase()}>
//                       {lang}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* LEARNING LANGUAGE */}
             
//             </div>

//             {/* LOCATION */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Location</span>
//               </label>
//               <div className="relative">
//                 <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
//                 <input
//                   type="text"
//                   name="location"
//                   value={formState.location}
//                   onChange={(e) => setFormState({ ...formState, location: e.target.value })}
//                   className="input input-bordered w-full pl-10"
//                   placeholder="City, Country"
//                 />
//               </div>
//             </div>

//             {/* SUBMIT BUTTON */}

//             <button className="btn btn-primary w-full" disabled={isPending} type="submit">
//               {!isPending ? (
//                 <>
//                   <ShipWheelIcon className="size-5 mr-2" />
//                   Complete Onboarding
//                 </>
//               ) : (
//                 <>
//                   <LoaderIcon className="animate-spin size-5 mr-2" />
//                   Onboarding...
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default OnboardingPage;






import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, CameraIcon } from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

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

  // fallback avatar image (ensure this file is in your public folder)
  const fallbackAvatar = "/fallback-avatar.png";

  // Handle image load error and replace with fallback avatar once
  const handleImgError = (e) => {
    if (e.currentTarget.src !== fallbackAvatar) {
      e.currentTarget.src = fallbackAvatar;
    }
  };

  // Generate random avatar from external service and update state
  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState((prev) => ({ ...prev, profilePic: randomAvatar }));
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="w-32 h-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                    onError={handleImgError}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="w-12 h-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* Generate Random Avatar Button */}
              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-accent flex items-center gap-2"
              >
                <ShuffleIcon className="w-4 h-4" />
                Generate Random Avatar
              </button>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
                required
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* NATIVE LANGUAGE */}
            <div className="form-control md:w-1/2">
              <label className="label">
                <span className="label-text">Native Language</span>
              </label>
              <select
                name="nativeLanguage"
                value={formState.nativeLanguage}
                onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                className="select select-bordered w-full"
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

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="w-5 h-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin w-5 h-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;



