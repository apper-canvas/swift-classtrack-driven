import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const teacherService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("teacher_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "specialization_c" } },
          { field: { Name: "qualifications_c" } },
          { field: { Name: "experience_years_c" } },
          { field: { Name: "hire_date_c" } },
          { field: { Name: "employment_status_c" } },
          { field: { Name: "photo_url_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching teachers:", error?.response?.data?.message || error);
      toast.error("Failed to fetch teachers");
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid teacher ID");
      }

      const response = await apperClient.getRecordById("teacher_c", id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "specialization_c" } },
          { field: { Name: "qualifications_c" } },
          { field: { Name: "experience_years_c" } },
          { field: { Name: "hire_date_c" } },
          { field: { Name: "employment_status_c" } },
          { field: { Name: "photo_url_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching teacher ${id}:`, error?.response?.data?.message || error);
      throw new Error("Teacher not found");
    }
  },

  create: async (teacherData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const payload = {
        records: [
          {
            Name: `${teacherData.first_name_c || ""} ${teacherData.last_name_c || ""}`.trim(),
            first_name_c: teacherData.first_name_c || "",
            last_name_c: teacherData.last_name_c || "",
            email_c: teacherData.email_c || "",
            phone_c: teacherData.phone_c || "",
            department_c: teacherData.department_c || "",
            specialization_c: teacherData.specialization_c || "",
            qualifications_c: teacherData.qualifications_c || "",
            experience_years_c: teacherData.experience_years_c || 0,
            hire_date_c: teacherData.hire_date_c || new Date().toISOString().split('T')[0],
            employment_status_c: teacherData.employment_status_c || "full-time",
            photo_url_c: teacherData.photo_url_c || ""
          }
        ]
      };

      const response = await apperClient.createRecord("teacher_c", payload);

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
          throw new Error("Failed to create teacher");
        }
        return response.results[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating teacher:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, teacherData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid teacher ID");
      }

      const updateData = {
        Id: id
      };

      if (teacherData.first_name_c) updateData.first_name_c = teacherData.first_name_c;
      if (teacherData.last_name_c) updateData.last_name_c = teacherData.last_name_c;
      if (teacherData.first_name_c || teacherData.last_name_c) {
        updateData.Name = `${teacherData.first_name_c || ""} ${teacherData.last_name_c || ""}`.trim();
      }
      if (teacherData.email_c !== undefined) updateData.email_c = teacherData.email_c;
      if (teacherData.phone_c !== undefined) updateData.phone_c = teacherData.phone_c;
      if (teacherData.department_c) updateData.department_c = teacherData.department_c;
      if (teacherData.specialization_c) updateData.specialization_c = teacherData.specialization_c;
      if (teacherData.qualifications_c) updateData.qualifications_c = teacherData.qualifications_c;
      if (teacherData.experience_years_c !== undefined) updateData.experience_years_c = teacherData.experience_years_c;
      if (teacherData.hire_date_c) updateData.hire_date_c = teacherData.hire_date_c;
      if (teacherData.employment_status_c) updateData.employment_status_c = teacherData.employment_status_c;
      if (teacherData.photo_url_c !== undefined) updateData.photo_url_c = teacherData.photo_url_c;

      const payload = { records: [updateData] };

      const response = await apperClient.updateRecord("teacher_c", payload);

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
          throw new Error("Failed to update teacher");
        }
        return response.results[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating teacher:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid teacher ID");
      }

      const response = await apperClient.deleteRecord("teacher_c", { RecordIds: [id] });

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
          throw new Error("Failed to delete teacher");
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting teacher:", error?.response?.data?.message || error);
      throw error;
    }
  }
};
export default teacherService;