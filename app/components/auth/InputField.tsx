import { useState } from 'react';

interface InputFieldProps {
  label: string;
  type: 'email' | 'password' | 'text';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showPasswordToggle?: boolean;
  className?: string;
}

export default function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  showPasswordToggle = false,
  className = '',
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    showPasswordToggle && type === 'password'
      ? showPassword
        ? 'text'
        : 'password'
      : type;

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm text-white font-['Fira_Sans']">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-14 px-4 bg-transparent border border-[#6D6665] rounded-xl text-white placeholder-[#8A8F93] font-['Fira_Sans'] text-lg focus:outline-none focus:border-[#FFE478] transition-colors"
          placeholder={placeholder}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#6D6665] hover:text-white transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
