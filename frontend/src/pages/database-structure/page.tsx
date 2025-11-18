"use client";

import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";
import { main } from "@/shared/lib/wailsjs/go/models";
import s from "./page.module.sass";
import SchemaTable from "./ui/SchemaTable";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";

export default function DatabaseStructurePage() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useGlobalContext();
  const [tableSchema, setTableSchema] = useState<main.FieldSchema[]>([]);

  // Устанавливаем первую таблицу при загрузке
  useEffect(() => {
    if (tableNames.length > 0 && !globalContext.currentTable) {
      setGlobalContext({ ...globalContext, currentTable: tableNames[0] });
    }
  }, [tableNames, globalContext]);

  useEffect(() => {
    ApiMiddleware.getTableSchema(globalContext.currentTable).then((schema) =>
      setTableSchema(schema)
    );
  }, [globalContext]);

  return (
    <ContentWrapper>
      <section className={clsx("section", s["table-section"])}>
        <h2 className={clsx("h2", s["table-section__title"])}>
          Структура таблицы: {globalContext.currentTable}
        </h2>
        <SchemaTable data={tableSchema} />
      </section>
    </ContentWrapper>
  );
}
