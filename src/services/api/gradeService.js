import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const gradeService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("grade_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "term_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
      toast.error("Failed to fetch grades");
      return [];
    }
  },

  async getByStudentId(studentId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords("grade_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "term_c" } }
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
      console.error("Error fetching grades by student:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(gradeData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const payload = {
        records: [
          {
            Name: `${gradeData.subject_c || ""} - ${gradeData.student_id_c || ""}`,
            student_id_c: gradeData.student_id_c || "",
            subject_c: gradeData.subject_c || "",
            score_c: gradeData.score_c || 0,
            max_score_c: gradeData.max_score_c || 100,
            date_c: gradeData.date_c || new Date().toISOString().split('T')[0],
            term_c: gradeData.term_c || ""
          }
        ]
      };

      const response = await apperClient.createRecord("grade_c", payload);

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
          throw new Error("Failed to create grade");
        }
        return response.results[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, gradeData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const updateData = {
        Id: id
      };

      if (gradeData.student_id_c) updateData.student_id_c = gradeData.student_id_c;
      if (gradeData.subject_c) updateData.subject_c = gradeData.subject_c;
      if (gradeData.score_c !== undefined) updateData.score_c = gradeData.score_c;
      if (gradeData.max_score_c !== undefined) updateData.max_score_c = gradeData.max_score_c;
      if (gradeData.date_c) updateData.date_c = gradeData.date_c;
      if (gradeData.term_c) updateData.term_c = gradeData.term_c;
      if (gradeData.subject_c || gradeData.student_id_c) {
        updateData.Name = `${gradeData.subject_c || ""} - ${gradeData.student_id_c || ""}`;
      }

      const payload = { records: [updateData] };

      const response = await apperClient.updateRecord("grade_c", payload);

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
          throw new Error("Failed to update grade");
        }
        return response.results[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.deleteRecord("grade_c", { RecordIds: [id] });

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
          throw new Error("Failed to delete grade");
}
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      throw error;
    }
  }
};