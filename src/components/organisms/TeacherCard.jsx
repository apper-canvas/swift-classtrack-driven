import ApperIcon from "@/components/ApperIcon";
import StudentAvatar from "@/components/molecules/StudentAvatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const TeacherCard = ({ teacher, onView, onEdit, onDelete }) => {
  const experienceYears = teacher.experienceYears || 0;
  const experienceBadge = experienceYears >= 10 ? "success" : experienceYears >= 5 ? "info" : "default";

  return (
    <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 p-4">
      {/* Teacher Info Header */}
      <div className="flex items-center space-x-3 mb-4">
        <StudentAvatar 
          photoUrl={teacher.photoUrl}
          firstName={teacher.firstName}
          lastName={teacher.lastName}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {teacher.firstName} {teacher.lastName}
          </h3>
          <p className="text-sm text-gray-500">{teacher.department}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="info">{teacher.specialization}</Badge>
          </div>
        </div>
        <Badge variant={teacher.employmentStatus === "full-time" ? "success" : "warning"}>
          {teacher.employmentStatus}
        </Badge>
      </div>

      {/* Professional Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Award" className="w-4 h-4 mr-2 text-gray-400" />
          <span className="truncate">{teacher.qualifications}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Calendar" className="w-4 h-4 mr-2 text-gray-400" />
          <span>{experienceYears} years experience</span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {teacher.email && (
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{teacher.email}</span>
          </div>
        )}
        {teacher.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Phone" className="w-4 h-4 mr-2 text-gray-400" />
            <span>{teacher.phone}</span>
          </div>
        )}
      </div>

      {/* Experience Badge */}
      <div className="mb-4">
        <Badge variant={experienceBadge}>
          <ApperIcon name="Star" className="w-3 h-3 mr-1" />
          {experienceYears >= 10 ? "Senior Teacher" : experienceYears >= 5 ? "Experienced" : "Developing"}
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => onView(teacher)}
          className="flex-1"
        >
          <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(teacher)}
        >
          <ApperIcon name="Edit" className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(teacher)}
          className="text-red-600 hover:text-red-700 hover:border-red-300"
        >
          <ApperIcon name="Trash2" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TeacherCard;