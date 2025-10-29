import { useState } from 'react';
import toast from 'react-hot-toast';
import InputField from './InputField';
import Button from './Button';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  loading?: boolean;
  className?: string;
}

export default function LoginForm({
  onSubmit,
  loading = false,
  className = '',
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* Email Field */}
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="Email"
      />

      {/* Password Field */}
      <div className="space-y-4">
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Password"
          showPasswordToggle
        />
        <div className="text-right">
          <button
            type="button"
            onClick={() => toast.error('Password recovery is not available yet')}
            className="text-lg text-[#FFE478] hover:text-[#FFE478]/80 transition-colors font-['Fira_Sans'] cursor-pointer"
          >
            Forgot password ?
          </button>
        </div>
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
