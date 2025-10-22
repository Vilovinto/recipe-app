interface FilterRadioProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export default function FilterRadio({ 
  label, 
  checked, 
  onChange, 
  className = '' 
}: FilterRadioProps) {
  return (
    <label className={`flex items-center gap-1.5 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-6 h-6 border-2 border-[#E6D8D6] rounded-full ${
          checked ? 'border-[#FFE478]' : 'bg-transparent'
        } flex items-center justify-center`}>
          {checked && (
            <div className="w-3 h-3 bg-[#FFE478] rounded-full"></div>
          )}
        </div>
      </div>
      <span className="text-[#E6D8D6] text-[15px] leading-5 font-['Fira_Sans']">
        {label}
      </span>
    </label>
  );
}
