import { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "./ErrorMessage/ErrorMessage";

export interface GenericInputProps<T> {
  type?: string;
  placeholder?: string;
  className?: string;
  name: string;
  register: UseFormRegister<any>;
  options?: any;
  errors: FieldErrors<T>;
}

export default function GenericInput<T>({
  register,
  type = "text",
  name,
  placeholder,
  options = {},
  errors,
  className,
}: GenericInputProps<T>) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        step={options?.step}
        {...register(name, options)}
        className={className}
        aria-invalid={errors[name] ? "true" : "false"}
      />
      {errors[name]?.type === "required" && (
        <ErrorMessage>Это поле обязательно</ErrorMessage>
      )}
    </div>
  );
}
