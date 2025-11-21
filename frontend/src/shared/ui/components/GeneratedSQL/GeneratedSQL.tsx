import Code from "@/shared/ui/components/Code/Code";
import clsx from "clsx";
import s from "./style.module.sass";
import { useState } from "react";

interface GeneratedSQLProps {
  query: string;
  onExecute?: (query: string) => Promise<void>;
}

export default function GeneratedSQL({ query, onExecute }: GeneratedSQLProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExecute = async () => {
    if (!onExecute || !query.trim()) return;

    try {
      setIsLoading(true);
      await onExecute(query);
    } catch (error) {
      console.error("Ошибка выполнения запроса:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={s["join-section__generated-sql"]}>
      <h2 className={clsx("h2", s["generated-sql__title"])}>
        Сгенерированный SQL
      </h2>
      <Code
        content={query}
        className={clsx(s.code, s["generated-sql__output"])}
      />
      <div className={s["generated-sql__actions"]}>
        <button
          className={clsx("button", s["actions__execute-button"])}
          onClick={handleExecute}
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? "Выполнение..." : "Выполнить"}
        </button>
      </div>
    </div>
  );
}
