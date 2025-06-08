import React from 'react';

type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionCard({ children, className = '' }: SectionCardProps) {
  return <div className={`bg-white rounded shadow p-6 ${className}`}>{children}</div>;
}
