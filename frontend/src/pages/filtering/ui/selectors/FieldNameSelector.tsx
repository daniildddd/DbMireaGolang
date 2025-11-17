import { useContext } from "react";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import { TableContext } from "@/shared/context/TableContext";
import Select from "@/shared/ui/components/Select/Select";
import useTableSchema from "@/shared/lib/hooks/useTableSchema";

export default function FieldNameSelector({
  setFieldName,
  required = true,
}: {
  setFieldName: React.Dispatch<React.SetStateAction<string>>;
  required?: boolean;
}) {
  const { currentTable } = useContext(TableContext);
  const { tableSchema } = useTableSchema(currentTable);

  return (
    <Select
      name="field-name"
      onChange={(e) => setFieldName(e.target.value)}
      required={required}
    >
      {tableSchema.length ? (
        tableSchema.map((field) => (
          <option value={field.name}>{`${field.name} (${field.type})`}</option>
        ))
      ) : (
        <option>Грузим...</option>
      )}
    </Select>
  );
}
