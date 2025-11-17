"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";
import { main } from "@/shared/lib/wailsjs/go/models";
import s from "./page.module.sass";
import SchemaTable from "./ui/SchemaTable";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import { TableContext } from "@/shared/context/TableContext";

export default function DatabaseStructurePage() {
  const tableNames = useTableNames();
  const [currentTable, setCurrentTable] = useState("");
  const [tableSchema, setTableSchema] = useState<main.FieldSchema[]>([]);

  useEffect(() => {
    ApiMiddleware.getTableSchema(currentTable).then((schema) =>
      setTableSchema(schema)
    );
  }, [currentTable]);

  // Устанавливаем первую таблицу при загрузке
  useEffect(() => {
    if (tableNames.length > 0 && !currentTable) {
      setCurrentTable(tableNames[0]);
    }
  }, [tableNames, currentTable]);

  return (
    <TableContext.Provider value={{ currentTable, setCurrentTable }}>
      <ContentWrapper>
        <section className={clsx("section", s["table-section"])}>
          <h2 className={clsx("h2", s["table-section__title"])}>
            Структура таблицы: {currentTable}
          </h2>
          <SchemaTable data={tableSchema} />
        </section>
      </ContentWrapper>
    </TableContext.Provider>
  );
}
