"use client";

import clsx from "clsx";
import s from "./page.module.sass";
import SchemaTable from "./ui/SchemaTable";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";
import { useCurrentTableSchema } from "@/shared/lib/hooks/useTableSchema";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import Loading from "@/shared/ui/components/Loading/Loading";
import notifyAndReturn from "@/shared/lib/utils/notifyAndReturn";
import { useEffect } from "react";

export default function DatabaseStructurePage() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useGlobalContext();
  const currentTableSchema = useCurrentTableSchema([
    globalContext.currentTable,
  ]);
  const notifier = useNotifications();

  useEffect(() => {
    if (
      tableNames.data &&
      tableNames.data.length > 0 &&
      !globalContext.currentTable
    ) {
      setGlobalContext((prev) => ({
        ...prev,
        currentTable: tableNames.data[0],
      }));
    }
  }, [tableNames.data, globalContext.currentTable]);

  if (tableNames.isPending || currentTableSchema.isPending) return <Loading />;
  if (tableNames.error) notifyAndReturn(notifier, tableNames.error);
  if (tableNames.data?.length === 0) return <div>В базе данных нет таблиц</div>;
  if (currentTableSchema.error)
    notifyAndReturn(notifier, currentTableSchema.error);
  if (!globalContext.currentTable) return <Loading />;

  return (
    <ContentWrapper>
      <section className={clsx("section", s["table-section"])}>
        <h2 className={clsx("h2", s["table-section__title"])}>
          Структура таблицы: {globalContext.currentTable}
        </h2>
        <SchemaTable
          tableName={globalContext.currentTable}
          tableSchema={currentTableSchema.data || []}
        />
      </section>
    </ContentWrapper>
  );
}
