// app/(modals)/join/ui/JoinPage.tsx
"use client";

import { Card, Text, Button } from "@gravity-ui/uikit";
import { useState } from "react";
import TableSelector from "./ui/TableSelector";
import SqlOutput from "./ui/SqlOutput";
import { generateSQL } from "./lib/sqlGenerator";
import TableSelectorSidebar from "@shared/ui/components/TableSelectorSidebar";
import useTableNames from "@shared/lib/hooks/useTableNames";
import "./page.sass";

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
      <TableSelectorSidebar
        tableNames={tableNames}
        setCurrentTable={setCurrentTable}
      />
      <section className="section join-section">
        <div className="join-section__header">
          <Text className="h1 join-section__title" as="h1">
            Соединения (JOIN) таблиц
          </Text>
          <Text as="p" className="p smaller join-section__description">
            Выберите таблицы и сгенерируйте SQL-запрос
          </Text>
        </div>
        <Card className="join-section__available-tables-list">
          <Text variant="subheader-1" className="h3" as="h3">
            Доступные таблицы
          </Text>
          <TableSelector
            selected={selectedTables}
            onChange={setSelectedTables}
          />
        </Card>
        <Card>
          <Button
            className="button important join-section__submit"
            view="action"
            size="l"
            onClick={handleGenerateSQL}
          >
            Сгенерировать SQL
          </Button>
        </Card>
        {sql && <SqlOutput sql={sql} />}
      </section>
    </>
  );
}
