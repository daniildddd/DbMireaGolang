import s from "./style.module.sass";
import clsx from "clsx";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import { useContext } from "react";
import { GlobalContext } from "@/shared/context/GlobalContext";

export default function AsideTableSelector() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useContext(GlobalContext);

  return (
    <aside className={s.aside}>
      <h2 className={clsx(s["aside__title"])}>Таблицы</h2>
      <hr />
      <ul className={s["table-list"]}>
        {tableNames.map((name) => (
          <li className={s["table-list__item"]} key={name}>
            <button
              className={clsx("button", {
                active: name === globalContext.currentTable,
              })}
              onClick={() => {
                setGlobalContext({ ...globalContext, currentTable: name });
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
