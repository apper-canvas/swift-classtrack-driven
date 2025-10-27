import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { studentService } from "@/services/api/studentService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StudentModal from "@/components/organisms/StudentModal";
import StudentDetail from "@/components/organisms/StudentDetail";
import StudentList from "@/components/organisms/StudentList";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import SearchBar from "@/components/molecules/SearchBar";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (studentData) => {
    try {
      const newStudent = await studentService.create(studentData);
      setStudents(prev => [newStudent, ...prev]);
      toast.success("Student added successfully!");
    } catch (err) {
      toast.error("Failed to add student");
      throw err;
    }
  };

  const handleEditStudent = async (studentData) => {
    try {
      const updatedStudent = await studentService.update(selectedStudent.Id, studentData);
      setStudents(prev => prev.map(s => s.Id === updatedStudent.Id ? updatedStudent : s));
      toast.success("Student updated successfully!");
    } catch (err) {
      toast.error("Failed to update student");
      throw err;
    }
  };

  const handleDeleteStudent = async () => {
    if (!deleteConfirm) return;

    try {
      await studentService.delete(deleteConfirm.Id);
      setStudents(prev => prev.filter(s => s.Id !== deleteConfirm.Id));
      toast.success("Student deleted successfully!");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error("Failed to delete student");
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (student) => {
    setDeleteConfirm(student);
};

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Filter students based on search term
const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    
    return students.filter(student => {
      const fullName = `${student.first_name_c || ""} ${student.last_name_c || ""}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        student.student_id_c?.toLowerCase().includes(searchLower) ||
        student.email_c?.toLowerCase().includes(searchLower) ||
        student.grade_c?.includes(searchTerm) ||
        student.section_c?.toLowerCase().includes(searchLower)
      );
    });
  }, [students, searchTerm]);

  if (loading) return <Loading type="cards" />;
  
  if (error) return <Error message={error} onRetry={loadStudents} />;

if (students.length === 0) {
    return (
      <Empty
        title="No students found"
        description="Get started by adding your first student to the system."
        actionLabel="Add First Student"
        onAction={() => setIsAddModalOpen(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">
            Manage your class roster and student information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 sm:flex-initial">
            <SearchBar onSearch={handleSearch} />
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="hidden sm:flex">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Student List */}
      {filteredStudents.length === 0 && searchTerm ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            No students found for "{searchTerm}"
          </div>
        </div>
      ) : (
        <StudentList
          students={filteredStudents}
          onView={handleViewStudent}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
)}

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-blue-700 transition-colors duration-200"
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </button>

      {/* Add Student Modal */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddStudent}
        mode="create"
      />

      {/* Edit Student Modal */}
      <StudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={selectedStudent}
        onSave={handleEditStudent}
        mode="edit"
      />

      {/* Student Detail Modal */}
      <StudentDetail
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        student={selectedStudent}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
<p className="text-gray-600 mb-6">
              Are you sure you want to delete {deleteConfirm.first_name_c} {deleteConfirm.last_name_c}?
              This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;