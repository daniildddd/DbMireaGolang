import s from "./style.module.sass";
import clsx from "clsx";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";
import notifyAndReturn from "@/shared/lib/utils/notifyAndReturn";
import Loading from "../Loading/Loading";
import useNotifications from "@/shared/lib/hooks/useNotifications";

export default function AsideTableSelector() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useGlobalContext();
  const notifier = useNotifications();

  if (tableNames.isPending) return <Loading />;
  if (tableNames.error) return notifyAndReturn(notifier, tableNames.error);
  if (tableNames.data.length === 0) return <div>В базе данных нет таблиц</div>;

  return (
    <aside className={s.aside}>
      <h2 className={clsx(s["aside__title"])}>Таблицы</h2>
      <hr />
      <ul className={s["table-list"]}>
        {tableNames.data.map((name) => (
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
