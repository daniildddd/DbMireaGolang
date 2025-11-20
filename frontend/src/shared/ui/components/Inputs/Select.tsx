import { HTMLProps, PropsWithChildren, useState, useEffect } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface SelectProps extends PropsWithChildren, HTMLProps<HTMLSelectElement> {
  name: string;
  multiple?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors<FormData>;
  defaultValue?: string;
}

export default function Select({
  children,
  name,
  register,
  multiple = false,
  errors,
  defaultValue,
}: SelectProps) {
  const [firstOptionValue, setFirstOptionValue] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (defaultValue !== undefined) return;

    const options = Array.isArray(children) ? children : [children];
    const firstValidOption = options.find(
      (option) => option && option.props && "value" in option.props
    );

    if (firstValidOption) {
      setFirstOptionValue(firstValidOption.props.value);
    }
  }, [children, defaultValue]);

  return (
    <select
      id={`${name}-select`}
      multiple={multiple}
      className="select"
      {...register(name, {
        value: defaultValue !== undefined ? defaultValue : firstOptionValue,
      })}
      aria-invalid={errors[name] ? "true" : "false"}
    >
      {children}
    </select>
  );
}
