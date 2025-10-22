import InputField from './InputField';

interface NameFieldsProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  className?: string;
}

export default function NameFields({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  className = ''
}: NameFieldsProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="flex-1">
        <InputField
          label="First Name"
          type="text"
          value={firstName}
          onChange={onFirstNameChange}
          placeholder="First Name"
        />
      </div>
      <div className="flex-1">
        <InputField
          label="Last Name"
          type="text"
          value={lastName}
          onChange={onLastNameChange}
          placeholder="Last Name"
        />
      </div>
    </div>
  );
}
