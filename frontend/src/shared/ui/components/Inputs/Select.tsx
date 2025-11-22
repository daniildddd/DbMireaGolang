import { HTMLProps, PropsWithChildren, useState, useEffect } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface SelectProps extends PropsWithChildren, HTMLProps<HTMLSelectElement> {
  name: string;
  multiple?: boolean;
  register?: UseFormRegister<any>;
  errors?: FieldErrors<FormData>;
  defaultValue?: string;
  value?: string | string[];
  onUpdate?: (value: string[]) => void;
  options?: Array<{ value: string; label: string }>;
}

export default function Select({
  children,
  name,
  register,
  multiple = false,
  errors,
  defaultValue,
  value,
  onUpdate,
  options,
}: SelectProps) {
  const [firstOptionValue, setFirstOptionValue] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (defaultValue !== undefined || value !== undefined) return;

    const optionsArray =
      options || (Array.isArray(children) ? children : [children]);
    const firstValidOption = optionsArray.find(
      (option) =>
        option &&
        (option.value !== undefined ||
          (option.props && "value" in option.props))
    );

    if (firstValidOption) {
      const val =
        firstValidOption.value !== undefined
          ? firstValidOption.value
          : firstValidOption.props.value;
      setFirstOptionValue(val);
    }
  }, [children, defaultValue, value, options]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedOptions = Array.from(e.target.options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      onUpdate?.(selectedOptions);
    } else {
      onUpdate?.([e.target.value]);
    }
  };

  // Если используется с react-hook-form
  if (register) {
    return (
      <select
        id={`${name}-select`}
        multiple={multiple}
        className="select"
        {...register(name, {
          value: defaultValue !== undefined ? defaultValue : firstOptionValue,
        })}
        aria-invalid={errors?.[name] ? "true" : "false"}
      >
        {children}
      </select>
    );
  }

  // Если используется с onUpdate callback
  const selectValue = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <select
      id={`${name}-select`}
      multiple={multiple}
      className="select"
      value={selectValue}
      onChange={handleChange}
    >
      {options
        ? options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        : children}
    </select>
  );
}
