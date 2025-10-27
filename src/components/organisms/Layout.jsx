import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = ({ onSearch, onAddStudent }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={onSearch} onAddStudent={onAddStudent} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;