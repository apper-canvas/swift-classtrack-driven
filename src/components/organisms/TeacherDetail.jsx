import { createPortal } from "react-dom";
import ApperIcon from "@/components/ApperIcon";
import StudentAvatar from "@/components/molecules/StudentAvatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const TeacherDetail = ({ isOpen, onClose, teacher }) => {
  if (!isOpen || !teacher) return null;

  const experienceYears = teacher.experienceYears || 0;
  const hireDate = teacher.hireDate ? format(new Date(teacher.hireDate), "MMM dd, yyyy") : "N/A";

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Teacher Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
            <StudentAvatar
              photoUrl={teacher.photoUrl}
              firstName={teacher.firstName}
              lastName={teacher.lastName}
              size="xl"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {teacher.firstName} {teacher.lastName}
              </h3>
              <p className="text-gray-600 mt-1">{teacher.department}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="info">{teacher.specialization}</Badge>
                <Badge variant={teacher.employmentStatus === "full-time" ? "success" : "warning"}>
                  {teacher.employmentStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <ApperIcon name="Briefcase" className="w-5 h-5 mr-2 text-primary" />
              Professional Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-900">{teacher.department || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Specialization</p>
                <p className="font-medium text-gray-900">{teacher.specialization || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium text-gray-900">{experienceYears} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hire Date</p>
                <p className="font-medium text-gray-900">{hireDate}</p>
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <ApperIcon name="Award" className="w-5 h-5 mr-2 text-primary" />
              Qualifications
            </h4>
            <p className="text-gray-700">{teacher.qualifications || "Not specified"}</p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <ApperIcon name="Contact" className="w-5 h-5 mr-2 text-primary" />
              Contact Information
            </h4>
            <div className="space-y-3">
              {teacher.email && (
                <div className="flex items-center text-gray-700">
                  <ApperIcon name="Mail" className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{teacher.email}</p>
                  </div>
                </div>
              )}
              {teacher.phone && (
                <div className="flex items-center text-gray-700">
                  <ApperIcon name="Phone" className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{teacher.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Employment Status */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <ApperIcon name="FileText" className="w-5 h-5 mr-2 text-primary" />
              Employment Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={teacher.employmentStatus === "full-time" ? "success" : "warning"}>
                  {teacher.employmentStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Seniority</p>
                <Badge variant={experienceYears >= 10 ? "success" : experienceYears >= 5 ? "info" : "default"}>
                  {experienceYears >= 10 ? "Senior" : experienceYears >= 5 ? "Experienced" : "Developing"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TeacherDetail;