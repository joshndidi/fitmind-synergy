import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";

const Layout = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark">
      <NavBar />
      <main className={`container mx-auto px-4 py-8 pt-20 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="glass-card p-6 rounded-2xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
