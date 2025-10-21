"use client";

import {
  Skeleton,
  Table,
  Text,
  withTableActions,
  withTableSorting,
} from "@gravity-ui/uikit";
import { Suspense, useState } from "react";
import TableSelectorSidebar from "@shared/ui/components/TableSelectorSidebar/TableSelectorSidebar";
import useTableNames from "@shared/lib/hooks/useTableNames";
import "./page.sass";
import { data, columns } from "./mock/data";
import getRowActions from "./lib/getRowActions";

const HocTable = withTableSorting(withTableActions(Table));

export default function Page() {
  const tableNames = useTableNames();
  const [currentTable, setCurrentTable] = useState<string>(tableNames[0]);

  return (
    <>
      <TableSelectorSidebar
        tableNames={tableNames}
        setCurrentTable={setCurrentTable}
      />
      <section className="section table-section">
        <h2 className="h2 table-section__title">
          Структура таблицы: {currentTable}
        </h2>
        <Suspense fallback={<Skeleton />}>
          <HocTable
            className="table"
            data={data}
            columns={columns}
            emptyMessage="Таблица пуста :(" // Если вся табшица пустая
            edgePadding={true}
            getRowActions={getRowActions}
            renderRowActions={({ item }) => <Text>{item.text}</Text>}
          />
        </Suspense>
      </section>
    </>
  );
}
