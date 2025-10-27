import React, { useState, Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { router } from "@/router";
import Layout from "@/components/organisms/Layout";
import Students from "@/pages/Students";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddStudent = () => {
    setIsAddModalOpen(true);
  };

  // Create enhanced router with props
  const enhancedRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout 
          onSearch={handleSearch} 
          onAddStudent={handleAddStudent}
        />
      ),
      children: [
        {
          path: "",
          index: true,
          element: (
            <Suspense fallback={<div>Loading.....</div>}>
              <Students 
                searchTerm={searchTerm}
                isAddModalOpen={isAddModalOpen}
                setIsAddModalOpen={setIsAddModalOpen}
              />
            </Suspense>
          ),
        },
        {
          path: "dashboard",
          element: (
            <Suspense fallback={<div>Loading.....</div>}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "*",
          element: (
            <Suspense fallback={<div>Loading.....</div>}>
              <NotFound />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={enhancedRouter} />;
}

export default App;