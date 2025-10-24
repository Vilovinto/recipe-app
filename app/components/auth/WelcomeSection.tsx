interface WelcomeSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function WelcomeSection({
  title = 'Welcome Back!',
  subtitle = "We're thrilled to have you",
  className = '',
}: WelcomeSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h1 className="text-2xl font-medium text-white font-['Fira_Sans']">
        {title}
      </h1>
      <p className="text-lg text-[#6D6665] font-['Fira_Sans']">{subtitle}</p>
    </div>
  );
}
