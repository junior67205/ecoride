type RoleSectionProps = {
  currentRole: string;
  editRole: boolean;
  setEditRole: (edit: boolean) => void;
  handleSelect: (role: string) => void;
  role: string;
  roleError: string;
  roleSuccess: string;
  error: string;
  message: string;
};

export default function RoleSection({
  currentRole,
  editRole,
  setEditRole,
  handleSelect,
  role,
  roleError,
  roleSuccess,
  error,
  message,
}: RoleSectionProps) {
  return (
    <section className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Mon rôle</h2>
      {roleError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded font-semibold text-center">
          {roleError}
        </div>
      )}
      {roleSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded font-semibold text-center">
          {roleSuccess}
        </div>
      )}
      {currentRole && !editRole && (
        <div className="mb-6 flex items-center gap-2">
          <span className="font-medium">Votre rôle actuel :</span>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold capitalize">
            {currentRole}
          </span>
          <button
            className="ml-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            onClick={() => {
              setEditRole(true);
            }}
          >
            Modifier mon rôle
          </button>
        </div>
      )}
      {(!currentRole || editRole) && (
        <>
          <p className="mb-6">Sélectionnez votre rôle :</p>
          <div className="flex flex-col gap-4 items-center">
            <button
              className={`px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition ${role === 'chauffeur' ? 'ring-2 ring-green-700' : ''}`}
              onClick={() => handleSelect('chauffeur')}
            >
              Chauffeur
            </button>
            <button
              className={`px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${role === 'passager' ? 'ring-2 ring-blue-700' : ''}`}
              onClick={() => handleSelect('passager')}
            >
              Passager
            </button>
            <button
              className={`px-6 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition ${role === 'les deux' ? 'ring-2 ring-purple-700' : ''}`}
              onClick={() => handleSelect('les deux')}
            >
              Les deux
            </button>
            <button
              className="mt-2 text-sm text-gray-500 underline"
              onClick={() => setEditRole(false)}
            >
              Annuler
            </button>
          </div>
        </>
      )}
      {error && <div className="mt-6 text-red-600 text-center">{error}</div>}
      {message && <div className="mt-6 text-green-700 text-center">{message}</div>}
    </section>
  );
}
