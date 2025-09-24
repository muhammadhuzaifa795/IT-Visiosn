import { useQuery } from "@tanstack/react-query"
import {
  getAllUsers,
  getAllPostsAdmin,
  getAllRoadmaps,
  getAllCvs,
  getAllInterviews,
  getAllTickets,
} from "../lib/api"

// 🔹 Users
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
  })
}

// 🔹 Posts
export const useAdminPosts = () => {
  return useQuery({
    queryKey: ["admin-posts"],
    queryFn: getAllPostsAdmin,
  })
}

// 🔹 Roadmaps
export const useAdminRoadmaps = () => {
  return useQuery({
    queryKey: ["admin-roadmaps"],
    queryFn: getAllRoadmaps,
  })
}

// 🔹 CVs
export const useAdminCvs = () => {
  return useQuery({
    queryKey: ["admin-cvs"],
    queryFn: getAllCvs,
  })
}

// 🔹 Interviews
export const useAdminInterviews = () => {
  return useQuery({
    queryKey: ["admin-interviews"],
    queryFn: getAllInterviews,
  })
}

// 🔹 Tickets
export const useAdminTickets = () => {
  return useQuery({
    queryKey: ["admin-tickets"],
    queryFn: getAllTickets,
  })
}
