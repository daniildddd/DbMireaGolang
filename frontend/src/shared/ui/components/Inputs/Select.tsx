import { HTMLProps, PropsWithChildren } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface SelectProps extends PropsWithChildren, HTMLProps<HTMLSelectElement> {
  name: string;
  multiple?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors<FormData>;
}

export default function Select({
  children,
  name,
  register,
  multiple = false,
  errors,
}: SelectProps) {
  return (
    <select
      id={`${name}-select`}
      multiple={multiple}
      className="select"
      {...register(name)}
      aria-invalid={errors[name] ? "true" : "false"}
    >
      {children}
    </select>
  );
}
