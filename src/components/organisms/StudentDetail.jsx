import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StudentAvatar from "@/components/molecules/StudentAvatar";
import GradeDisplay from "@/components/molecules/GradeDisplay";
import AttendanceRate from "@/components/molecules/AttendanceRate";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { format } from "date-fns";
import Chart from "react-apexcharts";

const StudentDetail = ({ isOpen, onClose, student }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      if (!student) return;
      
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

    if (isOpen) {
      loadStudentData();
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: "User" },
    { id: "grades", label: "Grades", icon: "BookOpen" },
    { id: "attendance", label: "Attendance", icon: "Calendar" }
  ];

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary to-blue-600 text-white">
          <div className="flex items-center space-x-4">
            <StudentAvatar
              photoUrl={student.photoUrl}
              firstName={student.firstName}
              lastName={student.lastName}
              size="lg"
            />
            <div>
              <h2 className="text-2xl font-bold">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-blue-100">{student.studentId}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={student.status === "active" ? "success" : "error"}>
                  {student.status}
                </Badge>
                <Badge variant="info">Grade {student.grade}</Badge>
                <Badge variant="default">Section {student.section}</Badge>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                  <div className="text-sm text-blue-600 mb-1">Grade Average</div>
                  {loading ? (
                    <div className="h-16 bg-blue-200 rounded animate-pulse"></div>
                  ) : (
                    <GradeDisplay grades={grades} />
                  )}
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                  <div className="text-sm text-green-600 mb-1">Attendance Rate</div>
                  {loading ? (
                    <div className="h-16 bg-green-200 rounded animate-pulse"></div>
                  ) : (
                    <AttendanceRate attendance={attendance} />
                  )}
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                  <div className="text-sm text-purple-600 mb-1">Total Subjects</div>
                  <div className="text-3xl font-bold text-purple-700">
                    {loading ? "-" : [...new Set(grades.map(g => g.subject))].length}
                  </div>
                  <div className="text-sm text-purple-600">Active</div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="Mail" className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{student.email || "Not provided"}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="Phone" className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">{student.phone || "Not provided"}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="Calendar" className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Enrollment Date</div>
                      <div className="font-medium">
                        {student.enrollmentDate ? format(new Date(student.enrollmentDate), "MMM dd, yyyy") : "Not available"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

{activeTab === "grades" && (
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-100 h-16 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : grades.length > 0 ? (
                <>
                  {/* Grade Progression Chart */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                      <ApperIcon name="TrendingUp" className="w-5 h-5 mr-2 text-primary" />
                      Grade Progression Over Time
                    </h4>
                    <Chart
                      options={{
                        chart: {
                          type: "line",
                          height: 300,
                          toolbar: {
                            show: true,
                            tools: {
                              download: true,
                              zoom: true,
                              zoomin: true,
                              zoomout: true,
                              pan: true,
                              reset: true
                            }
                          },
                          animations: {
                            enabled: true,
                            easing: "easeinout",
                            speed: 800
                          }
                        },
                        stroke: {
                          curve: "smooth",
                          width: 3
                        },
                        colors: ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"],
                        xaxis: {
                          type: "datetime",
                          labels: {
                            format: "MMM dd",
                            style: {
                              colors: "#64748b",
                              fontSize: "12px"
                            }
                          }
                        },
                        yaxis: {
                          min: 0,
                          max: 100,
                          labels: {
                            formatter: (value) => `${Math.round(value)}%`,
                            style: {
                              colors: "#64748b",
                              fontSize: "12px"
                            }
                          },
                          title: {
                            text: "Grade (%)",
                            style: {
                              color: "#64748b",
                              fontSize: "14px",
                              fontWeight: 600
                            }
                          }
                        },
                        tooltip: {
                          x: {
                            format: "MMM dd, yyyy"
                          },
                          y: {
                            formatter: (value) => `${Math.round(value)}%`
                          }
                        },
                        legend: {
                          position: "top",
                          horizontalAlign: "left",
                          fontSize: "14px",
                          fontWeight: 500,
                          markers: {
                            width: 12,
                            height: 12,
                            radius: 6
                          }
                        },
                        grid: {
                          borderColor: "#e5e7eb",
                          strokeDashArray: 4
                        },
                        markers: {
                          size: 5,
                          hover: {
                            size: 7
                          }
                        },
                        fill: {
                          type: "gradient",
                          gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.4,
                            opacityTo: 0.1,
                            stops: [0, 90, 100]
                          }
                        }
                      }}
                      series={(() => {
                        const gradesBySubject = grades.reduce((acc, grade) => {
                          if (!acc[grade.subject]) acc[grade.subject] = [];
                          acc[grade.subject].push(grade);
                          return acc;
                        }, {});

                        Object.keys(gradesBySubject).forEach(subject => {
                          gradesBySubject[subject].sort((a, b) => new Date(a.date) - new Date(b.date));
                        });

                        return Object.entries(gradesBySubject).map(([subject, subjectGrades]) => ({
                          name: subject,
                          data: subjectGrades.map(g => ({
                            x: new Date(g.date).getTime(),
                            y: Math.round((g.score / g.maxScore) * 100)
                          }))
                        }));
                      })()}
                      type="line"
                      height={300}
                    />
                  </div>

                  {/* Grade Table */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grade
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {grades.map(grade => {
                          const percentage = Math.round((grade.score / grade.maxScore) * 100);
                          const letterGrade = percentage >= 90 ? "A" : percentage >= 80 ? "B" : percentage >= 70 ? "C" : percentage >= 60 ? "D" : "F";
                          const gradeVariant = percentage >= 80 ? "success" : percentage >= 70 ? "warning" : "error";
                          
                          return (
                            <tr key={grade.Id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {grade.subject}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {grade.score}/{grade.maxScore}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={gradeVariant}>
                                  {letterGrade} ({percentage}%)
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {format(new Date(grade.date), "MMM dd, yyyy")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="BookOpen" className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No grades recorded</h3>
                  <p className="text-gray-600">Grades will appear here once they are added.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-100 h-16 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : attendance.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendance
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map(record => {
                          const statusVariant = record.status === "present" ? "success" : record.status === "late" ? "warning" : "error";
                          
                          return (
                            <tr key={record.Id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {format(new Date(record.date), "MMM dd, yyyy")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={statusVariant}>
                                  {record.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {record.notes || "-"}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Calendar" className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No attendance records</h3>
                  <p className="text-gray-600">Attendance records will appear here once they are added.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StudentDetail;