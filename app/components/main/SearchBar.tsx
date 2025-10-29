import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
  instant?: boolean; // call onSearch on each keystroke
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search...',
  initialValue = '',
  className = '',
  instant = true,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (instant) {
      onSearch(newQuery);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex-1 max-w-[400px] ${className}`}
    >
      <div className="relative">
        <div className="flex items-center px-3 py-3 bg-white/16 border border-[rgba(230,221,214,0.2)] rounded-xl">
          <div className="flex items-center gap-1.5 flex-1">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#E5DDD7]"
            >
              <path
                d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-white placeholder-[rgba(235,220,209,0.4)] font-['Fira_Sans'] text-base focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
