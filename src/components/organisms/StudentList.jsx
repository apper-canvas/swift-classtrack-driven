import { useState } from "react";
import StudentCard from "@/components/organisms/StudentCard";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const StudentList = ({ students, onView, onEdit, onDelete }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Get unique values for filters
  const grades = [...new Set(students.map(s => s.grade))].map(g => ({ value: g, label: `Grade ${g}` }));
  const sections = [...new Set(students.map(s => s.section))].map(s => ({ value: s, label: `Section ${s}` }));
  const statuses = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  // Filter students
  const filteredStudents = students.filter(student => {
    return (
      (!gradeFilter || student.grade === gradeFilter) &&
      (!sectionFilter || student.section === sectionFilter) &&
      (!statusFilter || student.status === statusFilter)
    );
  });

  const clearFilters = () => {
    setGradeFilter("");
    setSectionFilter("");
    setStatusFilter("");
  };

  const hasActiveFilters = gradeFilter || sectionFilter || statusFilter;

  return (
    <div className="space-y-6">
      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <FilterDropdown
            value={gradeFilter}
            onChange={setGradeFilter}
            options={grades}
            placeholder="All Grades"
          />
          <FilterDropdown
            value={sectionFilter}
            onChange={setSectionFilter}
            options={sections}
            placeholder="All Sections"
          />
          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={statuses}
            placeholder="All Status"
          />
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <ApperIcon name="X" className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {filteredStudents.length} students
          </span>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-l-md transition-colors duration-200 ${
                viewMode === "grid" 
                  ? "bg-primary text-white" 
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}
            >
              <ApperIcon name="Grid3X3" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-r-md transition-colors duration-200 ${
                viewMode === "list" 
                  ? "bg-primary text-white" 
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}
            >
              <ApperIcon name="List" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Student Grid/List */}
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      }>
        {filteredStudents.map(student => (
          <StudentCard
            key={student.Id}
            student={student}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentList;