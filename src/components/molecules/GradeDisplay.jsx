import Badge from "@/components/atoms/Badge";

const GradeDisplay = ({ grades }) => {
  if (!grades || grades.length === 0) {
    return <span className="text-gray-500">No grades</span>;
  }

  const average = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore * 100), 0) / grades.length;
  
  const getLetterGrade = (avg) => {
    if (avg >= 90) return "A";
    if (avg >= 80) return "B";
    if (avg >= 70) return "C";
    if (avg >= 60) return "D";
    return "F";
  };

  const getGradeVariant = (avg) => {
    if (avg >= 80) return "success";
    if (avg >= 70) return "warning";
    return "error";
  };

  const letterGrade = getLetterGrade(average);
  const variant = getGradeVariant(average);

  return (
    <div className="text-center">
      <div className={`text-2xl font-bold mb-1 ${
        average >= 80 ? "text-success" : 
        average >= 70 ? "text-warning" : "text-error"
      }`}>
        {letterGrade}
      </div>
      <Badge variant={variant}>
        {Math.round(average)}%
      </Badge>
    </div>
  );
};

export default GradeDisplay;