import { Select } from "@gravity-ui/uikit";
import { useContext, useEffect, useRef, useState } from "react";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import { Api } from "@/shared/lib/api/types";
import { GlobalContext } from "@/shared/context/GlobalContext";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";

export default function FieldNameSelector({
  setFieldName,
}: {
  setFieldName: (arg0: string) => void;
}) {
  const notifier = useNotifications();
  const { globalContext } = useGlobalContext();
  const [tableSchema, setTableSchema] = useState<Api.TableSchema>([]);

  useEffect(() => {
    if (globalContext.currentTable !== "") {
      ApiMiddleware.getTableSchema(globalContext.currentTable)
        .then((fields) => {
          setTableSchema(fields);
        })
        .catch((err) => notifier.notify(err, "error"));
    } else {
      notifier.notify("Сначала выберете таблицу!", "warn");
    }
  }, [globalContext]);

  return (
    <Select onUpdate={(value) => setFieldName(value[0])} multiple={false}>
      {tableSchema.map((field) => (
        <option value={field.name}>{`${field.name} (${field.type})`}</option>
      ))}
    </Select>
  );
}
