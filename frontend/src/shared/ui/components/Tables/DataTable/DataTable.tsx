import {
  Table as UikitTable,
  TableColumnConfig,
  withTableSorting,
} from "@gravity-ui/uikit";
import { TableData } from "@/types";

const HocTable = withTableSorting(UikitTable);

interface DataTableProps {
  data: TableData;
}

function sortString(arr: string[]): string[] {
  return arr.toSorted((a, b) => {
    return a < b ? -1 : 1;
  });
}

function prepareColumns(columns: string[]) {
  let primaryColumnIndex = 0;
  for (let i = 0; i < columns.length; i++) {
    if (columns[i].includes("id")) {
      primaryColumnIndex = i;
    }
  }

  const primaryColumnName = columns[primaryColumnIndex];
  const columnsWithoutPrimaryKey = columns.toSpliced(primaryColumnIndex, 1);

  const sortedColumns = sortString(columnsWithoutPrimaryKey);
  return [primaryColumnName, ...sortedColumns];
}

export default function DataTable({ data }: DataTableProps) {
  const columnConfig: TableColumnConfig<TableData>[] = prepareColumns(
    data.columns
  ).map((column) => {
    return { id: column, meta: { sort: true } };
  });

  return (
    <HocTable
      className={"table"}
      /* @ts-ignore */
      data={data.rows}
      columns={columnConfig}
      emptyMessage="Таблица пуста :("
      edgePadding={true}
      getRowDescriptor={(item) => item.name}
    />
  );
}
