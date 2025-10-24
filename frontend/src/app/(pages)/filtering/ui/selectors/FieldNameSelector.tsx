import { Select } from "@gravity-ui/uikit";
import { useContext, useEffect, useState } from "react";
import { CurrentTableContext } from "../../../../../shared/context/CurrentTableContext";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import { Api } from "@/shared/lib/api/types";

export default function FieldNameSelector({
  setFieldName,
}: {
  setFieldName: (arg0: string) => void;
}) {
  const notifier = useNotifications();
  const currentTable = useContext(CurrentTableContext);
  const [tableSchema, setTableSchema] = useState<Api.TableSchema>([]);

  useEffect(() => {
    if (currentTable !== "") {
      ApiMiddleware.getTableSchema(currentTable)
        .then((fields) => {
          setTableSchema(fields);
        })
        .catch((err) => notifier.notify(err, "error"));
    } else {
      notifier.notify("Сначала выберете таблицу!", "warn");
    }
  }, [currentTable]);

  return (
    <Select onUpdate={(value) => setFieldName(value[0])} multiple={false}>
      {tableSchema.map((field) => (
        <option value={field.name}>{`${field.name} (${field.type})`}</option>
      ))}
    </Select>
  );
}
