import ErrorMessage from "./ErrorMessage/ErrorMessage";
import GenericInput, { GenericInputProps } from "./GenericInput";

interface TextInputProps<T> extends GenericInputProps<T> {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export default function TextInput<T>({
  minLength = 1,
  maxLength = 30,
  pattern = "",
  ...props
}: TextInputProps<T>) {
  const { errors } = props;
  return (
    <>
      <GenericInput
        {...props}
        type="string"
        aria-invalid={errors[props.name] ? "true" : "false"}
      />
      {errors[props.name]?.type === "minLength" && (
        <ErrorMessage>{`Строка слишком короткая (от ${minLength} символов)`}</ErrorMessage>
      )}
      {errors[props.name]?.type === "maxLength" && (
        <ErrorMessage>{`Строка слишком длинная (максимум ${maxLength} символов)`}</ErrorMessage>
      )}
      {errors[props.name]?.type === "pattern" && pattern.length && (
        <ErrorMessage>{`Строка не соответствует шаблону: ${pattern}`}</ErrorMessage>
      )}
    </>
  );
}
