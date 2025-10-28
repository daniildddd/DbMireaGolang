import {
  Skeleton,
  Table,
  TableColumnConfig,
  withTableActions,
  withTableSorting,
} from "@gravity-ui/uikit";
import { Suspense } from "react";
import getRowActions from "../lib/getRowActions";
import s from "./style.module.sass";
import { main } from "@/shared/lib/wailsjs/go/models";

const HocTable = withTableSorting(withTableActions(Table));
const ColumnConfig: TableColumnConfig<main.FieldSchema>[] = [
  { id: "name", name: "Поле", primary: true, meta: { sort: true } },
  { id: "type", name: "Тип", meta: { sort: true } },
  { id: "constraints", name: "Ограничения" },
];

export default function SchemaTable({ data }: { data: main.FieldSchema[] }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <HocTable
        className={s.table}
        data={data}
        columns={ColumnConfig}
        emptyMessage="Таблица пуста :(" // Если вся табшица пустая
        edgePadding={true}
        getRowActions={getRowActions}
        renderRowActions={({ item }) => <span>{item.text}</span>}
      />
    </Suspense>
  );
}
