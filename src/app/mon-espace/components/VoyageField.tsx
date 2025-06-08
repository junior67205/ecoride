import React from 'react';

type VoyageFieldProps = {
  label: string;
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
};

export default function VoyageField({
  label,
  id,
  name,
  type,
  value,
  onChange,
  required = false,
  className = '',
}: VoyageFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`input input-bordered px-3 py-2 rounded border ${className}`}
        required={required}
      />
    </div>
  );
}
