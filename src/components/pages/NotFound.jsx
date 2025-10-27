import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <ApperIcon name="GraduationCap" className="w-16 h-16 text-white" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <Button className="inline-flex items-center">
              <ApperIcon name="Home" className="w-4 h-4 mr-2" />
              Back to Students
            </Button>
          </Link>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:text-primary transition-colors duration-200"
            >
              <ApperIcon name="Users" className="w-4 h-4" />
              <span>Students</span>
            </Link>
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 hover:text-primary transition-colors duration-200"
            >
              <ApperIcon name="BarChart3" className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;