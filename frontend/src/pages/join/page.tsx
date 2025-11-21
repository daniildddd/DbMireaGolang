"use client";

import { useEffect, useState } from "react";
import TableSelector from "./ui/TableSelector";
import SqlOutput from "./ui/SqlOutput";
import { generateSQL } from "./lib/sqlGenerator";
import s from "./page.module.sass";
import clsx from "clsx";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import useTableNames from "@/shared/hooks/useTableNames";
import useGlobalContext from "@/shared/hooks/useGlobalContext";
import Loading from "@/shared/ui/components/Loading/Loading";
import notifyAndReturn from "@/shared/lib/utils/notifyAndReturn";
import useNotifications from "@/shared/hooks/useNotifications";

export default function JoinPage() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useGlobalContext();
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [sql, setSql] = useState("");
  const notifier = useNotifications();

  const handleGenerateSQL = () => {
    const query = generateSQL(selectedTables);
    setSql(query);
  };

  if (tableNames.isPending) return <Loading />;
  if (tableNames.error) return notifyAndReturn(notifier, tableNames.error);
  if (tableNames.data.length === 0) return <div>В базе данных нет таблиц</div>;

  // Устанавливаем первую таблицу при загрузке
  if (!globalContext.currentTable) {
    setGlobalContext({ ...globalContext, currentTable: tableNames.data[0] });
  }

  return (
    <ContentWrapper>
      <section className={clsx("section", s["join-section"])}>
        <div className={s["join-section__header"]}>
          <h1 className={clsx(s["join-section__title"])}>
            Соединения (JOIN) таблиц
          </h1>
          <p className={clsx(s.smaller, s["join-section__description"])}>
            Выберите таблицы и сгенерируйте SQL-запрос
          </p>
        </div>
        <div className={clsx(s["join-section__available-tables-list"])}>
          <h3>Доступные таблицы</h3>
          <span>Первичная таблица: {globalContext.currentTable}</span>
          <TableSelector
            selected={selectedTables}
            onChange={setSelectedTables}
          />
        </div>
        <div>
          <button
            className={clsx("button", "important", s["join-section__submit"])}
            onClick={handleGenerateSQL}
          >
            Сгенерировать SQL
          </button>
        </div>
        {sql && <SqlOutput sql={sql} />}
      </section>
    </ContentWrapper>
  );
}
