

import AdminSidebar from "./AminSidebar";
import AdminNavbar from "./AdminNavbar";

const Layoutadmin = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen flex">
      {showSidebar && <AdminSidebar />}

      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layoutadmin;

