import Link from 'next/link';

interface SignUpLinkProps {
  className?: string;
}

export default function SignUpLink({ className = '' }: SignUpLinkProps) {
  return (
    <div className={`text-center ${className}`}>
      <span className="text-lg text-white font-['Fira_Sans']">
        Don't have an account yet?{' '}
        <Link
          href="/auth/signup"
          className="text-[#FFE478] hover:text-[#FFE478]/80 transition-colors"
        >
          Sign up
        </Link>
      </span>
    </div>
  );
}
