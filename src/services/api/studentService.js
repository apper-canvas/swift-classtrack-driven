import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const studentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("student_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "section_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "photo_url_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
      toast.error("Failed to fetch students");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.getRecordById("student_c", id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "section_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "photo_url_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      throw new Error("Student not found");
    }
  },

  async create(studentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const payload = {
        records: [
          {
            Name: `${studentData.first_name_c || ""} ${studentData.last_name_c || ""}`.trim(),
            first_name_c: studentData.first_name_c || "",
            last_name_c: studentData.last_name_c || "",
            student_id_c: studentData.student_id_c || "",
            grade_c: studentData.grade_c || "",
            section_c: studentData.section_c || "",
            email_c: studentData.email_c || "",
            phone_c: studentData.phone_c || "",
            photo_url_c: studentData.photo_url_c || "",
            enrollment_date_c: studentData.enrollment_date_c || new Date().toISOString().split('T')[0],
            status_c: studentData.status_c || "active"
          }
        ]
      };

      const response = await apperClient.createRecord("student_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create student");
        }
        return response.results[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const updateData = {
        Id: id
      };

      if (studentData.first_name_c) updateData.first_name_c = studentData.first_name_c;
      if (studentData.last_name_c) updateData.last_name_c = studentData.last_name_c;
      if (studentData.first_name_c || studentData.last_name_c) {
        updateData.Name = `${studentData.first_name_c || ""} ${studentData.last_name_c || ""}`.trim();
      }
      if (studentData.student_id_c) updateData.student_id_c = studentData.student_id_c;
      if (studentData.grade_c) updateData.grade_c = studentData.grade_c;
      if (studentData.section_c) updateData.section_c = studentData.section_c;
      if (studentData.email_c !== undefined) updateData.email_c = studentData.email_c;
      if (studentData.phone_c !== undefined) updateData.phone_c = studentData.phone_c;
      if (studentData.photo_url_c !== undefined) updateData.photo_url_c = studentData.photo_url_c;
      if (studentData.enrollment_date_c) updateData.enrollment_date_c = studentData.enrollment_date_c;
      if (studentData.status_c) updateData.status_c = studentData.status_c;

      const payload = { records: [updateData] };

      const response = await apperClient.updateRecord("student_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update student");
        }
        return response.results[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.deleteRecord("student_c", { RecordIds: [id] });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete student");
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      throw error;
    }
  }
};