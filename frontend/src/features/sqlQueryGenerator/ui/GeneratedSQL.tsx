import CodeBlock from "@/shared/ui/components/CodeBlock/CodeBlock";
import clsx from "clsx";
import s from "./style.module.sass";

interface GeneratedSQLProps {
  query: string;
}

export default function GeneratedSQL({ query }: GeneratedSQLProps) {
  return (
    <div className={s["join-section__generated-sql"]}>
      <h2 className={clsx("h2", s["generated-sql__title"])}>
        Сгенерированный SQL
      </h2>
      <CodeBlock
        content={query}
        className={clsx(s.code, s["generated-sql__output"])}
      />
    </div>
  );
}
