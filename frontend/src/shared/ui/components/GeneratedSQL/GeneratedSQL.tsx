import Code from "@/shared/ui/components/Code/Code";
import clsx from "clsx";
import s from "./style.module.sass";

interface GeneratedSQLProps {
  query: string;
}

export default function GeneratedSQL({ query }: GeneratedSQLProps) {
  return (
    <div className={s["join-section-generated-sql"]}>
      <h2 className={clsx("h2", s["generated-sql-title"])}>
        Сгенерированный SQL
      </h2>
      <Code
        content={query}
        className={clsx(s.code, s["generated-sql-output"])}
      />
      <div className={s["generated-sql-actions"]}>
        <button className={clsx("button", s["actions-execute-button"])}>
          Выполнить
        </button>
      </div>
    </div>
  );
}
