import { ChangeEvent, PropsWithChildren } from "react";

interface SelectProps extends PropsWithChildren {
  required: boolean;
  name: string;
  multiple?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select({
  children,
  required,
  name,
  multiple = false,
  onChange,
}: SelectProps) {
  return (
    <select
      className="select"
      name={name}
      multiple={multiple}
      id={`${name}-select`}
      required={required}
      aria-required={required}
      onChange={onChange}
    >
      {children}
    </select>
  );
}
