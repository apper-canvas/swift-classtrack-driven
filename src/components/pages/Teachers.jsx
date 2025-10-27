import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import TeacherList from "@/components/organisms/TeacherList";
import TeacherModal from "@/components/organisms/TeacherModal";
import TeacherDetail from "@/components/organisms/TeacherDetail";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { teacherService } from "@/services/api/teacherService";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (teacherData) => {
    try {
      const newTeacher = await teacherService.create(teacherData);
      setTeachers(prev => [newTeacher, ...prev]);
      toast.success("Teacher added successfully!");
    } catch (err) {
      toast.error("Failed to add teacher");
      throw err;
    }
  };

  const handleEditTeacher = async (teacherData) => {
    try {
      const updatedTeacher = await teacherService.update(selectedTeacher.Id, teacherData);
      setTeachers(prev => prev.map(t => t.Id === updatedTeacher.Id ? updatedTeacher : t));
      toast.success("Teacher updated successfully!");
    } catch (err) {
      toast.error("Failed to update teacher");
      throw err;
    }
  };

  const handleDeleteTeacher = async () => {
    if (!deleteConfirm) return;

    try {
      await teacherService.delete(deleteConfirm.Id);
      setTeachers(prev => prev.filter(t => t.Id !== deleteConfirm.Id));
      toast.success("Teacher deleted successfully!");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error("Failed to delete teacher");
    }
  };

  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (teacher) => {
    setDeleteConfirm(teacher);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Filter teachers based on search term
  const filteredTeachers = useMemo(() => {
    if (!searchTerm) return teachers;
    
    return teachers.filter(teacher => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        teacher.email?.toLowerCase().includes(searchLower) ||
        teacher.department?.toLowerCase().includes(searchLower) ||
        teacher.specialization?.toLowerCase().includes(searchLower)
      );
    });
  }, [teachers, searchTerm]);

  if (loading) return <Loading type="cards" />;
  
  if (error) return <Error message={error} onRetry={loadTeachers} />;

  if (teachers.length === 0) {
    return (
      <Empty
        title="No teachers found"
        description="Get started by adding your first teacher to the system."
        actionLabel="Add First Teacher"
        onAction={() => setIsAddModalOpen(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600">
            Manage your faculty and teacher information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 sm:flex-initial">
            <SearchBar onSearch={handleSearch} />
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="hidden sm:flex">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Teacher List */}
      {filteredTeachers.length === 0 && searchTerm ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            No teachers found for "{searchTerm}"
          </div>
        </div>
      ) : (
        <TeacherList
          teachers={filteredTeachers}
          onView={handleViewTeacher}
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

      {/* Add Teacher Modal */}
      <TeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTeacher}
        mode="create"
      />

      {/* Edit Teacher Modal */}
      <TeacherModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teacher={selectedTeacher}
        onSave={handleEditTeacher}
        mode="edit"
      />

      {/* Teacher Detail Modal */}
      <TeacherDetail
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        teacher={selectedTeacher}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {deleteConfirm.firstName} {deleteConfirm.lastName}? 
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
                onClick={handleDeleteTeacher}
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

export default Teachers;