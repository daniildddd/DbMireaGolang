import { UseFormRegister } from "react-hook-form";

export interface GenericInputProps {
  placeholder?: string;
  type?: string;
  name: string;
  register: UseFormRegister<any>;
  options?: any;
}

export default function GenericInput({
  register,
  type,
  name,
  placeholder,
  options = {},
}: GenericInputProps) {
  return (
    <>
      <input
        type={type ?? "text"}
        placeholder={placeholder}
        step={options?.step}
        {...register(name, options)}
      />
    </>
  );
}
