import { Button, Text } from "@gravity-ui/uikit";
import s from "./style.module.sass";
import clsx from "clsx";

export default function TableSelectorSidebar(props: {
  tableNames: string[];
  setCurrentTable: (arg0: string) => void;
}) {
  return (
    <aside className={clsx(s["aside"])}>
      <Text as="h2" className={clsx(s["aside__title"])}>
        Таблицы
      </Text>
      <hr />
      <ul className={s["table-list"]}>
        {props.tableNames.map((name) => (
          <li className={s["table-list__item"]} key={name}>
            <Button
              onClick={() => {
                props.setCurrentTable(name);
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
