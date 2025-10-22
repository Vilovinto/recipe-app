import { useState } from 'react';
import NameFields from './NameFields';
import InputField from './InputField';
import Button from './Button';

interface SignUpFormProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
  loading?: boolean;
  className?: string;
}

export default function SignUpForm({ 
  onSubmit, 
  loading = false, 
  className = '' 
}: SignUpFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* Name Fields */}
      <NameFields
        firstName={firstName}
        lastName={lastName}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
      />

      {/* Email Field */}
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="Email"
      />

      {/* Password Field */}
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Password"
        showPasswordToggle
      />

      {/* Confirm Password Field */}
      <InputField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        placeholder="Confirm Password"
        showPasswordToggle
      />

      {/* Sign Up Button */}
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Signing up...' : 'Sign up'}
      </Button>
    </form>
  );
}
