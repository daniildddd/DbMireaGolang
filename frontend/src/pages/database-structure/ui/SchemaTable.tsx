import {
  Table,
  TableColumnConfig,
  withTableActions,
  withTableSorting,
} from "@gravity-ui/uikit";
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
    <HocTable
      className={s.table}
      data={data}
      columns={ColumnConfig}
      emptyMessage="Таблица пуста :("
      edgePadding={true}
      getRowActions={getRowActions}
      getRowDescriptor={(item) => item.name} // Важно: уникальный идентификатор для каждой строки
    />
  );
}
