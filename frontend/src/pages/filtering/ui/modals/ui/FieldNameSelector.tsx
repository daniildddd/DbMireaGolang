import useTableSchema from "@/shared/lib/hooks/useTableSchema";
import { Select } from "@/shared/ui/components/Inputs";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export default function FieldNameSelector({
  register,
  multiple = false,
  name = "fieldName",
  errors,
}: {
  register: UseFormRegister<any>;
  multiple?: boolean;
  name?: string;
  errors: FieldErrors<FormData>;
}) {
  const { tableSchema } = useTableSchema();

  return (
    <Select name={name} multiple={multiple} register={register} errors={errors}>
      {tableSchema
        ? tableSchema.map((field) => (
            <option
              value={field.name}
              key={field.name + field.type}
            >{`${field.name} (${field.type})`}</option>
          ))
        : "СТОЙ"}
    </Select>
  );
}
