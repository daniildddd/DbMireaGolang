import GenericInput, { GenericInputProps } from "./GenericInput";

interface CheckboxInputProps<T> extends GenericInputProps<T> {}

export default function CheckboxInput<T>(props: CheckboxInputProps<T>) {
  return (
    <GenericInput
      {...props}
      aria-invalid={props.errors[props.name] ? "true" : "false"}
      type="checkbox"
    />
  );
}
