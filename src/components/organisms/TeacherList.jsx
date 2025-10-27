import { useState } from "react";
import TeacherCard from "@/components/organisms/TeacherCard";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TeacherList = ({ teachers, onView, onEdit, onDelete }) => {
  const [filters, setFilters] = useState({
    department: "",
    experience: "",
    status: ""
  });

  const departmentOptions = ["Mathematics", "Science", "English", "History", "Arts", "Physical Education"];
  const experienceOptions = [
    { value: "0-5", label: "0-5 years" },
    { value: "5-10", label: "5-10 years" },
    { value: "10+", label: "10+ years" }
  ];
  const statusOptions = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" }
  ];

  const filteredTeachers = teachers.filter(teacher => {
    if (filters.department && teacher.department !== filters.department) return false;
    if (filters.status && teacher.employmentStatus !== filters.status) return false;
    if (filters.experience) {
      const exp = teacher.experienceYears || 0;
      if (filters.experience === "0-5" && exp > 5) return false;
      if (filters.experience === "5-10" && (exp < 5 || exp > 10)) return false;
      if (filters.experience === "10+" && exp < 10) return false;
    }
    return true;
  });

  const clearFilters = () => {
    setFilters({ department: "", experience: "", status: "" });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          label="Department"
          value={filters.department}
          onChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
          options={departmentOptions}
        />
        <FilterDropdown
          label="Experience"
          value={filters.experience}
          onChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}
          options={experienceOptions}
        />
        <FilterDropdown
          label="Status"
          value={filters.status}
          onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          options={statusOptions}
        />
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <ApperIcon name="X" className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Teacher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map(teacher => (
          <TeacherCard
            key={teacher.Id}
            teacher={teacher}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TeacherList;