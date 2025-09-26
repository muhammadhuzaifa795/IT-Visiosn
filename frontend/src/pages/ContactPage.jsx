// components/UserContacts.js
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  Loader2, 
  Send, 
  MessageCircle, 
  Phone, 
  Mail, 
  User, 
  Trash2, 
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Filter,
  Search,
  Calendar,
  Star,
  Shield
} from "lucide-react";
import useContacts from "../hooks/useContact";

const UserContacts = ({ userId }) => {
  const { 
    userContacts, 
    createContactMutation, 
    isCreating, 
    createError, 
    deleteContactMutation, 
    isDeleting, 
    deleteError 
  } = useContacts(userId);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    priority: "medium"
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedContact, setExpandedContact] = useState(null);

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
      toast.error("Please fill all required fields correctly");
      return;
    }

    createContactMutation(
      { ...formData, userId },
      {
        onSuccess: () => {
          toast.success("Contact submitted successfully!");
          setFormData({ name: "", email: "", phone: "", message: "", priority: "medium" });
          setErrors({});
        },
      }
    );
  };

  const handleDelete = (contactId, contactName) => {
    if (window.confirm(`Are you sure you want to delete the contact from ${contactName}?`)) {
      deleteContactMutation(contactId);
    }
  };

  const toggleExpandContact = (contactId) => {
    setExpandedContact(expandedContact === contactId ? null : contactId);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "in progress":
        return <Loader2 className="w-4 h-4 text-warning animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-base-content/40" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-error/20 text-error border-error/20";
      case "medium":
        return "bg-warning/20 text-warning border-warning/20";
      case "low":
        return "bg-success/20 text-success border-success/20";
      default:
        return "bg-base-300 text-base-content border-base-300";
    }
  };

  const filteredContacts = userContacts.data?.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
                      contact.status?.toLowerCase() === activeTab.toLowerCase();
    
    return matchesSearch && matchesTab;
  }) || [];

  const statusCounts = {
    all: userContacts.data?.length || 0,
    pending: userContacts.data?.filter(c => !c.status || c.status.toLowerCase() === "pending").length || 0,
    "in progress": userContacts.data?.filter(c => c.status?.toLowerCase() === "in progress").length || 0,
    resolved: userContacts.data?.filter(c => c.status?.toLowerCase() === "resolved").length || 0,
  };

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3 mb-4">
            <MessageCircle className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold text-primary">Contact Management</span>
          </div>
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Get in Touch With Us
          </h1>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            Have questions or need support? Send us a message and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300/30 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Send className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-base-content">Send us a Message</h2>
                  <p className="text-base-content/60">We typically respond within 24 hours</p>
                </div>
              </div>

              {createError && (
                <div className="alert alert-error mb-6">
                  <AlertCircle className="w-5 h-5" />
                  <span>{createError?.response?.data?.error || "Failed to submit contact"}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                        <span className="text-error">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.name}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                        <span className="text-error">*</span>
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.email}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`input input-bordered ${errors.phone ? 'input-error' : ''}`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.phone}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Priority
                      </span>
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="select select-bordered"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Message
                        <span className="text-error">*</span>
                      </span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className={`textarea textarea-bordered ${errors.message ? 'textarea-error' : ''}`}
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.message}</span>
                      </label>
                    )}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isCreating}
                  whileHover={{ scale: isCreating ? 1 : 1.02 }}
                  whileTap={{ scale: isCreating ? 1 : 0.98 }}
                  className="btn btn-primary w-full h-14 text-lg gap-3"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300/30 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-base-content mb-2">Your Messages</h2>
                  <p className="text-base-content/60">
                    {userContacts.data?.length || 0} total messages
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input input-bordered pl-10 pr-4 h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="tabs tabs-boxed bg-base-200 p-1 mb-6">
                {[
                  { key: "all", label: "All", count: statusCounts.all },
                  { key: "pending", label: "Pending", count: statusCounts.pending },
                  { key: "in progress", label: "In Progress", count: statusCounts["in progress"] },
                  { key: "resolved", label: "Resolved", count: statusCounts.resolved }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`tab tab-lg flex-1 ${activeTab === tab.key ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="badge badge-sm badge-ghost ml-2">{tab.count}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Contact List */}
              {userContacts.isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin w-8 h-8 text-primary" />
                </div>
              ) : userContacts.isError ? (
                <div className="alert alert-error">
                  <AlertCircle className="w-5 h-5" />
                  <span>{userContacts.error?.message || "Failed to load contacts"}</span>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-base-content mb-2">No messages found</h3>
                  <p className="text-base-content/60">
                    {activeTab !== "all" || searchQuery ? 
                      "No messages match your current filters." : 
                      "You haven't sent any messages yet."
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContacts.map((contact) => (
                    <motion.div
                      key={contact._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-base-200/50 rounded-xl border border-base-300/30 overflow-hidden"
                    >
                      <div 
                        className="p-4 cursor-pointer hover:bg-base-300/20 transition-colors"
                        onClick={() => toggleExpandContact(contact._id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-base-content truncate">
                                {contact.name}
                              </h3>
                              <span className={`badge badge-sm ${getPriorityColor(contact.priority)}`}>
                                {contact.priority}
                              </span>
                            </div>
                            <p className="text-base-content/70 text-sm line-clamp-2 mb-2">
                              {contact.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-base-content/50">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {contact.email}
                              </span>
                              {contact.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {contact.phone}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(contact.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <div className="flex items-center gap-1 text-sm">
                              {getStatusIcon(contact.status)}
                              <span className={`
                                ${contact.status?.toLowerCase() === "resolved" ? "text-success" :
                                  contact.status?.toLowerCase() === "in progress" ? "text-warning" :
                                  "text-base-content/60"}
                              `}>
                                {contact.status || "Pending"}
                              </span>
                            </div>
                            <ChevronDownIcon 
                              className={`w-4 h-4 text-base-content/40 transition-transform ${
                                expandedContact === contact._id ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedContact === contact._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-base-300/30"
                          >
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <h4 className="font-semibold text-base-content mb-2">Contact Details</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-base-content/60">Email:</span>
                                      <span>{contact.email}</span>
                                    </div>
                                    {contact.phone && (
                                      <div className="flex justify-between">
                                        <span className="text-base-content/60">Phone:</span>
                                        <span>{contact.phone}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span className="text-base-content/60">Priority:</span>
                                      <span className={`capitalize ${getPriorityColor(contact.priority).split(' ')[1]}`}>
                                        {contact.priority}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-base-content mb-2">Message</h4>
                                  <p className="text-base-content/80 leading-relaxed">
                                    {contact.message}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-base-300/30">
                                <button
                                  onClick={() => handleDelete(contact._id, contact.name)}
                                  disabled={isDeleting}
                                  className="btn btn-error btn-sm gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Helper component for chevron icon
const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

export default UserContacts;