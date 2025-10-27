import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import StudentAvatar from "@/components/molecules/StudentAvatar";

const TeacherModal = ({ isOpen, onClose, teacher, onSave, mode = "create" }) => {
  const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    department_c: "",
    specialization_c: "",
    qualifications_c: "",
    experience_years_c: 0,
    hire_date_c: "",
    employment_status_c: "full-time",
    photo_url_c: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
if (teacher && mode === "edit") {
      setFormData({
        first_name_c: teacher.first_name_c || "",
        last_name_c: teacher.last_name_c || "",
        email_c: teacher.email_c || "",
        phone_c: teacher.phone_c || "",
        department_c: teacher.department_c || "",
        specialization_c: teacher.specialization_c || "",
        qualifications_c: teacher.qualifications_c || "",
        experience_years_c: teacher.experience_years_c || 0,
        hire_date_c: teacher.hire_date_c || "",
        employment_status_c: teacher.employment_status_c || "full-time",
        photo_url_c: teacher.photo_url_c || ""
      });
    } else if (mode === "create") {
      setFormData({
        first_name_c: "",
        last_name_c: "",
        email_c: "",
        phone_c: "",
        department_c: "",
        specialization_c: "",
        qualifications_c: "",
        experience_years_c: 0,
        hire_date_c: "",
        employment_status_c: "full-time",
        photo_url_c: ""
      });
    }
  }, [teacher, mode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving teacher:", error);
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
            {mode === "create" ? "Add New Teacher" : "Edit Teacher"}
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
                onChange={(e) => handleChange("photoUrl", e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a URL for the teacher's photo (optional)
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
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email *</Label>
<Input
                type="email"
                required
                placeholder="teacher@school.edu"
                value={formData.email_c}
                onChange={(e) => handleChange("email_c", e.target.value)}
                value={formData.email}
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
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Department</Label>
              <Select
value={formData.department_c}
                onChange={(e) => handleChange("department_c", e.target.value)}
              >
                <option value="">Select department</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Arts">Arts</option>
                <option value="Physical Education">Physical Education</option>
              </Select>
            </div>
            <div>
              <Label>Specialization</Label>
              <Input
type="text"
                placeholder="e.g., Algebra & Calculus"
                value={formData.specialization_c}
                onChange={(e) => handleChange("specialization_c", e.target.value)}
              />
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <Label>Qualifications</Label>
            <Input
              type="text"
              placeholder="e.g., M.Ed. Mathematics, B.Sc. Mathematics"
value={formData.qualifications_c}
              onChange={(e) => handleChange("qualifications_c", e.target.value)}
            />
          </div>

          {/* Employment Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Experience (Years)</Label>
              <Input
                type="number"
                min="0"
                placeholder="0"
value={formData.experience_years_c}
                onChange={(e) => handleChange("experience_years_c", parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Hire Date</Label>
              <Input
                type="date"
value={formData.hire_date_c}
                onChange={(e) => handleChange("hire_date_c", e.target.value)}
              />
            </div>
            <div>
              <Label>Employment Status</Label>
              <Select
value={formData.employment_status_c}
                onChange={(e) => handleChange("employment_status_c", e.target.value)}
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
              </Select>
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
                  {mode === "create" ? "Add Teacher" : "Save Changes"}
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

export default TeacherModal;