"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  Loader2, 
  Trash2, 
  CheckCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageCircle, 
  Search,
  Filter,
  Download,
  Calendar,
  AlertCircle,
  MoreVertical,
  Eye,
  Archive
} from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);

  // Filter contacts based on search and status
  const filteredContacts = adminContacts.data?.filter(contact => {
    const matchesSearch = contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleStatusUpdate = (contactId, newStatus) => {
    updateStatusMutation(
      { id: contactId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Status updated to ${newStatus}!`, {
            style: { background: "#10b981", color: "white" },
            icon: "✅",
          });
        },
        onError: () => {
          toast.error("Failed to update status", {
            style: { background: "#ef4444", color: "white" },
            icon: "❌",
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
            style: { background: "#10b981", color: "white" },
            icon: "🗑️",
          });
          setDeleteConfirmId(null);
        },
        onError: () => {
          toast.error("Failed to delete contact", {
            style: { background: "#ef4444", color: "white" },
            icon: "❌",
          });
          setDeleteConfirmId(null);
        },
      }
    );
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-success/20 text-success border-success/30";
      case "In Progress":
        return "bg-warning/20 text-warning border-warning/30";
      case "Pending":
      default:
        return "bg-error/20 text-error border-error/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="w-4 h-4" />;
      case "In Progress":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "Pending":
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const exportContacts = () => {
    const data = filteredContacts.map(contact => ({
      Name: contact.name,
      Email: contact.email,
      Phone: contact.phone || 'N/A',
      Message: contact.message,
      Status: contact.status,
      'Submitted Date': new Date(contact.createdAt).toLocaleDateString()
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Contacts exported successfully!', {
      icon: '📥',
    });
  };

  const stats = {
    total: adminContacts.data?.length || 0,
    pending: adminContacts.data?.filter(c => c.status === "Pending").length || 0,
    inProgress: adminContacts.data?.filter(c => c.status === "In Progress").length || 0,
    resolved: adminContacts.data?.filter(c => c.status === "Resolved").length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Contact Management
            </h1>
            <p className="text-base-content/60 mt-2">Manage user inquiries and support requests</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={exportContacts}
              className="btn btn-outline gap-2"
              disabled={filteredContacts.length === 0}
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-base-100 shadow-lg border border-base-300/30">
            <div className="card-body p-4 text-center">
              <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-base-content">{stats.total}</div>
              <div className="text-sm text-base-content/60">Total Contacts</div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-lg border border-base-300/30">
            <div className="card-body p-4 text-center">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-base-content">{stats.pending}</div>
              <div className="text-sm text-base-content/60">Pending</div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-lg border border-base-300/30">
            <div className="card-body p-4 text-center">
              <Loader2 className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-base-content">{stats.inProgress}</div>
              <div className="text-sm text-base-content/60">In Progress</div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-lg border border-base-300/30">
            <div className="card-body p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-base-content">{stats.resolved}</div>
              <div className="text-sm text-base-content/60">Resolved</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card bg-base-100 shadow-lg border border-base-300/30 mb-8">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 w-full lg:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search contacts by name, email, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select select-bordered select-sm"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="btn btn-ghost btn-sm gap-2"
                >
                  <Filter size={16} />
                  Reset
                </button>
              </div>
            </div>
            
            {/* Results count */}
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-base-content/60">
                Showing {filteredContacts.length} of {stats.total} contacts
              </p>
              {searchTerm && (
                <p className="text-sm text-base-content/60">
                  Search: "{searchTerm}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="card bg-base-100 shadow-xl border border-base-300/30">
          <div className="card-body p-0">
            {(updateError || deleteError) && (
              <div className="alert alert-error m-6">
                <AlertCircle className="w-5 h-5" />
                <span>{updateError?.message || deleteError?.message || "An error occurred"}</span>
              </div>
            )}

            {adminContacts.isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
                <span className="ml-3 text-base-content/60">Loading contacts...</span>
              </div>
            ) : adminContacts.isError ? (
              <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-error mb-2">Failed to Load Contacts</h3>
                <p className="text-base-content/60">{adminContacts.error?.message || "Please try again later"}</p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-base-content/70 mb-2">
                  {stats.total === 0 ? "No Contacts Yet" : "No Matching Contacts"}
                </h3>
                <p className="text-base-content/50">
                  {stats.total === 0 
                    ? "User contacts will appear here when they submit inquiries." 
                    : "Try adjusting your search or filters."}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead className="bg-base-200/50">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Contact</th>
                        <th className="px-6 py-4 text-left font-semibold">Message</th>
                        <th className="px-6 py-4 text-left font-semibold">Status</th>
                        <th className="px-6 py-4 text-left font-semibold">Date</th>
                        <th className="px-6 py-4 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact) => (
                        <motion.tr
                          key={contact._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-base-200/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="font-semibold text-base-content flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                {contact.name}
                              </div>
                              <div className="text-sm text-base-content/70 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {contact.email}
                              </div>
                              {contact.phone && (
                                <div className="text-sm text-base-content/70 flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {contact.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <p className="text-base-content/80 line-clamp-2">
                                {contact.message}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={contact.status || "Pending"}
                              onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                              disabled={isUpdating}
                              className={`select select-sm border-2 ${getStatusColor(contact.status)}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-base-content/60 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleDelete(contact._id)}
                                disabled={isDeleting || deleteConfirmId === contact._id}
                                className="btn btn-ghost btn-sm btn-square text-error"
                                title="Delete Contact"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirmId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-base-100 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-error" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Delete Contact</h3>
                  <p className="text-base-content/60">
                    Are you sure you want to delete this contact? This action cannot be undone.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={cancelDelete}
                    className="btn btn-ghost flex-1"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="btn btn-error flex-1 gap-2"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminContacts;