import Badge from "@/components/atoms/Badge";

const AttendanceRate = ({ attendance }) => {
  if (!attendance || attendance.length === 0) {
    return <span className="text-gray-500">No data</span>;
  }

  const presentDays = attendance.filter(a => a.status === "present").length;
  const totalDays = attendance.length;
  const rate = Math.round((presentDays / totalDays) * 100);

  const getVariant = (rate) => {
    if (rate >= 95) return "success";
    if (rate >= 85) return "warning";
    return "error";
  };

  return (
    <div className="text-center">
      <div className={`text-2xl font-bold mb-1 ${
        rate >= 95 ? "text-success" : 
        rate >= 85 ? "text-warning" : "text-error"
      }`}>
        {rate}%
      </div>
      <Badge variant={getVariant(rate)}>
        {presentDays}/{totalDays}
      </Badge>
    </div>
  );
};

export default AttendanceRate;