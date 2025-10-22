import Link from 'next/link';
import Logo from '../auth/Logo';
import SearchBar from './SearchBar';
import UserProfile from './UserProfile';

interface HeaderProps {
  onSearch: (query: string) => void;
  className?: string;
}

export default function Header({ onSearch, className = '' }: HeaderProps) {
  return (
    <header className={`py-6 border-b border-[rgba(230,221,214,0.2)] ${className}`}>
      <div className="flex items-center justify-between gap-12">
        {/* Left Section - Logo and Search */}
        <div className="flex items-center gap-6 flex-1">
          <Logo />
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Right Section - User Profile and New Post Button */}
        <div className="flex items-center gap-6">
          <UserProfile />
          <Link
            href="/recipes/new"
            className="flex items-center gap-1.5 px-4 py-3 bg-[#FFE478] text-[#0D0702] rounded-xl font-semibold text-base font-['Fira_Sans'] hover:bg-[#FFE478]/90 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#0D0702]"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            New post
          </Link>
        </div>
      </div>
    </header>
  );
}
