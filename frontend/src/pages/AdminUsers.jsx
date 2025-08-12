// import { useEffect, useState } from "react";
// import axios from "axios";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
   

// axios.get("http://localhost:5000/api/admin/users", { withCredentials: true })

//   .then((res) => {
//     // console.log("API Response:", res.data); 
//     if (Array.isArray(res.data.users)) {
//       setUsers(res.data.users);
//     } else {
//       setUsers([]);
//     }
//   })
//   .catch((err) => {
//     console.error("API Error:", err.response?.data || err.message);
//     setUsers([]);
//   });



//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

//       <div className="bg-base-100 shadow rounded-lg overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-base-200">
//             <tr>
//               <th className="px-4 py-2 text-left">Full Name</th>
//               <th className="px-4 py-2 text-left">Email</th>
//               <th className="px-4 py-2 text-left">Role</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <tr key={user._id} className="hover:bg-base-200">
//                   <td className="px-4 py-2">{user.fullname}</td>
//                   <td className="px-4 py-2">{user.email}</td>
//                   <td className="px-4 py-2">{user.role}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3" className="px-4 py-6 text-center text-base-content/60">
//                   No users found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminUsers;









import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);


  // Fetch users
  useEffect(() => {
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
        toast.error("Failed to fetch users.");
        setLoading(false);
      });
  }, []);

  // Delete user
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

 

  return (
    <div className='min-h-screen p-6 bg-base-100' >
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
      
      </div>

      {loading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="bg-base-100 shadow rounded-lg overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-base-200">
              <tr>
                <th className="px-4 py-2 text-left">Full Name</th>
                <th className="px-4 py-2 text-left">Email</th>
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
                    <td className="px-4 py-2">{user.role}</td>
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
                  <td colSpan="4" className="px-4 py-6 text-center text-base-content/60">
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