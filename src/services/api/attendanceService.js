import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const attendanceService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("attendance_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data?.message || error);
      toast.error("Failed to fetch attendance");
      return [];
    }
  },

  async getByStudentId(studentId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("attendance_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ],
        where: [
          {
            FieldName: "student_id_c",
            Operator: "EqualTo",
            Values: [studentId.toString()]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by student:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(attendanceData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const payload = {
        records: [
          {
            Name: `Attendance ${attendanceData.student_id_c || ""} ${attendanceData.date_c || ""}`,
            student_id_c: attendanceData.student_id_c || "",
            date_c: attendanceData.date_c || new Date().toISOString().split('T')[0],
            status_c: attendanceData.status_c || "present",
            notes_c: attendanceData.notes_c || ""
          }
        ]
      };

      const response = await apperClient.createRecord("attendance_c", payload);

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
          throw new Error("Failed to create attendance record");
        }
        return response.results[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating attendance:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, attendanceData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const updateData = {
        Id: id
      };

      if (attendanceData.student_id_c) updateData.student_id_c = attendanceData.student_id_c;
      if (attendanceData.date_c) updateData.date_c = attendanceData.date_c;
      if (attendanceData.status_c) updateData.status_c = attendanceData.status_c;
      if (attendanceData.notes_c !== undefined) updateData.notes_c = attendanceData.notes_c;
      if (attendanceData.student_id_c || attendanceData.date_c) {
        updateData.Name = `Attendance ${attendanceData.student_id_c || ""} ${attendanceData.date_c || ""}`;
      }

      const payload = { records: [updateData] };

      const response = await apperClient.updateRecord("attendance_c", payload);

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
          throw new Error("Failed to update attendance record");
        }
        return response.results[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating attendance:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.deleteRecord("attendance_c", { RecordIds: [id] });

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
          throw new Error("Failed to delete attendance record");
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting attendance:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async markAttendance(studentId, date, status, notes = "") {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      // Check if record exists
      const existingResponse = await apperClient.fetchRecords("attendance_c", {
        fields: [{ field: { Name: "Name" } }],
        where: [
          {
            FieldName: "student_id_c",
            Operator: "EqualTo",
            Values: [studentId.toString()]
          },
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [date]
          }
        ]
      });

      if (existingResponse.success && existingResponse.data && existingResponse.data.length > 0) {
        // Update existing record
        return await this.update(existingResponse.data[0].Id, {
          status_c: status,
          notes_c: notes
        });
      } else {
        // Create new record
        return await this.create({
          student_id_c: studentId.toString(),
          date_c: date,
          status_c: status,
          notes_c: notes
        });
      }
    } catch (error) {
      console.error("Error marking attendance:", error?.response?.data?.message || error);
      throw error;
    }
  }
};