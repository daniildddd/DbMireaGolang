// app/(modals)/join/ui/JoinPage.tsx
"use client";

import { Button, Card, Text } from "@gravity-ui/uikit";
import { useState } from "react";
import TableSelectorSidebar from "@shared/ui/components/TableSelectorSidebar/TableSelectorSidebar";
import useTableNames from "@shared/lib/hooks/useTableNames";
import "./page.sass";
import JoinSectionCard from "./ui/JoinSectionCard";
import CardRow from "./ui/CardRow";
import Code from "@shared/ui/components/Code/Code";

export default function Page() {
  const tableNames = useTableNames();
  const [currentTable, setCurrentTable] = useState<string>(tableNames[0]);

  return (
    <>
      <TableSelectorSidebar
        tableNames={tableNames}
        setCurrentTable={setCurrentTable}
      />
      <section className="section join-section">
        <div className="join-section__grid">
          <JoinSectionCard>
            <CardRow
              title="Фильтры (WHERE)"
              buttonText="Добавить фильтр"
              onClick={() => {}}
            />
          </JoinSectionCard>
          <JoinSectionCard>
            <CardRow
              title="Сортировка"
              buttonText="Добавить сортировку"
              onClick={() => {}}
            />
            <CardRow
              title="Группировка (GROUP BY)"
              buttonText="Добавить группировку"
              onClick={() => {}}
            />
          </JoinSectionCard>
          <JoinSectionCard>
            <CardRow
              title="Агрегатные функции"
              buttonText="Добавить агрегат"
              onClick={() => {}}
            />
            <CardRow
              title="Фильтр групп (HAVING)"
              buttonText="Добавить HAVING"
              onClick={() => {}}
            />
          </JoinSectionCard>
        </div>
        <div className="join-section__generated-sql">
          <Text className="generated-sql__title h2">Сгенерированный SQL</Text>
          <Code
            content={`SELECT * FROM ${currentTable};`}
            className="code generated-sql__output"
          />
          <div className="generated-sql__actions">
            <Button className="actions__execute-button button">
              Выполнить
            </Button>
            <Button className="actions_export-csv-button button">
              Экспорт в CSV
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
