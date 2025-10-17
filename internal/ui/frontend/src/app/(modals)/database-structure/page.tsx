"use client";

import {
  Button,
  Skeleton,
  Table,
  TableColumnConfig,
  TableDataItem,
  Text,
  withTableActions,
  withTableSorting,
} from "@gravity-ui/uikit";
import { Suspense, useEffect, useState } from "react";
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
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [currentTable, setCurrentTable] = useState<string>(tableNames[0]);

  // Initial parse of table names
  useEffect(() => {
    const mock = ["name1", "name2", "name3"];
    setTableNames(mock);
  }, []);

  return (
    <main className="main">
      <aside className="aside table-list">
        <h2 className="h2 table-list__title">Таблицы</h2>
        <ul className="table-list__list">
          {tableNames.map((name) => (
            <li className="table-list__item" key={name}>
              <Button
                onClick={() => {
                  setCurrentTable(name);
                }}
              >
                {name}
              </Button>
            </li>
          ))}
        </ul>
      </aside>
      <section className="table-section">
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
    </main>
  );
}
