import ApperIcon from "@/components/ApperIcon";

const StudentAvatar = ({ photoUrl, firstName, lastName, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-2xl"
  };

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`;

  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div className="w-full h-full flex items-center justify-center bg-primary text-white font-medium" 
           style={{ display: photoUrl ? "none" : "flex" }}>
        {initials || <ApperIcon name="User" className="w-1/2 h-1/2" />}
      </div>
    </div>
  );
};

export default StudentAvatar;