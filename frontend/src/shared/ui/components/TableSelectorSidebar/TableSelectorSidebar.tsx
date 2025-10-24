import { Button, Text } from "@gravity-ui/uikit";
import s from "./style.module.sass";
import clsx from "clsx";
import useTableNames from "@/shared/lib/hooks/useTableNames";

export default function TableSelectorSidebar({
  setCurrentTable,
}: {
  setCurrentTable: (arg0: string) => void;
}) {
  const tableNames = useTableNames();

  return (
    <aside className={clsx(s["aside"])}>
      <Text as="h2" className={clsx(s["aside__title"])}>
        Таблицы
      </Text>
      <hr />
      <ul className={s["table-list"]}>
        {tableNames.map((name) => (
          <li className={s["table-list__item"]} key={name}>
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
  );
}
