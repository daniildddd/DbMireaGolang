import GenericInput, { GenericInputProps } from "./GenericInput";

interface NumberInputProps extends GenericInputProps {}

export default function NumberInput(props: NumberInputProps) {
  return <GenericInput {...props} type="string" />;
}
