type AlertMessageProps = {
  message: string;
  type?: 'success' | 'error';
  className?: string;
};

export default function AlertMessage({
  message,
  type = 'success',
  className = '',
}: AlertMessageProps) {
  if (!message) return null;
  return (
    <div
      className={`mb-4 p-3 rounded font-semibold text-center ${
        type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
      } ${className}`}
    >
      {message}
    </div>
  );
}
