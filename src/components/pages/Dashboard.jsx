import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { format, subDays } from "date-fns";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [studentsData, gradesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);
      setStudents(studentsData);
      setGrades(gradesData);
      setAttendance(attendanceData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "active").length;
  
  const averageGrade = grades.length > 0 
    ? grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore * 100), 0) / grades.length
    : 0;

  const todayAttendance = attendance.filter(a => a.date === format(new Date(), "yyyy-MM-dd"));
  const presentToday = todayAttendance.filter(a => a.status === "present").length;
  const totalAttendanceToday = todayAttendance.length;
  const attendanceRate = totalAttendanceToday > 0 ? (presentToday / totalAttendanceToday * 100) : 0;

  // Grade distribution
  const gradeDistribution = grades.reduce((acc, grade) => {
    const percentage = (grade.score / grade.maxScore) * 100;
    const letterGrade = percentage >= 90 ? "A" : percentage >= 80 ? "B" : percentage >= 70 ? "C" : percentage >= 60 ? "D" : "F";
    acc[letterGrade] = (acc[letterGrade] || 0) + 1;
    return acc;
  }, {});

  // Recent attendance
  const recentAttendance = attendance
    .filter(a => new Date(a.date) >= subDays(new Date(), 7))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const statCards = [
    {
      title: "Total Students",
      value: totalStudents.toString(),
      subtitle: `${activeStudents} active`,
      icon: "Users",
      color: "blue",
      trend: "+2 this week"
    },
    {
      title: "Class Average",
      value: `${Math.round(averageGrade)}%`,
      subtitle: getLetterGrade(averageGrade),
      icon: "BookOpen",
      color: averageGrade >= 80 ? "green" : averageGrade >= 70 ? "yellow" : "red",
      trend: grades.length > 0 ? `${grades.length} grades recorded` : "No grades yet"
    },
    {
      title: "Today's Attendance",
      value: `${Math.round(attendanceRate)}%`,
      subtitle: `${presentToday}/${totalAttendanceToday} present`,
      icon: "Calendar",
      color: attendanceRate >= 95 ? "green" : attendanceRate >= 85 ? "yellow" : "red",
      trend: totalAttendanceToday > 0 ? "Updated today" : "No data today"
    },
    {
      title: "Total Grades",
      value: grades.length.toString(),
      subtitle: `${Object.keys(gradeDistribution).length} subjects`,
      icon: "Award",
      color: "purple",
      trend: "All subjects"
    }
  ];

  function getLetterGrade(avg) {
    if (avg >= 90) return "Grade A";
    if (avg >= 80) return "Grade B";
    if (avg >= 70) return "Grade C";
    if (avg >= 60) return "Grade D";
    return avg > 0 ? "Grade F" : "No grades";
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your class performance and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 p-6 border-l-4"
            style={{
              borderLeftColor: 
                stat.color === "blue" ? "#2563eb" :
                stat.color === "green" ? "#10b981" :
                stat.color === "yellow" ? "#f59e0b" :
                stat.color === "red" ? "#ef4444" :
                "#8b5cf6"
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  stat.color === "blue" ? "bg-blue-100" :
                  stat.color === "green" ? "bg-green-100" :
                  stat.color === "yellow" ? "bg-yellow-100" :
                  stat.color === "red" ? "bg-red-100" :
                  "bg-purple-100"
                }`}
              >
                <ApperIcon
                  name={stat.icon}
                  className={`w-6 h-6 ${
                    stat.color === "blue" ? "text-blue-600" :
                    stat.color === "green" ? "text-green-600" :
                    stat.color === "yellow" ? "text-yellow-600" :
                    stat.color === "red" ? "text-red-600" :
                    "text-purple-600"
                  }`}
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grade Distribution */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="BarChart3" className="w-5 h-5 mr-2 text-primary" />
            Grade Distribution
          </h3>
          {Object.keys(gradeDistribution).length > 0 ? (
            <div className="space-y-3">
              {["A", "B", "C", "D", "F"].map(grade => {
                const count = gradeDistribution[grade] || 0;
                const percentage = grades.length > 0 ? (count / grades.length * 100) : 0;
                
                return (
                  <div key={grade} className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mr-3"
                         style={{
                           backgroundColor: 
                             grade === "A" ? "#10b981" :
                             grade === "B" ? "#3b82f6" :
                             grade === "C" ? "#f59e0b" :
                             grade === "D" ? "#f97316" :
                             "#ef4444"
                         }}>
                      {grade}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Grade {grade}</span>
                        <span className="text-sm text-gray-500">{count} ({Math.round(percentage)}%)</span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: 
                              grade === "A" ? "#10b981" :
                              grade === "B" ? "#3b82f6" :
                              grade === "C" ? "#f59e0b" :
                              grade === "D" ? "#f97316" :
                              "#ef4444"
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="BarChart3" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No grade data available</p>
            </div>
          )}
        </div>

        {/* Recent Attendance */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Calendar" className="w-5 h-5 mr-2 text-primary" />
            Recent Attendance
          </h3>
          {recentAttendance.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentAttendance.map(record => {
                const student = students.find(s => s.Id.toString() === record.studentId);
                if (!student) return null;

                return (
                  <div key={record.Id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(record.date), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        record.status === "present" ? "success" :
                        record.status === "late" ? "warning" :
                        "error"
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No attendance data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Trophy" className="w-5 h-5 mr-2 text-primary" />
          Class Performance Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subjects */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Subjects Taught</h4>
            <div className="space-y-2">
              {[...new Set(grades.map(g => g.subject))].slice(0, 5).map(subject => {
                const subjectGrades = grades.filter(g => g.subject === subject);
                const avgScore = subjectGrades.length > 0 
                  ? subjectGrades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / subjectGrades.length
                  : 0;
                
                return (
                  <div key={subject} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{subject}</span>
                    <Badge variant={avgScore >= 80 ? "success" : avgScore >= 70 ? "warning" : "error"}>
                      {Math.round(avgScore)}%
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grade Levels */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Grade Levels</h4>
            <div className="space-y-2">
              {[...new Set(students.map(s => s.grade))].map(grade => {
                const gradeStudents = students.filter(s => s.grade === grade);
                return (
                  <div key={grade} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Grade {grade}</span>
                    <Badge variant="info">{gradeStudents.length} students</Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sections */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Sections</h4>
            <div className="space-y-2">
              {[...new Set(students.map(s => s.section))].map(section => {
                const sectionStudents = students.filter(s => s.section === section);
                return (
                  <div key={section} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Section {section}</span>
                    <Badge variant="default">{sectionStudents.length} students</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;