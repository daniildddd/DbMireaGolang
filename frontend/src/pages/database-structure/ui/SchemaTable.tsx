import {
  Table as UikitTable,
  TableColumnConfig,
  withTableActions,
  withTableSorting,
} from "@gravity-ui/uikit";
import s from "./style.module.sass";
import { main } from "@/shared/lib/wailsjs/go/models";
import useApiMiddleware from "@/shared/hooks/useApiMiddleware";
import Icons from "@/shared/ui/components/Icons/Icons";
import useNotifications from "@/shared/hooks/useNotifications";

const HocTable = withTableSorting(withTableActions(UikitTable));

const ColumnConfig: TableColumnConfig<main.FieldSchema>[] = [
  { id: "name", name: "Поле", primary: true, meta: { sort: true } },
  { id: "type", name: "Тип", meta: { sort: true } },
  { id: "constraints", name: "Ограничения" },
];

interface SchemaTableProps {
  tableName: string;
  tableSchema: main.FieldSchema[];
}

export default function SchemaTable({ tableName, tableSchema }: SchemaTableProps) {
  const { apiMiddleware } = useApiMiddleware();
  const notifier = useNotifications();

  return (
    <HocTable
      className={s.table}
      data={tableSchema}
      columns={ColumnConfig}
      emptyMessage="Таблица пуста :("
      edgePadding={true}
      getRowActions={(item) => [
        {
          text: "Редактировать",
          handler: () => {},
          icon: <Icons.Pencil />,
        },
        {
          text: "Удалить",
          handler: async () => {
            const response = await apiMiddleware.deleteTableFieldByName({
              tableName,
              fieldName: item.name,
            });
            if (!response.error) {
              notifier.success(`Поле ${item.name} успешно удалено`);
            } else {
              notifier.error(response.message);
            }
          },
          theme: "danger",
          icon: <Icons.TrashBin />,
        },
      ]}
      getRowDescriptor={(item) => item.name}
    />
  );
}
