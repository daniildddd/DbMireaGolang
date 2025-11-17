import s from "./style.module.sass";
import clsx from "clsx";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import { useTableContext } from "@/shared/lib/hooks/useTableContext";

export default function AsideTableSelector() {
  const tableNames = useTableNames();
  const { currentTable, setCurrentTable } = useTableContext();

  return (
    <aside className={s.aside}>
      <h2 className={clsx(s["aside__title"])}>Таблицы</h2>
      <hr />
      <ul className={s["table-list"]}>
        {tableNames.map((name) => (
          <li className={s["table-list__item"]} key={name}>
            <button
              className={clsx("button", { active: name === currentTable })}
              onClick={() => {
                setCurrentTable(name);
              }}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
