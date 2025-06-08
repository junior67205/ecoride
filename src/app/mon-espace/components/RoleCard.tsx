import React from 'react';

export type RoleCardProps = {
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  selected: boolean;
  onClick: () => void;
};

export default function RoleCard({
  label,
  desc,
  icon: Icon,
  color,
  selected,
  onClick,
}: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all shadow-sm bg-white hover:bg-green-50 focus:outline-none
        ${selected ? `border-green-600 ring-2 ring-green-300 bg-green-50` : 'border-gray-200'}`}
    >
      <Icon className={`h-10 w-10 mb-3 ${selected ? 'text-green-600' : 'text-gray-400'}`} />
      <span
        className={`font-semibold text-lg mb-1 ${selected ? 'text-green-700' : 'text-gray-700'}`}
      >
        {label}
      </span>
      <span className="text-sm text-gray-500 text-center">{desc}</span>
      {selected && (
        <span className="mt-3 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 font-semibold">
          Sélectionné
        </span>
      )}
    </button>
  );
}
