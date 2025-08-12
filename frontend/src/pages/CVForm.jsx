
"use client"

import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query" 
import { generateCV, updateCV } from "../lib/api"
import useAuthUser from "../hooks/useAuthUser"
import { motion } from "framer-motion"
import { PlusCircle, Trash2 } from "lucide-react"
import { X } from "lucide-react"
import toast from "react-hot-toast" 

const CVForm = ({ initialData = null, onClose, onSuccess }) => {
  const { authUser, isLoading: authLoading } = useAuthUser()
  const queryClient = useQueryClient() 

  const [form, setForm] = useState({
    userId: authUser?.userId || authUser?._id || "",
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    skills: [""],
    experience: [{ company: "", role: "", duration: "", description: "" }],
    education: [{ institution: "", degree: "", year: "" }],
    certifications: [{ name: "", issuer: "", year: "" }],
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        _id: initialData._id,
        ...initialData,
        userId: initialData.userId || authUser?.userId || authUser?._id || "",
      })
    } else if (authUser && !form.userId) {
      
      setForm((prevForm) => ({
        ...prevForm,
        userId: authUser.userId || authUser._id,
      }))
    }
  }, [initialData, authUser, form.userId])

  const handleChange = (section, index, key, value) => {
    if (Array.isArray(form[section])) {
      const updated = [...form[section]]
      updated[index][key] = value
      setForm({ ...form, [section]: updated })
    } else {
      setForm({ ...form, [key]: value })
    }
  }

  const addEntry = (section) => {
    setForm({
      ...form,
      [section]: [
        ...form[section],
        section === "skills"
          ? ""
          : section === "experience"
            ? { company: "", role: "", duration: "", description: "" }
            : section === "education"
              ? { institution: "", degree: "", year: "" }
              : { name: "", issuer: "", year: "" },
      ],
    })
  }

  const removeEntry = (section, index) => {
    if (form[section].length > 1) {
      setForm({
        ...form,
        [section]: form[section].filter((_, i) => i !== index),
      })
    }
  }

  const generateMutation = useMutation({
    mutationFn: generateCV,
    onSuccess: (data) => {
      
      queryClient.setQueryData(["cv", authUser?.userId || authUser?._id], (oldData) => {
        const newCV = data 
        if (oldData) {
        
          return [...oldData, newCV]
        }
      
        return [newCV]
      })
      toast.success("CV generated successfully!", {
        duration: 3000,
        position: "top-right",
        style: { background: "hsl(var(--su))", color: "hsl(var(--suc))", borderRadius: "8px", padding: "12px" },
      })
      onSuccess?.()
      onClose?.()
    },
    onError: (error) => {
      console.error("Generate CV Error:", error.response?.data || error.message)
      toast.error(`Failed to generate CV: ${error.response?.data?.message || "Please try again."}`, {
        duration: 3000,
        position: "top-right",
        style: { background: "hsl(var(--er))", color: "hsl(var(--erc))", borderRadius: "8px", padding: "12px" },
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateCV,
    onSuccess: (data) => {
      
      queryClient.setQueryData(["cv", authUser?.userId || authUser?._id], (oldData) => {
        if (oldData) {
          return oldData.map((cv) => (cv._id === data._id ? data : cv))
        }
        return oldData
      })
      toast.success("CV updated successfully!", {
        duration: 3000,
        position: "top-right",
        style: { background: "hsl(var(--su))", color: "hsl(var(--suc))", borderRadius: "8px", padding: "12px" },
      })
      onSuccess?.()
      onClose?.()
    },
    onError: (error) => {
      console.error("Update CV Error:", error.response?.data || error.message)
      toast.error(`Failed to update CV: ${error.response?.data?.message || "Please try again."}`, {
        duration: 3000,
        position: "top-right",
        style: { background: "hsl(var(--er))", color: "hsl(var(--erc))", borderRadius: "8px", padding: "12px" },
      })
    },
  })

  const handleSubmit = () => {
    const mutation = initialData ? updateMutation : generateMutation
    mutation.mutate(form)
  }

  if (authLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative card bg-base-100 shadow-2xl max-w-5xl mx-auto max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10"
      >
        {/* Header */}
        <div className="sticky top-0 z-30 bg-base-100 p-6 border-b border-white/10 flex items-center justify-between rounded-t-2xl">
          <div>
            <h1 className="text-2xl font-semibold">{initialData ? "Edit CV" : "Create Professional CV"}</h1>
            <p className="text-sm text-base-content/60">AI will help you create a standout CV</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-primary text-sm px-3 py-1">AI Powered</span>
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost hover:bg-base-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="card-body p-8">
          {/* --- Personal Info --- */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <span className="badge badge-outline">Required</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "email", "phone", "linkedin"].map((field) => (
                <div key={field} className="form-control">
                  <label className="label font-medium">
                    <span className="label-text">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                  </label>
                  <input
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    placeholder={
                      field === "email"
                        ? "john@example.com"
                        : field === "phone"
                          ? "+1 (555) 123-4567"
                          : field === "linkedin"
                            ? "https://linkedin.com/in/username"
                            : "John Doe"
                    }
                    className="input input-bordered"
                    value={form[field]}
                    onChange={(e) => handleChange(null, null, field, e.target.value)}
                    required={field !== "linkedin"}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* --- Skills --- */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Technical Skills</h2>
                <span className="badge badge-secondary">Highlight your expertise</span>
              </div>
              <button onClick={() => addEntry("skills")} className="btn btn-outline btn-sm gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Skill
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {form.skills.map((skill, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="input input-bordered flex-1"
                    type="text"
                    value={skill}
                    onChange={(e) => {
                      const updated = [...form.skills]
                      updated[i] = e.target.value
                      setForm({ ...form, skills: updated })
                    }}
                    placeholder={`e.g., React, Node.js, Python`}
                  />
                  {form.skills.length > 1 && (
                    <button onClick={() => removeEntry("skills", i)} className="btn btn-ghost btn-sm text-error">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* --- Experience --- */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Professional Experience</h2>
                <span className="badge badge-accent">Career highlights</span>
              </div>
              <button onClick={() => addEntry("experience")} className="btn btn-outline btn-sm gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Experience
              </button>
            </div>
            {form.experience.map((exp, i) => (
              <div key={i} className="card bg-base-200 mb-6 rounded-xl shadow-sm">
                <div className="card-body p-6 relative">
                  {form.experience.length > 1 && (
                    <button
                      onClick={() => removeEntry("experience", i)}
                      className="btn btn-ghost btn-sm btn-circle absolute top-3 right-3 text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      className="input input-bordered"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleChange("experience", i, "company", e.target.value)}
                    />
                    <input
                      className="input input-bordered"
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) => handleChange("experience", i, "role", e.target.value)}
                    />
                    <input
                      className="input input-bordered"
                      placeholder="Duration"
                      value={exp.duration}
                      onChange={(e) => handleChange("experience", i, "duration", e.target.value)}
                    />
                  </div>
                  <textarea
                    className="textarea textarea-bordered"
                    rows={4}
                    placeholder="Key achievements & responsibilities..."
                    value={exp.description}
                    onChange={(e) => handleChange("experience", i, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* --- Education --- */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Education</h2>
                <span className="badge badge-info">Academic background</span>
              </div>
              <button onClick={() => addEntry("education")} className="btn btn-outline btn-sm gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Education
              </button>
            </div>
            {form.education.map((edu, i) => (
              <div key={i} className="card bg-base-200 mb-6 rounded-xl">
                <div className="card-body p-6 relative">
                  {form.education.length > 1 && (
                    <button
                      onClick={() => removeEntry("education", i)}
                      className="btn btn-ghost btn-sm btn-circle absolute top-3 right-3 text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      className="input input-bordered"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleChange("education", i, "institution", e.target.value)}
                    />
                    <input
                      className="input input-bordered"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => handleChange("education", i, "degree", e.target.value)}
                    />
                    <input
                      className="input input-bordered"
                      placeholder="Year"
                      value={edu.year}
                      onChange={(e) => handleChange("education", i, "year", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* --- Certifications --- */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Certifications</h2>
                <span className="badge badge-success">Professional credentials</span>
              </div>
              <button onClick={() => addEntry("certifications")} className="btn btn-outline btn-sm gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Certification
              </button>
            </div>
            {form.certifications.map((cert, i) => (
              <div key={i} className="card bg-base-200 mb-6 rounded-xl">
                <div className="card-body p-6 relative">
                  {form.certifications.length > 1 && (
                    <button
                      onClick={() => removeEntry("certifications", i)}
                      className="btn btn-ghost btn-sm btn-circle absolute top-3 right-3 text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      className="input input-bordered"
                      placeholder="Certification Name"
                      value={cert.name}
                      onChange={(e) => handleChange("certifications", i, "name", e.target.value)}
                    />
                    <input
                      className="input input-bordered"
                      placeholder="Issuing Organization"
                      value={cert.issuer}
                      onChange={(e) => handleChange("certifications", i, "issuer", e.target.value)}
                    />
                    <input
                      className="input input-bordered"
                      placeholder="Year"
                      value={cert.year}
                      onChange={(e) => handleChange("certifications", i, "year", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* --- Footer Buttons --- */}
          <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
            <button onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={generateMutation.isPending || updateMutation.isPending}
              className="btn btn-primary gap-2"
            >
              {generateMutation.isPending || updateMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  AI is crafting your CV...
                </>
              ) : (
                <>{initialData ? "Update CV" : "Generate Professional CV"}</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default CVForm
