export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  text?: string;
}

export function Button({
  disabled = false,
  isLoading = false,
  loadingText = 'Processing...',
  text = 'Save',
  type = 'button',
  onClick,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`w-full py-3 px-4 ${
        disabled || isLoading
          ? 'bg-indigo-300 cursor-not-allowed'
          : 'bg-indigo-500 hover:bg-indigo-600'
      } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md text-lg ${className || ''}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? loadingText : text}
    </button>
  );
}
