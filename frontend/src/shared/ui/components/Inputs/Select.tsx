import { HTMLProps, PropsWithChildren } from "react";
import { UseFormRegister } from "react-hook-form";

interface SelectProps extends PropsWithChildren, HTMLProps<HTMLSelectElement> {
  name: string;
  multiple?: boolean;
  register: UseFormRegister<any>;
  options?: object;
}

export default function Select({
  children,
  name,
  register,
  options,
  multiple = false,
}: SelectProps) {
  return (
    <select
      name={name}
      id={`${name}-select`}
      multiple={multiple}
      className="select"
      {...register(name, options)}
    >
      {children}
    </select>
  );
}
