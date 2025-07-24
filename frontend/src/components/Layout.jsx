import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen flex">
      {showSidebar && <Sidebar />}

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

