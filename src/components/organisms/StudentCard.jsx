import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import StudentAvatar from "@/components/molecules/StudentAvatar";
import GradeDisplay from "@/components/molecules/GradeDisplay";
import AttendanceRate from "@/components/molecules/AttendanceRate";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const StudentCard = ({ student, onView, onEdit, onDelete }) => {
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setLoading(true);
        const [gradesData, attendanceData] = await Promise.all([
          gradeService.getByStudentId(student.Id),
          attendanceService.getByStudentId(student.Id)
        ]);
        setGrades(gradesData);
        setAttendance(attendanceData);
      } catch (error) {
        console.error("Error loading student data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [student.Id]);

  return (
    <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 p-4">
      {/* Student Info Header */}
      <div className="flex items-center space-x-3 mb-4">
        <StudentAvatar 
          photoUrl={student.photoUrl}
          firstName={student.firstName}
          lastName={student.lastName}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-sm text-gray-500">{student.studentId}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="info">Grade {student.grade}</Badge>
            <Badge variant="default">Section {student.section}</Badge>
          </div>
        </div>
        <Badge variant={student.status === "active" ? "success" : "error"}>
          {student.status}
        </Badge>
      </div>

      {/* Academic Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Grade Average</div>
          {loading ? (
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
          ) : (
            <GradeDisplay grades={grades} />
          )}
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Attendance</div>
          {loading ? (
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
          ) : (
            <AttendanceRate attendance={attendance} />
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {student.email && (
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{student.email}</span>
          </div>
        )}
        {student.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Phone" className="w-4 h-4 mr-2 text-gray-400" />
            <span>{student.phone}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => onView(student)}
          className="flex-1"
        >
          <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(student)}
        >
          <ApperIcon name="Edit" className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(student)}
          className="text-red-600 hover:text-red-700 hover:border-red-300"
        >
          <ApperIcon name="Trash2" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default StudentCard;