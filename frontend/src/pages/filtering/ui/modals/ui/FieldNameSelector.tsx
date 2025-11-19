import useTableSchema from "@/shared/lib/hooks/useTableSchema";
import { Select } from "@/shared/ui/components/Inputs";
import { UseFormRegister } from "react-hook-form";

export default function FieldNameSelector({
  register,
  multiple = false,
  options = {},
}: {
  register: UseFormRegister<any>;
  multiple?: boolean;
  options?: object;
}) {
  const tableSchema = useTableSchema();

  return (
    <Select
      name="fieldName"
      multiple={multiple}
      register={register}
      options={{ ...options, required: true }}
    >
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
