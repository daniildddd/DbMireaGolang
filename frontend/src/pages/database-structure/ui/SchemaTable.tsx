import {
  Table,
  TableColumnConfig,
  withTableActions,
  withTableSorting,
} from "@gravity-ui/uikit";
import s from "./style.module.sass";
import { main } from "@/shared/lib/wailsjs/go/models";
import useApiMiddleware from "@/shared/lib/hooks/useApiMiddleware";
import Icons from "@/shared/ui/components/Icons/Icons";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import EditFieldModal from "./EditFieldModal";

const HocTable = withTableSorting(withTableActions(Table));

const ColumnConfig: TableColumnConfig<main.FieldSchema>[] = [
  { id: "name", name: "Поле", primary: true, meta: { sort: true } },
  { id: "type", name: "Тип", meta: { sort: true } },
  { id: "constraints", name: "Ограничения" },
];

interface SchemaTableProps {
  tableName: string;
  tableSchema: main.FieldSchema[];
}

export default function SchemaTable({
  tableName,
  tableSchema,
}: SchemaTableProps) {
  const { apiMiddleware } = useApiMiddleware();
  const notifier = useNotifications();
  const { globalContext } = useGlobalContext();
  const queryClient = useQueryClient();
  const [editingField, setEditingField] = useState<main.FieldSchema | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <HocTable
        className={s.table}
        data={tableSchema}
        columns={ColumnConfig}
        emptyMessage="Таблица пуста :("
        edgePadding={true}
        getRowActions={(item: main.FieldSchema) => [
          {
            text: "Редактировать",
            handler: () => {
              setEditingField(item);
              setIsEditModalOpen(true);
            },
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
                // Инвалидируем кеш чтобы обновить схему таблицы
                queryClient.invalidateQueries({
                  queryKey: ["tableSchema", globalContext.currentTable],
                });
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

      <EditFieldModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingField(null);
        }}
        tableName={tableName}
        field={editingField}
      />
    </>
  );
}
