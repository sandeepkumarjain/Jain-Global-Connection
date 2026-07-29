import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  showStrengthIndicator?: boolean;
  showCriteria?: boolean;
  leftIcon?: React.ReactNode;
  id?: string;
  name?: string;
  autoComplete?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  className = '',
  inputClassName = '',
  showStrengthIndicator = false,
  showCriteria = true,
  leftIcon = <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />,
  id,
  name,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex items-center">
        {leftIcon}
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full ${leftIcon ? 'pl-9' : 'pl-3'} pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium ${inputClassName}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? 'Hide Password' : 'Show Password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors focus:outline-none cursor-pointer rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {showStrengthIndicator && (
        <PasswordStrengthIndicator password={value} showCriteria={showCriteria} />
      )}
    </div>
  );
};
