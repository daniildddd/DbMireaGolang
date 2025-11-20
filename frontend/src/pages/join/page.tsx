"use client";

import { useEffect, useState } from "react";
import TableSelector from "./ui/TableSelector";
import SqlOutput from "./ui/SqlOutput";
import { generateSQL } from "./lib/sqlGenerator";
import s from "./page.module.sass";
import clsx from "clsx";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";

export default function JoinPage() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useGlobalContext();
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [sql, setSql] = useState("");

  const handleGenerateSQL = () => {
    const query = generateSQL(selectedTables);
    setSql(query);
  };

  // Устанавливаем первую таблицу при загрузке
  useEffect(() => {
    if (tableNames.length > 0 && !globalContext.currentTable) {
      setGlobalContext({ ...globalContext, currentTable: tableNames[0] });
    }
  }, [tableNames, globalContext]);

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
