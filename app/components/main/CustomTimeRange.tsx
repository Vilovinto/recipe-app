interface CustomTimeRangeProps {
  minTime: string;
  maxTime: string;
  onMinTimeChange: (value: string) => void;
  onMaxTimeChange: (value: string) => void;
  className?: string;
}

export default function CustomTimeRange({
  minTime,
  maxTime,
  onMinTimeChange,
  onMaxTimeChange,
  className = ''
}: CustomTimeRangeProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="text"
        value={minTime}
        onChange={(e) => onMinTimeChange(e.target.value)}
        placeholder="Min"
        className="flex-1 px-1.5 py-1 bg-white/16 border border-[rgba(230,216,214,0.2)] rounded-lg text-[rgba(230,216,214,0.4)] text-[13px] leading-4 font-['Fira_Sans'] focus:outline-none focus:border-[#FFE478]"
      />
      <span className="text-[#E6D8D6] text-[15px] leading-5 font-['Fira_Sans']">
        to
      </span>
      <input
        type="text"
        value={maxTime}
        onChange={(e) => onMaxTimeChange(e.target.value)}
        placeholder="Max"
        className="flex-1 px-1.5 py-1 bg-white/16 border border-[rgba(230,216,214,0.2)] rounded-lg text-[rgba(230,216,214,0.4)] text-[13px] leading-4 font-['Fira_Sans'] focus:outline-none focus:border-[#FFE478]"
      />
    </div>
  );
}
