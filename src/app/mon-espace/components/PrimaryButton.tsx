import React from 'react';

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: React.ReactNode;
};

export default function PrimaryButton({
  loading,
  children,
  className = '',
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={`btn btn-primary bg-green-600 text-white rounded py-2 ${className}`}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? 'Chargement...' : children}
    </button>
  );
}
