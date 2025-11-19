import { UseFormRegister } from "react-hook-form";

interface CheckboxInputProps {
  name: string;
  register: UseFormRegister<any>;
  options?: any;
}

export default function CheckboxInput({
  name,
  register,
  options = {},
}: CheckboxInputProps) {
  return (
    <input type="checkbox" name={name} id={name} {...register(name, options)} />
  );
}
