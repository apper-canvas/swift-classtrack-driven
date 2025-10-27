import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
  async getAll() {
    await delay(250);
    return [...grades];
  },

  async getByStudentId(studentId) {
    await delay(200);
    return grades.filter(g => g.studentId === studentId.toString());
  },

  async create(gradeData) {
    await delay(300);
    const newId = Math.max(...grades.map(g => g.Id)) + 1;
    const newGrade = {
      Id: newId,
      ...gradeData,
      date: new Date().toISOString().split('T')[0]
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(300);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) throw new Error("Grade not found");
    
    grades[index] = { ...grades[index], ...gradeData };
    return { ...grades[index] };
  },

  async delete(id) {
    await delay(200);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) throw new Error("Grade not found");
    
    const deletedGrade = grades[index];
    grades.splice(index, 1);
    return { ...deletedGrade };
  }
};