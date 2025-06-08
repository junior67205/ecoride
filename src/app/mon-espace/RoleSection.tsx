import { UserIcon, TruckIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import RoleCard from './components/RoleCard';
import RoleCurrent from './components/RoleCurrent';
import RoleAlert from './components/RoleAlert';

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

const roles = [
  {
    key: 'chauffeur',
    label: 'Chauffeur',
    color: 'green',
    icon: TruckIcon,
    desc: 'Proposez des trajets et transportez des passagers.',
  },
  {
    key: 'passager',
    label: 'Passager',
    color: 'blue',
    icon: UserIcon,
    desc: 'Réservez des places et profitez du covoiturage.',
  },
  {
    key: 'les deux',
    label: 'Les deux',
    color: 'purple',
    icon: UserGroupIcon,
    desc: 'Soyez à la fois chauffeur et passager selon vos envies.',
  },
];

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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mon rôle</h2>
      <RoleAlert message={roleError} type="error" />
      <RoleAlert message={roleSuccess} type="success" />
      {currentRole && !editRole && (
        <RoleCurrent currentRole={currentRole} onEdit={() => setEditRole(true)} />
      )}
      {(!currentRole || editRole) && (
        <>
          <p className="mb-6 text-gray-600 text-center">Sélectionnez votre rôle :</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {roles.map(r => (
              <RoleCard
                key={r.key}
                label={r.label}
                desc={r.desc}
                icon={r.icon}
                color={r.color}
                selected={role === r.key}
                onClick={() => handleSelect(r.key)}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <button className="text-sm text-gray-500 underline" onClick={() => setEditRole(false)}>
              Annuler
            </button>
          </div>
        </>
      )}
      <RoleAlert message={error} type="error" />
      <RoleAlert message={message} type="success" />
    </section>
  );
}
