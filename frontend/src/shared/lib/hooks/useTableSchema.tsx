import { useEffect, useState } from "react";
import ApiMiddleware from "../api/ApiMiddleware";
import useNotifications from "./useNotifications";
import { main } from "../wailsjs/go/models";

export default function useTableSchema(currentTable: string) {
  const notifier = useNotifications();
  const [tableSchema, setTableSchema] = useState<main.FieldSchema[]>([]);

  useEffect(() => {
    if (currentTable.length === 0) {
      notifier.notify("Сначала выберете таблицу!", "warn");
      return;
    } else if (tableSchema.length === 0) {
      ApiMiddleware.getTableSchema(currentTable)
        .then((fields) => {
          setTableSchema(fields);
        })
        .catch((err) => notifier.notify(err, "error"));
    }
  }, [currentTable]);

  return { tableSchema, setTableSchema };
}
