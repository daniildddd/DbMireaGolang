import GenericInput, { GenericInputProps } from "./GenericInput";

interface CheckboxInputProps extends GenericInputProps {}

export default function CheckboxInput(props: CheckboxInputProps) {
  return <GenericInput type="checkbox" {...props} />;
}
