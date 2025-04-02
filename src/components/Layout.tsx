
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";

const Layout = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark">
      <NavBar />
      <main className={`container mx-auto px-4 py-8 pt-20 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="glass-card p-6 rounded-2xl grid grid-cols-12 gap-6">
          <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <Navigation />
          </div>
          <div className="col-span-12 lg:col-span-9 xl:col-span-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
