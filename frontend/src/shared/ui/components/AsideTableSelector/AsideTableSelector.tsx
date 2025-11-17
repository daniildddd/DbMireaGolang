import s from "./style.module.sass";
import clsx from "clsx";
import useTableNames from "@/shared/lib/hooks/useTableNames";

export default function AsideTableSelector({
  setCurrentTable,
}: {
  setCurrentTable: (arg0: string) => void;
}) {
  const tableNames = useTableNames();

  return (
    <aside className={s.aside}>
      <h2 className={clsx(s["aside__title"])}>Таблицы</h2>
      <hr />
      <ul className={s["table-list"]}>
        {tableNames.map((name) => (
          <li className={s["table-list__item"]} key={name}>
            <button
              className="button"
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
