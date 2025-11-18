import { Select } from "@gravity-ui/uikit";
import useTableSchema from "@/shared/lib/hooks/useTableSchema";
import { Dispatch, SetStateAction } from "react";

export default function FieldNameSelector({
  setFieldName,
}: {
  setFieldName: Dispatch<SetStateAction<string>>;
}) {
  const { tableSchema } = useTableSchema();

  return (
    <Select onUpdate={(value) => setFieldName(value[0])} multiple={false}>
      {tableSchema && tableSchema.length ? (
        tableSchema.map((field) => (
          <option value={field.name}>{`${field.name} (${field.type})`}</option>
        ))
      ) : (
        <option value="LOADING ">Подождите...</option>
      )}
    </Select>
  );
}
