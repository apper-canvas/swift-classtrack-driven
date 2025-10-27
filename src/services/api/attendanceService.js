import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(250);
    return [...attendance];
  },

  async getByStudentId(studentId) {
    await delay(200);
    return attendance.filter(a => a.studentId === studentId.toString());
  },

  async create(attendanceData) {
    await delay(300);
    const newId = Math.max(...attendance.map(a => a.Id)) + 1;
    const newAttendance = {
      Id: newId,
      ...attendanceData,
      date: new Date().toISOString().split('T')[0]
    };
    attendance.push(newAttendance);
    return { ...newAttendance };
  },

  async update(id, attendanceData) {
    await delay(300);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error("Attendance record not found");
    
    attendance[index] = { ...attendance[index], ...attendanceData };
    return { ...attendance[index] };
  },

  async delete(id) {
    await delay(200);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error("Attendance record not found");
    
    const deletedAttendance = attendance[index];
    attendance.splice(index, 1);
    return { ...deletedAttendance };
  },

  async markAttendance(studentId, date, status, notes = "") {
    await delay(250);
    const existingIndex = attendance.findIndex(
      a => a.studentId === studentId.toString() && a.date === date
    );

    if (existingIndex >= 0) {
      attendance[existingIndex] = {
        ...attendance[existingIndex],
        status,
        notes
      };
      return { ...attendance[existingIndex] };
    } else {
      const newId = Math.max(...attendance.map(a => a.Id)) + 1;
      const newAttendance = {
        Id: newId,
        studentId: studentId.toString(),
        date,
        status,
        notes
      };
      attendance.push(newAttendance);
      return { ...newAttendance };
    }
  }
};