import Link from 'next/link';

interface SignInLinkProps {
  className?: string;
}

export default function SignInLink({ className = '' }: SignInLinkProps) {
  return (
    <div className={`text-center ${className}`}>
      <span className="text-lg text-white font-['Fira_Sans']">
        Already have an account?{' '}
        <Link
          href="/auth/signin"
          className="text-[#FFE478] hover:text-[#FFE478]/80 transition-colors"
        >
          Sign in
        </Link>
      </span>
    </div>
  );
}
