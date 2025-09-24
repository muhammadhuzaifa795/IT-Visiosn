"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Upload, FileText, ImageIcon, VideoIcon } from "lucide-react"
import useTickets from "../hooks/useTicket"

const UploadTicket = () => {
  const [ticketData, setTicketData] = useState({
    title: "",
    description: "",
    attachments: null,
  })
  const [showLoader, setShowLoader] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const { createTicket, isCreating } = useTickets()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "attachments") {
      const file = files[0]
      if (file && file.size > 20 * 1024 * 1024) {
        toast.error("File size exceeds 20MB limit!", {
          style: {
            background: "hsl(var(--er))",
            color: "hsl(var(--erc))",
          },
        })
        return
      }
      setTicketData({ ...ticketData, attachments: file })
    } else {
      setTicketData({ ...ticketData, [name]: value })
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size exceeds 20MB limit!", {
          style: {
            background: "hsl(var(--er))",
            color: "hsl(var(--erc))",
          },
        })
        return
      }
      setTicketData({ ...ticketData, attachments: file })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowLoader(true)

    const formData = new FormData()
    formData.append("title", ticketData.title)
    formData.append("description", ticketData.description)
    if (ticketData.attachments) {
      formData.append("attachments", ticketData.attachments)
    }

    createTicket(formData, {
      onSuccess: () => {
        toast.success("Ticket created successfully!", {
          style: {
            background: "hsl(var(--su))",
            color: "hsl(var(--suc))",
          },
        })
        navigate("/tickets")
      },
      onError: (err) => {
        console.error("Error creating ticket:", err)
        toast.error(err?.response?.data?.message || "Failed to create ticket", {
          style: {
            background: "hsl(var(--er))",
            color: "hsl(var(--erc))",
          },
        })
      },
    })

    setTimeout(() => setShowLoader(false), 3000)
  }

  const getFileIcon = (file) => {
    if (!file) return FileText
    const type = file.type
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return VideoIcon
    return FileText
  }

  const FileIcon = getFileIcon(ticketData.attachments)

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/20 to-base-300/10 py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20"
          >
            <Upload className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
            Create New Ticket
          </h1>
          <p className="text-lg text-base-content/70 max-w-lg mx-auto">
            Submit your issue or request to our support team
          </p>
        </div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-base-100/90 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-base-300/30"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-xl font-semibold text-base-content">
                <FileText className="w-6 h-6 text-primary" />
                Ticket Title
              </label>
              <input
                type="text"
                name="title"
                value={ticketData.title}
                onChange={handleChange}
                className="w-full border-2 border-base-300 rounded-xl px-5 py-3 bg-base-100/50 backdrop-blur-sm outline-none transition-all duration-300 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/10 placeholder:text-base-content/40"
                placeholder="Enter a concise ticket title..."
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-xl font-semibold text-base-content">
                <FileText className="w-6 h-6 text-secondary" />
                Description
              </label>
              <textarea
                name="description"
                value={ticketData.description}
                onChange={handleChange}
                rows="6"
                className="w-full border-2 border-base-300 rounded-xl px-5 py-3 bg-base-100/50 backdrop-blur-sm outline-none resize-none transition-all duration-300 text-base leading-relaxed focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:shadow-lg focus:shadow-secondary/10 placeholder:text-base-content/40"
                placeholder="Describe your issue or request in detail..."
                required
              />
            </div>

            {/* Attachment */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-xl font-semibold text-base-content">
                <Upload className="w-6 h-6 text-accent" />
                Attachment
                <span className="text-sm font-normal text-base-content/60">(Optional, max 20MB)</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-10 transition-all duration-300 ${
                  dragActive
                    ? "border-accent bg-accent/20 scale-102"
                    : ticketData.attachments
                      ? "border-success bg-success/10"
                      : "border-base-300 hover:border-accent hover:bg-accent/10"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  name="attachments"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,video/*"
                />
                <div className="text-center">
                  <motion.div
                    animate={{ y: dragActive ? -5 : 0 }}
                    className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      ticketData.attachments ? "bg-success/20" : "bg-accent/20"
                    }`}
                  >
                    <FileIcon className={`w-10 h-10 ${ticketData.attachments ? "text-success" : "text-accent"}`} />
                  </motion.div>
                  {ticketData.attachments ? (
                    <div>
                      <p className="text-success font-semibold mb-2">File Selected</p>
                      <p className="text-base-content/80 text-base">{ticketData.attachments.name}</p>
                      <p className="text-base-content/50 text-sm mt-2">
                        {(ticketData.attachments.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-base-content font-semibold mb-3">
                        {dragActive ? "Drop your file here" : "Drag & drop or click to upload"}
                      </p>
                      <p className="text-base-content/60 text-sm">Supports images and videos (max 20MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isCreating || showLoader}
              whileHover={{ scale: isCreating || showLoader ? 1 : 1.03 }}
              whileTap={{ scale: isCreating || showLoader ? 1 : 0.97 }}
              className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isCreating || showLoader
                  ? "bg-base-300 text-base-content/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-secondary text-white shadow-xl hover:shadow-2xl hover:shadow-primary/30"
              }`}
            >
              <AnimatePresence mode="wait">
                {isCreating || showLoader ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <Loader2 className="animate-spin w-6 h-6" />
                    Creating ticket...
                  </motion.div>
                ) : (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Create Ticket
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default UploadTicket