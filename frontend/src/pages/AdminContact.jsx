"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Loader2, Trash2, CheckCircle, Clock, User, Mail, Phone, MessageCircle } from "lucide-react";
import useAdminContacts from "../hooks/useAdminContacts";

const AdminContacts = () => {
  const {
    adminContacts,
    updateStatusMutation,
    deleteContactMutation,
    isUpdating,
    isDeleting,
    updateError,
    deleteError,
  } = useAdminContacts();

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleStatusUpdate = (contactId, newStatus) => {
    updateStatusMutation(
      { id: contactId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Status updated to ${newStatus}!`, {
            style: { background: "hsl(var(--su))", color: "hsl(var(--suc))" },
          });
        },
        onError: () => {
          toast.error("Failed to update status", {
            style: { background: "hsl(var(--er))", color: "hsl(var(--erc))" },
          });
        },
      }
    );
  };

  const handleDelete = (contactId) => {
    setDeleteConfirmId(contactId);
  };

  const confirmDelete = () => {
    deleteContactMutation(
      deleteConfirmId,
      {
        onSuccess: () => {
          toast.success("Contact deleted successfully!", {
            style: { background: "hsl(var(--su))", color: "hsl(var(--suc))" },
          });
          setDeleteConfirmId(null);
        },
        onError: () => {
          toast.error("Failed to delete contact", {
            style: { background: "hsl(var(--er))", color: "hsl(var(--erc))" },
          });
          setDeleteConfirmId(null);
        },
      }
    );
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return (
    <div className="min-h-screen bg-base-200 py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-base-100 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-primary" />
            User Contacts
          </h2>

          {(updateError || deleteError) && (
            <p className="text-error text-sm mb-4">
              {updateError?.message || deleteError?.message || "An error occurred"}
            </p>
          )}

          {adminContacts.isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
          ) : adminContacts.isError ? (
            <p className="text-error text-sm">
              {adminContacts.error?.message || "Failed to load contacts"}
            </p>
          ) : adminContacts.data?.length === 0 ? (
            <p className="text-base-content/60">No contacts available.</p>
          ) : (
            <ul className="space-y-4">
              {adminContacts.data?.map((contact) => (
                <motion.li
                  key={contact._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 rounded-xl border border-base-300 bg-base-200/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-secondary" />
                        {contact.name}
                      </h3>
                      <p className="text-base-content/70 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-accent" />
                        {contact.email}
                      </p>
                      {contact.phone && (
                        <p className="text-base-content/70 flex items-center gap-2">
                          <Phone className="w-5 h-5 text-accent" />
                          {contact.phone}
                        </p>
                      )}
                      <p className="text-base-content/70 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-secondary" />
                        {contact.message}
                      </p>
                      <p className="text-sm text-base-content/50">
                        Submitted: {new Date(contact.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Status:</span>
                        <select
                          value={contact.status || "Pending"}
                          onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                          disabled={isUpdating}
                          className={`select select-sm rounded-lg ${
                            contact.status === "Resolved"
                              ? "bg-success/20 text-success"
                              : contact.status === "In Progress"
                              ? "bg-warning/20 text-warning"
                              : "bg-error/20 text-error"
                          } focus:outline-none`}
                          aria-label={`Status for ${contact.name}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                      <motion.button
                        onClick={() => handleDelete(contact._id)}
                        disabled={isDeleting || deleteConfirmId === contact._id}
                        whileHover={{ scale: isDeleting ? 1 : 1.05 }}
                        whileTap={{ scale: isDeleting ? 1 : 0.95 }}
                        className={`btn btn-sm btn-error text-white ${
                          isDeleting || deleteConfirmId === contact._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        aria-label={`Delete contact from ${contact.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </div>

                  {/* Delete Confirmation Dialog */}
                  <AnimatePresence>
                    {deleteConfirmId === contact._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-error/10 rounded-lg flex flex-col sm:flex-row gap-2 items-center justify-between"
                      >
                        <p className="text-error text-sm">
                          Are you sure you want to delete this contact?
                        </p>
                        <div className="flex gap-2">
                          <motion.button
                            onClick={confirmDelete}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-sm btn-error text-white"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                              "Confirm"
                            )}
                          </motion.button>
                          <motion.button
                            onClick={cancelDelete}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-sm btn-neutral"
                            disabled={isDeleting}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminContacts;