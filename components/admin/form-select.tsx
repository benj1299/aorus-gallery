'use client';

interface FormSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}

export function FormSelect({ name, label, options, defaultValue, required, placeholder }: FormSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && '*'}
      </label>
      <select
        name={name}
        defaultValue={defaultValue ?? ''}
        required={required}
        className="w-full h-10 px-3 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      >
        <option value="" disabled>
          {placeholder || 'Selectionner...'}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
