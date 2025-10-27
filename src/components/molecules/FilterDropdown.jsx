import Select from "@/components/atoms/Select";

const FilterDropdown = ({ label, value, onChange, options, placeholder = "All" }) => {
  return (
    <div className="min-w-[120px]">
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
<option key="filter-placeholder" value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default FilterDropdown;