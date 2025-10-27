import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import StudentAvatar from "@/components/molecules/StudentAvatar";

const StudentModal = ({ isOpen, onClose, student, onSave, mode = "create" }) => {
  const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    student_id_c: "",
    grade_c: "",
    section_c: "",
    email_c: "",
    phone_c: "",
    photo_url_c: ""
  });
  const [loading, setLoading] = useState(false);

useEffect(() => {
    if (student && mode === "edit") {
      setFormData({
        first_name_c: student.first_name_c || "",
        last_name_c: student.last_name_c || "",
        student_id_c: student.student_id_c || "",
        grade_c: student.grade_c || "",
        section_c: student.section_c || "",
        email_c: student.email_c || "",
        phone_c: student.phone_c || "",
        photo_url_c: student.photo_url_c || ""
      });
    } else if (mode === "create") {
      setFormData({
        first_name_c: "",
        last_name_c: "",
        student_id_c: "",
        grade_c: "",
        section_c: "",
        email_c: "",
        phone_c: "",
        photo_url_c: ""
      });
    }
  }, [student, mode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
if (!formData.first_name_c.trim() || !formData.last_name_c.trim() || !formData.student_id_c.trim()) {
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving student:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "create" ? "Add New Student" : "Edit Student"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo Section */}
          <div className="flex items-center space-x-4">
<StudentAvatar
              photoUrl={formData.photo_url_c}
              firstName={formData.first_name_c}
              lastName={formData.last_name_c}
              size="xl"
            />
            <div className="flex-1">
              <Label>Profile Photo URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/photo.jpg"
value={formData.photo_url_c}
                onChange={(e) => handleChange("photo_url_c", e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a URL for the student's photo (optional)
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name *</Label>
<Input
                type="text"
                required
                placeholder="Enter first name"
                value={formData.first_name_c}
                onChange={(e) => handleChange("first_name_c", e.target.value)}
              />
            </div>
            <div>
              <Label>Last Name *</Label>
              <Input
type="text"
                required
                placeholder="Enter last name"
                value={formData.last_name_c}
                onChange={(e) => handleChange("last_name_c", e.target.value)}
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
<Label>Student ID *</Label>
              <Input
                type="text"
                required
                placeholder="ST001"
                value={formData.student_id_c}
                onChange={(e) => handleChange("student_id_c", e.target.value)}
                onChange={(e) => handleChange("studentId", e.target.value)}
              />
            </div>
            <div>
              <Label>Grade</Label>
              <Select
value={formData.grade_c}
                onChange={(e) => handleChange("grade_c", e.target.value)}
              >
                <option value="">Select grade</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Section</Label>
<Select
                value={formData.section_c}
                onChange={(e) => handleChange("section_c", e.target.value)}
                onChange={(e) => handleChange("section", e.target.value)}
              >
                <option value="">Select section</option>
                {["A", "B", "C", "D"].map(section => (
                  <option key={section} value={section}>Section {section}</option>
                ))}
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
placeholder="student@school.edu"
                value={formData.email_c}
                onChange={(e) => handleChange("email_c", e.target.value)}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
placeholder="(555) 123-4567"
                value={formData.phone_c}
                onChange={(e) => handleChange("phone_c", e.target.value)}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  {mode === "create" ? "Add Student" : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default StudentModal;