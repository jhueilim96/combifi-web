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
          ? 'bg-brand-disabled cursor-not-allowed opacity-70'
          : 'bg-brand hover:bg-brand-hover'
      } text-ink border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 font-semibold text-lg ${className || ''}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? loadingText : text}
    </button>
  );
}
