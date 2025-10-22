import { TableColumnConfig, TableDataItem } from "@gravity-ui/uikit";
import { FieldMeta } from "../types";

export const columns: TableColumnConfig<TableDataItem>[] = [
  { id: "name", name: "Имя поля", primary: true, meta: { sort: true } },
  { id: "type", name: "Тип", meta: { sort: true } },
  { id: "restrictions", name: "Ограничения" },
];

export const data: FieldMeta[] = [
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
