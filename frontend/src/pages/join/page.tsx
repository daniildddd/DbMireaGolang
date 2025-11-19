"use client";

import { useState } from "react";
import TableSelector from "./ui/TableSelector";
import SqlOutput from "./ui/SqlOutput";
import { generateSQL } from "./lib/sqlGenerator";
import AsideTableSelector from "@/shared/ui/components/AsideTableSelector/AsideTableSelector";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import s from "./page.module.sass";
import clsx from "clsx";
import Header from "@/shared/ui/components/Header/Header";
import Main from "@/shared/ui/components/Main/Main";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";

export default function JoinPage() {
  const tableNames = useTableNames();
  const [currentTable, setCurrentTable] = useState<string>(tableNames[0]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [sql, setSql] = useState("");

  const handleGenerateSQL = () => {
    const query = generateSQL(selectedTables);
    setSql(query);
  };

  return (
    <ContentWrapper>
      <Header />
      <AsideTableSelector setCurrentTable={setCurrentTable} />
      <Main>
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
              className={clsx("button", "important", s["join-section__submit"])}
              onClick={handleGenerateSQL}
            >
              Сгенерировать SQL
            </button>
          </div>
          {sql && <SqlOutput sql={sql} />}
        </section>
      </Main>
    </ContentWrapper>
  );
}
