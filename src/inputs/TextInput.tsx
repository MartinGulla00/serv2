import { twMerge } from 'tailwind-merge';

export const TextInput = ({
  onChange,
  value,
  label,
  type = 'text',
  placeholder,
  className,
  required,
  name,
}: {
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value: string;
  label?: string;
  type?: 'text' | 'text-area';
  placeholder: string;
  className?: string;
  required?: boolean;
  name?: string;
}) => {
  return (
    <div className={twMerge('flex flex-col w-full', className)}>
      {label && (
        <label htmlFor={name} className="text-sm font-bold">
          {label}
        </label>
      )}
      {type == 'text' ? (
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={twMerge(
            'border-2 border-gray-300 rounded-lg p-2',
            className
          )}
        />
      ) : (
        <textarea
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={twMerge(
            'border-2 border-gray-300 rounded-lg p-2 resize-none',
            className
          )}
          rows={5}
        />
      )}
    </div>
  );
};
