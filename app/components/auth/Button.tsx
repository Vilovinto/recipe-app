interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'google';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const baseClasses =
    "w-full h-14 rounded-2xl font-['Fira_Sans'] text-lg font-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: 'bg-[#FFE478] text-[#222126] hover:bg-[#FFE478]/90',
    secondary: 'border border-[#6D6665] text-white/60 hover:border-[#8A8F93]',
    google:
      'border border-[#6D6665] text-white/60 hover:border-[#8A8F93] flex items-center justify-center gap-3',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
