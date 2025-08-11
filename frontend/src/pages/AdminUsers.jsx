import { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
   

axios.get("http://localhost:5000/api/admin/users", { withCredentials: true })

  .then((res) => {
    // console.log("API Response:", res.data); 
    if (Array.isArray(res.data.users)) {
      setUsers(res.data.users);
    } else {
      setUsers([]);
    }
  })
  .catch((err) => {
    console.error("API Error:", err.response?.data || err.message);
    setUsers([]);
  });

// console.log(res.data);

  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <div className="bg-base-100 shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="px-4 py-2 text-left">Full Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-base-200">
                  <td className="px-4 py-2">{user.fullname}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-6 text-center text-base-content/60">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
