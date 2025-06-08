import { FaUserCircle } from 'react-icons/fa';
import type { Profil } from '../typesMonEspace';

type AvatarProps = {
  profil: Profil;
  className?: string;
};

export default function Avatar({ profil, className = '' }: AvatarProps) {
  if (profil.photo) {
    return (
      <img
        src={`/uploads/${profil.photo}`}
        alt={profil.pseudo}
        className={`w-16 h-16 rounded-full object-cover ${className}`}
      />
    );
  }

  if (profil.pseudo) {
    return (
      <div
        className={`bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl ${className}`}
      >
        {profil.pseudo[0].toUpperCase()}
      </div>
    );
  }

  return <FaUserCircle size={48} className={`text-green-600 ${className}`} />;
}
