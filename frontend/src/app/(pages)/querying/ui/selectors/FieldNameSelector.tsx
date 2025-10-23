import { Select } from "@gravity-ui/uikit";
import { TableField } from "@/types";

export default function FieldNameSelector({
  fields,
  setFieldName,
}: {
  fields: TableField[];
  setFieldName: (arg0: string) => void;
}) {
  return (
    <Select onUpdate={(value) => setFieldName(value[0])} multiple={false}>
      {fields.map((field) => (
        <option value={field.name}>{`${field.name} (${field.type})`}</option>
      ))}
    </Select>
  );
}
