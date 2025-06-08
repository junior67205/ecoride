type RoleCurrentProps = {
  currentRole: string;
  onEdit: () => void;
};

export default function RoleCurrent({ currentRole, onEdit }: RoleCurrentProps) {
  return (
    <div className="mb-8 flex items-center gap-3 justify-between">
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-700">Votre rôle actuel :</span>
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold capitalize shadow-sm border border-green-200">
          {currentRole}
        </span>
      </div>
      <button
        className="btn btn-outline border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 px-4 py-1 rounded text-sm font-medium"
        onClick={onEdit}
      >
        Modifier mon rôle
      </button>
    </div>
  );
}
