type PhotoCancelButtonProps = {
  onCancel: () => void;
};

export default function PhotoCancelButton({ onCancel }: PhotoCancelButtonProps) {
  return (
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
    >
      Annuler
    </button>
  );
}
