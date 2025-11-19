import { useState, useEffect } from "react";
import ApiMiddleware from "../api/ApiMiddleware";
import useGlobalContext from "./useGlobalContext";
import useNotifications from "./useNotifications";
import { main } from "../wailsjs/go/models";

export default function useTableSchema() {
  const notifier = useNotifications();
  const { globalContext } = useGlobalContext();
  const [tableSchema, setTableSchema] = useState<main.FieldSchema[]>();

  useEffect(() => {
    ApiMiddleware.getTableSchema(globalContext.currentTable)
      .then((fields) => {
        setTableSchema(fields);
      })
      .catch((err) => notifier.error(err));
  }, [globalContext]);

  return tableSchema;
}
