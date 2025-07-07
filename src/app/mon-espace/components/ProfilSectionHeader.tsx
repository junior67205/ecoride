type ProfilSectionHeaderProps = {
  showPasswordForm: boolean;
  setShowPasswordForm: (show: boolean) => void;
};

export default function ProfilSectionHeader({
  showPasswordForm,
  setShowPasswordForm,
}: ProfilSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <h2 className="text-xl font-semibold">Mes informations personnelles</h2>
      <button
        className="text-primary underline hover:bg-primary-light px-2 py-1 rounded transition"
        onClick={() => setShowPasswordForm(!showPasswordForm)}
      >
        {showPasswordForm ? 'Annuler' : 'Modifier mon mot de passe'}
      </button>
    </div>
  );
}
