import ErrorMessage from "./ErrorMessage/ErrorMessage";
import GenericInput, { GenericInputProps } from "./GenericInput";

interface NumberInputProps<T> extends GenericInputProps<T> {
  min: number;
  max: number;
}

export default function NumberInput<T>(props: NumberInputProps<T>) {
  const { errors } = props;
  return (
    <>
      <GenericInput
        {...props}
        type="string"
        aria-invalid={errors[props.name] ? "true" : "false"}
      />
      {errors[props.name]?.type === "min" && (
        <ErrorMessage>{`Число не может быть меньше ${props.min}`}</ErrorMessage>
      )}
      {errors[props.name]?.type === "max" && (
        <ErrorMessage>{`Число не может быть больше ${props.max}`}</ErrorMessage>
      )}
    </>
  );
}
