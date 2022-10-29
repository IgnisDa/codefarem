import React, { forwardRef, HTMLProps, ReactElement } from 'react';
import clsx from 'clsx';

type InputProps = HTMLProps<HTMLInputElement> & {
  labelSlot?: ReactElement;
  isValid?: boolean;
  iconSlot?: ReactElement;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = 'text',
      value,
      name,
      placeholder,
      defaultValue,
      required,
      step,
      labelSlot,
      disabled = false,
      iconSlot,
      onChange,
      onBlur,
      isValid = true,
    },
    ref
  ) => (
    <div className={clsx(!isValid && 'input-error')}>
      {labelSlot ?? (
        <label
          htmlFor={name}
          className="block mb-2 text-lg font-medium text-gray-700 font-circular-book"
        >
          {label}
        </label>
      )}
      <div
        className={clsx(
          'mt-1 w-full flex items-center border-b transition-colors duration-500',
          isValid ? 'border-gray-150' : 'border-red-500'
        )}
      >
        {iconSlot && iconSlot}
        <input
          type={type}
          value={value}
          ref={ref}
          defaultValue={defaultValue}
          name={name}
          placeholder={placeholder}
          required={required}
          step={step}
          className="w-full py-3 border-none outline-none appearance-none autofill:bg-yellow-200"
          disabled={!(disabled === undefined || !disabled)}
          onChange={onChange ? (e) => void onChange(e) : undefined}
          onBlur={onBlur ? (e) => void onBlur(e) : undefined}
        />
      </div>
    </div>
  )
);
