import { Button } from "@gravity-ui/uikit";
// import s from "./styles.module.sass";
import "./styles.module.sass";

export default function TableSelectorSidebar(props: {
  tableNames: string[];
  setCurrentTable: (arg0: string) => void;
}) {
  return (
    <aside className={`aside ${"table-list"}`}>
      <h2 className={`h2 ${"table-list__title"}`}>Таблицы</h2>
      <ul className={`${"table-list__list"}`}>
        {props.tableNames.map((name) => (
          <li className={`${"table-list__item"}`} key={name}>
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
