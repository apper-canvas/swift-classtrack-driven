import teachersData from "@/services/mockData/teachers.json";

let teachers = [...teachersData];

const teacherService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...teachers];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid teacher ID");
    }

    const teacher = teachers.find(t => t.Id === id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    return { ...teacher };
  },

  create: async (teacherData) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newId = teachers.length > 0 
      ? Math.max(...teachers.map(t => t.Id)) + 1 
      : 1;

    const newTeacher = {
      Id: newId,
      firstName: teacherData.firstName || "",
      lastName: teacherData.lastName || "",
      email: teacherData.email || "",
      phone: teacherData.phone || "",
      department: teacherData.department || "",
      specialization: teacherData.specialization || "",
      qualifications: teacherData.qualifications || "",
      experienceYears: teacherData.experienceYears || 0,
      hireDate: teacherData.hireDate || new Date().toISOString().split('T')[0],
      employmentStatus: teacherData.employmentStatus || "full-time",
      photoUrl: teacherData.photoUrl || ""
    };

    teachers = [newTeacher, ...teachers];
    return { ...newTeacher };
  },

  update: async (id, teacherData) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid teacher ID");
    }

    const index = teachers.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Teacher not found");
    }

    const updatedTeacher = {
      ...teachers[index],
      firstName: teacherData.firstName || teachers[index].firstName,
      lastName: teacherData.lastName || teachers[index].lastName,
      email: teacherData.email || teachers[index].email,
      phone: teacherData.phone || teachers[index].phone,
      department: teacherData.department || teachers[index].department,
      specialization: teacherData.specialization || teachers[index].specialization,
      qualifications: teacherData.qualifications || teachers[index].qualifications,
      experienceYears: teacherData.experienceYears !== undefined ? teacherData.experienceYears : teachers[index].experienceYears,
      hireDate: teacherData.hireDate || teachers[index].hireDate,
      employmentStatus: teacherData.employmentStatus || teachers[index].employmentStatus,
      photoUrl: teacherData.photoUrl !== undefined ? teacherData.photoUrl : teachers[index].photoUrl
    };

    teachers[index] = updatedTeacher;
    return { ...updatedTeacher };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid teacher ID");
    }

    const index = teachers.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Teacher not found");
    }

    teachers = teachers.filter(t => t.Id !== id);
    return { success: true };
  }
};

export { teacherService };