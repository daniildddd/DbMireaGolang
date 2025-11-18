import useNotifications from "@/shared/lib/hooks/useNotifications";
import useTableSchema from "@/shared/lib/hooks/useTableSchema";
import Select from "@/shared/ui/components/Select/Select";
import { Dispatch, SetStateAction } from "react";

const DEFAULT_OPTION_VALUE = "_LOADING_";

export default function FieldNameSelector({
  setFieldName,
}: {
  setFieldName: Dispatch<SetStateAction<string>>;
}) {
  const { tableSchema } = useTableSchema();
  const notifier = useNotifications();

  return (
    <Select
      name="field-name"
      required={true}
      onChange={(e) => {
        const value = e.target.value;
        if (value !== DEFAULT_OPTION_VALUE) {
          setFieldName(value);
        } else {
          notifier.notify("Выберите другое значение", "error");
        }
      }}
      multiple={false}
    >
      {tableSchema && tableSchema.length ? (
        tableSchema.map((field) => (
          <option value={field.name}>{`${field.name} (${field.type})`}</option>
        ))
      ) : (
        <option value={DEFAULT_OPTION_VALUE}>Подождите...</option>
      )}
    </Select>
  );
}
