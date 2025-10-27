import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) throw new Error("Student not found");
    return { ...student };
  },

  async create(studentData) {
    await delay(400);
    const newId = Math.max(...students.map(s => s.Id)) + 1;
    const newStudent = {
      Id: newId,
      ...studentData,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: "active"
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay(350);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) throw new Error("Student not found");
    
    students[index] = { ...students[index], ...studentData };
    return { ...students[index] };
  },

  async delete(id) {
    await delay(250);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) throw new Error("Student not found");
    
    const deletedStudent = students[index];
    students.splice(index, 1);
    return { ...deletedStudent };
  }
};