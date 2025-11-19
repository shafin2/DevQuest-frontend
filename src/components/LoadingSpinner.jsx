const LoadingSpinner = ({ size = 'default', message = '' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    default: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizeClasses[size]} border-4 border-neutral-200 border-t-primary rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-4 text-neutral-600 text-sm">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
