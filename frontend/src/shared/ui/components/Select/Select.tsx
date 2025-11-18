import { ChangeEvent, PropsWithChildren } from "react";

interface SelectProps extends PropsWithChildren {
  name: string;
  required: boolean;
  multiple?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select({
  children,
  name,
  required,
  onChange,
  multiple = false,
}: SelectProps) {
  return (
    <select
      name={name}
      id={`${name}-select`}
      required={required}
      aria-required={required}
      onChange={onChange}
      multiple={multiple}
      className="select"
    >
      {children}
    </select>
  );
}
