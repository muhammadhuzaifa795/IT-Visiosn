import { Await } from "react-router";
import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};



export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await axiosInstance.put("/auth/update-profile", profileData);
  return response.data;
};


export const addFace = (formData) =>
  axiosInstance.post('/face-auth/add-face', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const loginWithFace = (formData) =>
  axiosInstance.post('/face-auth/login-with-face', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const sendOTP = async (phone) => {
  const response = await axiosInstance.post("/auth/send-otp", phone);
  return response.data;
};

export const resendOTP = async (email) => {
  const response = await axiosInstance.post("/auth/resend-otp", { email });
  return response.data;
};

export const verifyOTP = async (data, otp) => {
  const response = await axiosInstance.post("/auth/verify-otp", { ...data, otp });
  return response.data;
};

export const resetPassword = async (data, newPassword) => {
  const response = await axiosInstance.post("/auth/reset-password", { ...data, newPassword });
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

//post

export async function getAllPosts() {
  const response = await axiosInstance.get('/post/get-post')
  return response.data;
}

export async function createPost(postData) {
  const response = await axiosInstance.post('/post/create-post', postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data
}
export async function updatePost(postId, formData) {
  const response = await axiosInstance.put(`/post/update-post/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function deletePost(postId) {
  const response = await axiosInstance.delete(`/post/delete-post/${postId}`);
  return response.data;
}




export async function togglePostLike(postId) {
  return await axiosInstance.post(`/post/${postId}/like`).then(res => res.data);
}


export async function aiPrompt(prompt) {
  const  response = await axiosInstance.post('/ai/get-response/',{prompt});
  return response.data;
}



export const generateCV = async (cvData) => {
  const res = await axiosInstance.post("/cv/generate", cvData);
  return res.data.cv; // Return the CV object only
};

export const getCV = async (userId) => {
  const res = await axiosInstance.get(`/cv/get-cv/${userId}`);
  return res.data;
};


export const updateCV = async ({ _id, updatedData }) => {
  const response = await axiosInstance.put(`/cv/update/${_id}`, updatedData);
  return response.data;
};



export const deleteCV = async (cvId) => {
  const res = await axiosInstance.delete(`/cv/delete/${cvId}`);
  return res.data;
};


export async function addComment({postId, commentData}) {
  const response = await axiosInstance.post(`/comment/add-comments/${postId}`, commentData)
  return response.data
}

export async function getCommentsByPost(postId) {
  const response = await axiosInstance.get(`/comment/get-comments/${postId}`);
  return response.data;
}

export const toggleCommentLike = async ({postId, commentid }) => {
  const response = await axiosInstance.put(`/comment/like-comment/${postId}/${commentid}`);
  return response.data;
};

export const createRoadmap = async (roadmapData) => {
  const response = await axiosInstance.post('/roadmap/create-roadmap', roadmapData);
  return response.data;
}

export const getRoadmap = async (userId) => {
  const response = await axiosInstance.get(`/roadmap/get-roadmap/${userId}`);
  return response.data;
};




export const createInterview = async (body) => {
  try {
    const response = await axiosInstance.post("/interview", body);
    console.log("API Response:", response.data); // Log for debugging
    return response.data;
  } catch (error) {
    console.error("Error creating interview:", error);
    throw error;
  }
};

export const getInterview = async (userId) => {
  const response = await axiosInstance.get(`/interview/user/${userId}`);
  return response.data;
};

export const startInterview = async (interviewId) => {
  const response = await axiosInstance.patch(`/interview/${interviewId}/start`);
  return response.data;
};

export const endInterview = async (interviewId) => {
  const response = await axiosInstance.patch(`/interview/${interviewId}/end`);
  return response.data;
};

// Fetch the next question in an interview
export const nextQuestion = async (payload) => {
  const response = await axiosInstance.post('/interview/next-question', payload);
  return response.data;
};

// Get interview result
export const getResult = async (interviewId) => {
  const response = await axiosInstance.get(`/result/${interviewId}`);
  return response.data;
};