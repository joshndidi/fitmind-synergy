
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";

const Layout = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark overflow-hidden">
      <div className="flex flex-col h-screen">
        <NavBar />
        <main className={`flex-1 overflow-auto scrollbar-hidden transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
