import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Plus } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/admin/users", { withCredentials: true })
      .then((res) => {
        if (Array.isArray(res.data.users)) {
          setUsers(res.data.users);
        } else {
          setUsers([]);
          toast.error("No users found.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err.response?.data || err.message);
        setUsers([]);
        setLoading(false);
        toast.error("Failed to fetch users.");
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:5000/api/admin/user/${userId}`, {
          withCredentials: true,
        })
        .then(() => {
          setUsers(users.filter((user) => user._id !== userId));
          toast.success("User deleted successfully!");
        })
        .catch((err) => {
          console.error("Delete Error:", err.response?.data || err.message);
          toast.error("Failed to delete user.");
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();

    const userToCreate = { ...newUser };

    if (userToCreate.phone === "") {
      delete userToCreate.phone;
    }

    axios
      .post("http://localhost:5000/api/admin/user", userToCreate, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("User created successfully!");
        setShowAddUserForm(false);
        setNewUser({
          fullname: "",
          email: "",
          phone: "",
          password: "",
          role: "user",
        });
        fetchUsers();
      })
      .catch((err) => {
        console.error("Create User Error:", err.response?.data || err.message);
        toast.error(err.response?.data?.error || "Failed to create user.");
      });
  };

  return (
    <div className="min-h-screen p-6 bg-base-100">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <button
          onClick={() => setShowAddUserForm(!showAddUserForm)}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Add New User
        </button>
      </div>

      {showAddUserForm && (
        <div className="bg-base-200 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullname"
                value={newUser.fullname}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Phone (Optional)</span>
              </label>
              <input
                type="text"
                name="phone"
                value={newUser.phone}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-success">
                Create User
              </button>
              <button
                type="button"
                onClick={() => setShowAddUserForm(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="bg-base-100 shadow rounded-lg overflow-x-auto">
          <table className="table table-auto w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="px-4 py-2 text-left">Full Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-base-200">
                    <td className="px-4 py-2">{user.fullname}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 text-left">{user.phone || "N/A"}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`badge ${
                          user.role === "admin" ? "badge-primary" : "badge-neutral"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="btn btn-error btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-6 text-center text-base-content/60"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;