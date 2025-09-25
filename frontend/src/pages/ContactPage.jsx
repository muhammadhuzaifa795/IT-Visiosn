// components/UserContacts.js
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Loader2, Send, MessageCircle, Phone, Mail, User, Trash2 } from "lucide-react";
import useContacts from "../hooks/useContact";

const UserContacts = ({ userId }) => {
  const { userContacts, createContactMutation, isCreating, createError, deleteContactMutation, isDeleting, deleteError } = useContacts(userId);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (formData.phone && !/^\+?[\d\s-]{7,}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill all required fields correctly", {
        style: { background: "hsl(var(--er))", color: "hsl(var(--erc))" },
      });
      return;
    }

    createContactMutation(
      { ...formData, userId },
      {
        onSuccess: () => {
          toast.success("✅ Contact submitted successfully!", {
            style: { background: "hsl(var(--su))", color: "hsl(var(--suc))" },
          });
          setFormData({ name: "", email: "", phone: "", message: "" });
          setErrors({});
        },
      }
    );
  };

  const handleDelete = (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      deleteContactMutation(contactId);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-14"
      >
        {/* Contact Form */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-primary" />
            Contact Us
          </h2>
          {createError && (
            <p className="text-error text-sm mb-4">
              {createError?.response?.data?.error || "Failed to submit contact"}
            </p>
          )}
          {deleteError && (
            <p className="text-error text-sm mb-4">
              {deleteError?.response?.data?.error || "Failed to delete contact"}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 font-semibold mb-2">
                <User className="w-5 h-5 text-secondary" /> Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border-2 ${
                  errors.name ? "border-error" : "border-base-300"
                } focus:border-primary outline-none bg-base-200`}
                required
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-error text-sm mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 font-semibold mb-2">
                <Mail className="w-5 h-5 text-accent" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border-2 ${
                  errors.email ? "border-error" : "border-base-300"
                } focus:border-primary outline-none bg-base-200`}
                required
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-error text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 font-semibold mb-2">
                <Phone className="w-5 h-5 text-accent" /> Phone (Optional)
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border-2 ${
                  errors.phone ? "border-error" : "border-base-300"
                } focus:border-primary outline-none bg-base-200`}
              />
              {errors.phone && (
                <p id="phone-error" className="text-error text-sm mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 font-semibold mb-2">
                <MessageCircle className="w-5 h-5 text-secondary" /> Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className={`w-full p-3 rounded-xl border-2 ${
                  errors.message ? "border-error" : "border-base-300"
                } focus:border-primary outline-none bg-base-200 resize-none`}
                required
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p id="message-error" className="text-error text-sm mt-1">
                  {errors.message}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isCreating}
              whileHover={{ scale: isCreating ? 1 : 1.03 }}
              whileTap={{ scale: isCreating ? 1 : 0.97 }}
              className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isCreating
                  ? "bg-base-300 text-base-content/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl"
              }`}
            >
              <AnimatePresence mode="wait">
                {isCreating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <Loader2 className="animate-spin w-6 h-6" />
                    Sending...
                  </motion.div>
                ) : (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        </div>

        {/* User Contacts List */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Your Submitted Contacts</h2>
          {userContacts.isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
          ) : userContacts.isError ? (
            <p className="text-error text-sm">
              {userContacts.error?.message || "Failed to load contacts"}
            </p>
          ) : userContacts.data?.length === 0 ? (
            <p className="text-base-content/60">No contacts yet.</p>
          ) : (
            <ul className="space-y-4">
              {userContacts.data?.map((contact) => (
                <motion.li
                  key={contact._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 rounded-xl border border-base-300 bg-base-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{contact.name}</h3>
                    <p className="text-base-content/70">{contact.message}</p>
                    <p className="text-sm text-base-content/50 mt-1">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          contact.status === "Resolved"
                            ? "text-success"
                            : contact.status === "In Progress"
                            ? "text-warning"
                            : "text-error"
                        }`}
                      >
                        {contact.status || "Pending"}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-base-content/50">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                    <motion.button
                      onClick={() => handleDelete(contact._id)}
                      disabled={isDeleting}
                      whileHover={{ scale: isDeleting ? 1 : 1.05 }}
                      whileTap={{ scale: isDeleting ? 1 : 0.95 }}
                      className={`p-2 rounded-full ${
                        isDeleting
                        //   ? "bg-base-300 text-base-content/50 cursor-not-allowed"
                        //   : "bg-error text-white hover:bg-error/80"
                      }`}
                      aria-label="Delete contact"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserContacts;