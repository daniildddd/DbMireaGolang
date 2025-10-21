import { Button } from "@gravity-ui/uikit";
import styles from "./styles.module.sass";

export default function TableSelectorSidebar(props: {
  tableNames: string[];
  setCurrentTable: (arg0: string) => void;
}) {
  return (
    <aside className={`aside ${styles["table-list"]}`}>
      <h2 className={`h2 ${styles["table-list__title"]}`}>Таблицы</h2>
      <ul className={`${styles["table-list__list"]}`}>
        {props.tableNames.map((name) => (
          <li className={`${styles["table-list__item"]}`} key={name}>
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
