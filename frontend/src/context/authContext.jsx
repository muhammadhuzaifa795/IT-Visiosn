// // src/context/authContext.jsx

// import { createContext, useContext, useState, useEffect } from "react";
// import { getAuthUser } from "../lib/api";

// // 1. Create context
// const AuthContext = createContext();

// // 2. Custom hook
// export const useAuth = () => useContext(AuthContext);

// // 3. Provider
// export const AuthProvider = ({ children }) => {
//   const [authUser, setAuthUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔄 Fetch logged-in user on mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       const user = await getAuthUser();
//       setAuthUser(user);
//       setLoading(false);
//     };
//     fetchUser();
//   }, []);

//   if (loading) return <div className="text-center py-10">Loading user...</div>;

//   return (
//     <AuthContext.Provider value={{ authUser, setAuthUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
