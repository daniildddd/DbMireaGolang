"use client";

import { useEffect, useState } from "react";
import TableSelectorSidebar from "@shared/ui/components/TableSelectorSidebar/TableSelectorSidebar";
import useTableNames from "@shared/lib/hooks/useTableNames";
import clsx from "clsx";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";
import { main } from "@/shared/lib/wailsjs/go/models";
import s from "./page.module.sass";
import SchemaTable from "./ui/SchemaTable";

export default function Page() {
  const tableNames = useTableNames();
  const [currentTable, setCurrentTable] = useState<string>(tableNames[0]);
  const [tableSchema, setTableSchema] = useState<main.FieldSchema[]>([]);

  useEffect(() => {
    ApiMiddleware.getTableSchema(currentTable).then((schema) =>
      setTableSchema(schema)
    );
  }, [currentTable]);

  return (
    <>
      <TableSelectorSidebar setCurrentTable={setCurrentTable} />
      <section className={clsx("section", s["table-section"])}>
        <h2 className={clsx("h2", s["table-section__title"])}>
          Структура таблицы: {currentTable}
        </h2>
        <SchemaTable data={tableSchema} />
      </section>
    </>
  );
}
