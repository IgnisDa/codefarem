import { FC, HTMLProps, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

type ButtonProps = HTMLProps<HTMLButtonElement> & {
  isLoading?: boolean;
  buttonType?: 'button' | 'reset' | 'submit';
  isDisabled?: boolean;
  isSecondary?: boolean;
  leftSlot?: ReactElement;
  classes?: string[] | string;
  children?: ReactNode;
};

export const Button: FC<ButtonProps> = ({
  isLoading,
  children,
  isDisabled,
  buttonType = 'submit',
  isSecondary,
  classes,
  leftSlot,
  onClick,
}) => (
  <button
    className={clsx(
      'rounded-md flex text-base text-center py-3 px-4 items-center justify-center relative appearance-none w-full transition-all duration-300 hover:shadow-lg',
      isSecondary ? 'text-blue-600 border' : 'bg-yellow-500',
      classes
    )}
    disabled={isLoading ?? isDisabled}
    type={buttonType}
    onClick={onClick}
  >
    {leftSlot && leftSlot}
    {isLoading && (
      <span className="flex items-center">
        <svg
          className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </span>
    )}
    <span>{children}</span>
  </button>
);
