import Code from "@/shared/ui/components/Code/Code";
import clsx from "clsx";
import s from "./style.module.sass";
import { generateSqlQuery } from "@/features/sqlQueryGenerator/generateSqlQuery";
import { useContext } from "react";
import FilterContext from "@/shared/context/FilterContext";

export default function GeneratedSQL({
  currentTable,
}: {
  currentTable: string;
}) {
  const { filters, setFilters } = useContext(FilterContext);

  return (
    <div className={s["join-section__generated-sql"]}>
      <h2 className={clsx("h2", s["generated-sql__title"])}>
        Сгенерированный SQL
      </h2>
      <Code
        content={generateSqlQuery("*", currentTable, filters)}
        className={clsx(s.code, s["generated-sql__output"])}
      />
      <div className={s["generated-sql__actions"]}>
        <button className={clsx("button", s["actions__execute-button"])}>
          Выполнить
        </button>
        <button className={clsx("button", s["actions_export-csv-button"])}>
          Экспорт в CSV
        </button>
      </div>
    </div>
  );
}
