interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="w-8 h-8 relative">
        {/* Logo Icon - Fork and Spoon */}
        <div className="absolute inset-0">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Fork */}
            <path
              d="M8 2V30M8 2H10M8 2H6M8 6H10M8 10H10M8 14H10"
              stroke="#FFE478"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Spoon */}
            <path
              d="M20 2C20 6 20 10 20 14C20 18 20 22 20 26C20 28 22 30 24 30C26 30 28 28 28 26C28 24 26 22 24 22C22 22 20 24 20 26"
              stroke="#FFE478"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <span className="text-2xl font-medium text-[#FFE478] font-['Prompt'] tracking-tight">
        RecipeFinder
      </span>
    </div>
  );
}
