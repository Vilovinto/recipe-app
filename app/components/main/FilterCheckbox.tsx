interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function FilterCheckbox({
  label,
  checked,
  onChange,
  className = '',
}: FilterCheckboxProps) {
  return (
    <label className={`flex items-center gap-1.5 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-6 h-6 border-2 border-[#E6D8D6] rounded ${
            checked ? 'bg-[#FFE478] border-[#FFE478]' : 'bg-transparent'
          } flex items-center justify-center`}
        >
          {checked && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#2D2726]"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-[#E6D8D6] text-[15px] leading-5 font-['Fira_Sans']">
        {label}
      </span>
    </label>
  );
}
