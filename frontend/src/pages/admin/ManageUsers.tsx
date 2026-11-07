import React, { useEffect, useState } from "react";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { adminService, AdminUser } from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Filter,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { formatISTDate } from "../../utils/dateUtils";

export const ManageUsers: React.FC = () => {
  const { user: currentAuthUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  // Role Change Modal
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<"guest" | "organizer" | "admin">("organizer");
  const [updatingRole, setUpdatingRole] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);

  // Notifications
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (roleFilter) params.role = roleFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await adminService.getAllUsers(params);
      if (res && res.users) {
        setUsers(res.users);
      }
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setFeedback({ type: "error", text: "Failed to load users list." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const openRoleModal = (u: AdminUser) => {
    setSelectedUser(u);
    setNewRole(u.role);
    setRoleModalOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    try {
      setUpdatingRole(true);
      const res = await adminService.updateUserRole(selectedUser._id, newRole);
      if (res && res.success) {
        setFeedback({ type: "success", text: `User role updated to ${newRole} successfully.` });
        setRoleModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (err: any) {
      console.error("Error updating role:", err);
      setFeedback({ type: "error", text: err.response?.data?.message || "Failed to update role." });
    } finally {
      setUpdatingRole(false);
    }
  };

  const openDeleteModal = (u: AdminUser) => {
    setSelectedUser(u);
    setDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setDeletingUser(true);
      const res = await adminService.deleteUser(selectedUser._id);
      if (res && res.success) {
        setFeedback({ type: "success", text: "User removed successfully." });
        setDeleteModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (err: any) {
      console.error("Error deleting user:", err);
      setFeedback({ type: "error", text: err.response?.data?.message || "Failed to delete user." });
    } finally {
      setDeletingUser(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "organizer":
        return "bg-purple-50 text-[#6C4CE8] border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="User Management"
          subtitle="Manage roles, promote users to organizers, and view registered accounts"
        />

        <main className="p-6 sm:p-8 flex-1 space-y-6">
          {feedback && (
            <Alert
              severity={feedback.type}
              className="rounded-2xl text-xs"
              onClose={() => setFeedback(null)}
            >
              {feedback.text}
            </Alert>
          )}

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E9E8F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#202033] focus:bg-white focus:border-[#6C4CE8] focus:outline-none"
              />
            </form>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter size={16} className="text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#202033] focus:bg-white focus:border-[#6C4CE8] focus:outline-none cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="guest">Guests</option>
                <option value="organizer">Organizers</option>
                <option value="admin">Administrators</option>
              </select>
              <button
                type="button"
                onClick={fetchUsers}
                className="px-4 py-2 bg-[#6C4CE8] text-white text-xs font-bold rounded-xl hover:bg-[#5032C4] transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <Loader message="Loading registered users..." />
          ) : users.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Users Found"
              description="No user records matched your search query or filter."
            />
          ) : (
            <div className="bg-white rounded-2xl border border-[#E9E8F0] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 text-[#77778A] font-bold uppercase tracking-wider border-b border-[#E9E8F0]">
                    <tr>
                      <th className="py-4 px-6">User</th>
                      <th className="py-4 px-6">Email</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Joined Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E8F0]">
                    {users.map((u) => {
                      const isSelf = currentAuthUser?._id === u._id || currentAuthUser?.email === u.email;

                      return (
                        <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6C4CE8] flex items-center justify-center font-bold text-sm shrink-0">
                                {u.fullName ? u.fullName.charAt(0).toUpperCase() : "U"}
                              </div>
                              <div>
                                <p className="font-bold text-[#202033] text-sm">{u.fullName}</p>
                                {isSelf && (
                                  <span className="text-[10px] text-[#6C4CE8] font-bold">(You)</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-[#77778A] font-medium">{u.email}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize ${getRoleBadge(u.role)}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-[#77778A]">
                            {u.createdAt ? formatISTDate(u.createdAt) : "N/A"}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openRoleModal(u)}
                                className="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-[#6C4CE8] hover:bg-purple-100 rounded-xl transition-colors inline-flex items-center gap-1.5"
                                title="Change User Role"
                              >
                                <UserCheck size={14} />
                                <span>Change Role</span>
                              </button>

                              {!isSelf && (
                                <button
                                  onClick={() => openDeleteModal(u)}
                                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Role Change Dialog */}
      <Dialog
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#202033", display: "flex", alignItems: "center", gap: 1 }}>
          <Shield size={20} className="text-[#6C4CE8]" />
          <span>Update User Role</span>
        </DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <p className="text-xs text-[#77778A]">
            Select the access level for <strong>{selectedUser?.fullName}</strong> ({selectedUser?.email}).
          </p>

          <FormControl fullWidth size="small">
            <InputLabel id="select-role-label">Role</InputLabel>
            <Select
              labelId="select-role-label"
              value={newRole}
              label="Role"
              onChange={(e) => setNewRole(e.target.value as any)}
            >
              <MenuItem value="guest">Guest (Can explore, register, RSVP)</MenuItem>
              <MenuItem value="organizer">Organizer (Can create & manage events)</MenuItem>
              <MenuItem value="admin">Administrator (Full system access)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRoleModalOpen(false)} sx={{ color: "#77778A", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={updatingRole}
            onClick={handleUpdateRole}
            sx={{
              backgroundColor: "#6C4CE8",
              "&:hover": { backgroundColor: "#5032C4" },
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "10px",
            }}
          >
            {updatingRole ? "Saving..." : "Save Role"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#E5484D", display: "flex", alignItems: "center", gap: 1 }}>
          <AlertTriangle size={20} />
          <span>Confirm User Deletion</span>
        </DialogTitle>
        <DialogContent>
          <p className="text-sm text-[#202033] mb-2">
            Are you sure you want to permanently delete <strong>{selectedUser?.fullName}</strong>?
          </p>
          <p className="text-xs text-rose-600">
            This account and its credentials will be permanently removed.
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteModalOpen(false)} sx={{ color: "#77778A", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deletingUser}
            onClick={handleDeleteUser}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}
          >
            {deletingUser ? "Deleting..." : "Delete User"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
