"use client";

import {
  Skeleton,
  Table,
  TableColumnConfig,
  TableDataItem,
  Text,
  withTableActions,
  withTableSorting,
} from "@gravity-ui/uikit";
import { Suspense, useState } from "react";
import TableSelectorSidebar from "@shared/ui/components/TableSelectorSidebar";
import useTableNames from "@shared/lib/hooks/useTableNames";
import "./page.sass";

interface FieldMeta {
  name: string;
  type: string;
  restrictions: string;
}

const columns: TableColumnConfig<TableDataItem>[] = [
  { id: "name", name: "Имя поля", primary: true, meta: { sort: true } },
  { id: "type", name: "Тип", meta: { sort: true } },
  { id: "restrictions", name: "Ограничения" },
];

const data: FieldMeta[] = [
  {
    name: "ProductID",
    type: "uint",
    restrictions: "primary key, auto increment",
  },
  { name: "Name", type: "string", restrictions: "not null" },
  { name: "Flavor", type: "string", restrictions: "not null" },
  {
    name: "VolumeML",
    type: "int",
    restrictions: "not null, check: volume_ml > 0",
  },
];

const HocTable = withTableSorting(withTableActions(Table));

const getRowActions = () => {
  return [
    {
      text: "Print",
      handler: () => {},
    },
    {
      text: "Remove",
      handler: () => {},
    },
  ];
};

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
