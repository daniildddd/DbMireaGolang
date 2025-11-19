import { UseFormRegister } from "react-hook-form";

interface NumberInputProps {
  register: UseFormRegister<any>;
  placeholder?: string;
  required: boolean;
  name: string;
  options: { min: number; max: number; step: number };
  errors: any;
}

export default function NumberInput({
  register,
  required,
  name,
  placeholder,
  options,
  errors,
}: NumberInputProps) {
  return (
    <>
      <input
        required
        aria-required={required}
        type="number"
        placeholder={placeholder}
        step={options.step}
        {...register(name, {
          min: options.min,
          max: options.max,
          required,
        })}
      />
      {errors.aggregate && (
        <span className="error-message">
          {errors.aggregate.message as string}
        </span>
      )}
    </>
  );
}
