import { Outlet } from "react-router-dom";
import React from "react";
import Header from "@/components/organisms/Header";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;