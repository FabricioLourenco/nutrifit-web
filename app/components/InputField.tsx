interface InputFieldProps {
  label: string;
  type: string;
  id: string;
  placeholder: string;
  required?: boolean;
}

export default function InputField({
  label,
  type,
  id,
  placeholder,
  required = false,
}: InputFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        required={required}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
      />
    </div>
  );
}
