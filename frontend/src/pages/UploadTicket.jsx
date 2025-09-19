"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Upload, FileText, ImageIcon, VideoIcon  } from "lucide-react"
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
      setTicketData({ ...ticketData, attachments: files[0] })
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
      setTicketData({ ...ticketData, attachments: e.dataTransfer.files[0] })
    }
  }

const handleSubmit = (e) => {
  e.preventDefault();
  setShowLoader(true);

  const formData = new FormData();
  formData.append("title", ticketData.title);
  formData.append("description", ticketData.description);

  if (ticketData.attachments) {
    formData.append("attachments", ticketData.attachments); // actual file
  }

  createTicket(formData, {
    onSuccess: () => {
      toast.success("Ticket created successfully!");
      navigate("/tickets");
    },
    onError: (err) => {
      console.error("Error creating ticket:", err);
      toast.error(err?.response?.data?.message || "Failed to create ticket");
    },
  });

  setTimeout(() => setShowLoader(false), 3000);
};

  const getFileIcon = (file) => {
    if (!file) return FileText
    const type = file.type
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return VideoIcon
    return FileText
  }

  const FileIcon = getFileIcon(ticketData.attachments)

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-base-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Create New Ticket
          </h1>
          <p className="text-base-content/70">Submit your issue or request</p>
        </div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-base-100/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-base-300/50"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-lg font-semibold text-base-content">
                <FileText className="w-5 h-5 text-primary" />
                Ticket Title
              </label>
              <input
                type="text"
                name="title"
                value={ticketData.title}
                onChange={handleChange}
                className="w-full border-2 rounded-2xl px-6 py-4 bg-base-100/50 backdrop-blur-sm outline-none transition-all duration-300 text-lg border-base-300 focus:border-primary focus:shadow-lg focus:shadow-primary/10"
                placeholder="Enter ticket title..."
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-lg font-semibold text-base-content">
                <FileText className="w-5 h-5 text-secondary" />
                Description
              </label>
              <textarea
                name="description"
                value={ticketData.description}
                onChange={handleChange}
                rows="6"
                className="w-full border-2 rounded-2xl px-6 py-4 bg-base-100/50 backdrop-blur-sm outline-none resize-none transition-all duration-300 border-base-300 focus:border-secondary focus:shadow-lg focus:shadow-secondary/10"
                placeholder="Describe your issue or request..."
                required
              ></textarea>
            </div>

            {/* Attachment */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-lg font-semibold text-base-content">
                <Upload className="w-5 h-5 text-accent" />
                Attachment
                <span className="text-sm font-normal text-base-content/60">(Optional)</span>
              </label>

              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                  dragActive
                    ? "border-accent bg-accent/10 scale-105"
                    : ticketData.attachments
                      ? "border-success bg-success/10"
                      : "border-base-300 hover:border-accent hover:bg-accent/5"
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
                  accept="image/*,video/*,.pdf,.doc,.docx"
                />

                <div className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      ticketData.attachments ? "bg-success/20" : "bg-accent/20"
                    }`}
                  >
                    <FileIcon
                      className={`w-8 h-8 ${ticketData.attachments ? "text-success" : "text-accent"}`}
                    />
                  </div>

                  {ticketData.attachments ? (
                    <div>
                      <p className="text-success font-semibold mb-1">File Selected</p>
                      <p className="text-base-content/70 text-sm">{ticketData.attachments.name}</p>
                      <p className="text-base-content/50 text-xs mt-1">
                        {(ticketData.attachments.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-base-content font-semibold mb-2">
                        {dragActive ? "Drop your file here" : "Drag & drop or click to upload"}
                      </p>
                      <p className="text-base-content/60 text-sm">
                        Support for images, videos, and documents
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isCreating || showLoader}
              whileHover={{ scale: isCreating || showLoader ? 1 : 1.02 }}
              whileTap={{ scale: isCreating || showLoader ? 1 : 0.98 }}
              className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                isCreating || showLoader
                  ? "bg-base-300 text-base-content/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl hover:shadow-primary/20"
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
                    Uploading ticket...
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
