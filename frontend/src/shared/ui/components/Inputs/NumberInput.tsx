import { UseFormRegister } from "react-hook-form";

interface NumberInputProps {
  register: UseFormRegister<any>;
  placeholder?: string;
  name: string;
  options?: any;
  errors: any;
}

export default function NumberInput({
  register,
  name,
  placeholder,
  options = {},
  errors,
}: NumberInputProps) {
  return (
    <>
      <input
        type="number"
        placeholder={placeholder}
        step={options?.step}
        {...register(name, options)}
      />
      {errors.aggregate && (
        <span className="error-message">
          {errors.aggregate.message as string}
        </span>
      )}
    </>
  );
}
