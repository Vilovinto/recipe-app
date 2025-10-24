interface DividerProps {
  text?: string;
  className?: string;
}

export default function Divider({
  text = 'or continue with',
  className = '',
}: DividerProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-[#635B57]"></div>
      <span className="text-lg text-white/60 font-['Fira_Sans']">{text}</span>
      <div className="flex-1 h-px bg-[#635B57]"></div>
    </div>
  );
}
