import { TableActionConfig } from "@gravity-ui/uikit";
import { main } from "@/shared/lib/wailsjs/go/models";
import Icons from "@/shared/ui/components/Icons/Icons";

export default function getRowActions<T>(
  item: main.FieldSchema,
  index: number
): TableActionConfig<T>[] {
  return [
    {
      text: "Редактировать",
      handler: () => {
        console.log("Редактирование поля:", item.name);
      },
      icon: <Icons.Pencil />,
    },
    {
      text: "Удалить",
      handler: () => {
        console.log("Удаление поля:", item.name);
      },
      theme: "danger",
      icon: <Icons.TrashBin />,
    },
  ];
}
