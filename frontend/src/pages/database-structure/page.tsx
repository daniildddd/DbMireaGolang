"use client";

import { useEffect } from "react";
import clsx from "clsx";
import s from "./page.module.sass";
import SchemaTable from "./ui/SchemaTable";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";
import useTableSchema from "@/shared/lib/hooks/useTableSchema";

export default function DatabaseStructurePage() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useGlobalContext();
  const { tableSchema, isLoading, refetch } = useTableSchema(
    globalContext.currentTable
  );

  // Устанавливаем первую таблицу при загрузке
  useEffect(() => {
    if (tableNames.length > 0 && !globalContext.currentTable) {
      setGlobalContext({ ...globalContext, currentTable: tableNames[0] });
    }
  }, [tableNames, globalContext]);

  useEffect(() => {
    refetch();
  }, [globalContext, isLoading]);

  return (
    <ContentWrapper>
      <section className={clsx("section", s["table-section"])}>
        <h2 className={clsx("h2", s["table-section__title"])}>
          Структура таблицы: {globalContext.currentTable}
        </h2>
        <SchemaTable
          tableName={globalContext.currentTable}
          tableSchema={tableSchema}
          onRefreshSchema={refetch}
        />
      </section>
    </ContentWrapper>
  );
}
