"use client";

import { useState } from "react";
import TableSelector from "./ui/TableSelector";
import SqlOutput from "./ui/SqlOutput";
import { generateSQL } from "./lib/sqlGenerator";
import TableSelectorSidebar from "@shared/ui/components/TableSelectorSidebar/TableSelectorSidebar";
import useTableNames from "@shared/lib/hooks/useTableNames";
import s from "./page.module.sass";
import clsx from "clsx";

export default function Page() {
  const tableNames = useTableNames();
  const [currentTable, setCurrentTable] = useState<string>(tableNames[0]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [sql, setSql] = useState("");

  const handleGenerateSQL = () => {
    const query = generateSQL(selectedTables);
    setSql(query);
  };

  return (
    <>
      <TableSelectorSidebar setCurrentTable={setCurrentTable} />
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
          <span>Первичная таблица: {currentTable}</span>
          <TableSelector
            selected={selectedTables}
            onChange={setSelectedTables}
          />
        </div>
        <div>
          <button
            className={clsx(s.button, s.important, s["join-section__submit"])}
            onClick={handleGenerateSQL}
          >
            Сгенерировать SQL
          </button>
        </div>
        {sql && <SqlOutput sql={sql} />}
      </section>
    </>
  );
}
