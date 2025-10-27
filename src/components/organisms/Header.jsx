import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
    { path: "", label: "Students", icon: "GraduationCap" },
    { path: "teachers", label: "Teachers", icon: "Users" },
    { path: "dashboard", label: "Dashboard", icon: "BarChart3" }
  ];

  const currentPath = location.pathname === "/" ? "" : location.pathname.substring(1);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">ClassTrack</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path === "" ? "/" : `/${item.path}`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                  currentPath === item.path
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:text-primary hover:bg-blue-50"
                }`}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
</nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Logout Button */}
            <button
              onClick={() => logout()}
              className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md transition-colors"
            >
              <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
              Logout
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-4">
            <nav className="space-y-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path === "" ? "/" : `/${item.path}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-3 ${
                    currentPath === item.path
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:text-primary hover:bg-blue-50"
                  }`}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Floating Add Button for Mobile */}
    </header>
  );
};

export default Header;