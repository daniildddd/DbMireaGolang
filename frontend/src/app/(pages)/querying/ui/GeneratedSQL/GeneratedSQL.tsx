import Code from "@/shared/ui/components/Code/Code";
import { Button, Text } from "@gravity-ui/uikit";
import clsx from "clsx";
import s from "./style.module.sass";

export default function GeneratedSQL({
  currentTable,
}: {
  currentTable: string;
}) {
  return (
    <div className={s["join-section__generated-sql"]}>
      <Text className={clsx("h2", s["generated-sql__title"])} as="h2">
        Сгенерированный SQL
      </Text>
      <Code
        content={`SELECT * FROM ${currentTable};`}
        className={clsx(s.code, s["generated-sql__output"])}
      />
      <div className={s["generated-sql__actions"]}>
        <Button className={clsx(s["actions__execute-button"], "button")}>
          Выполнить
        </Button>
        <Button className={clsx(s["actions_export-csv-button"], "button")}>
          Экспорт в CSV
        </Button>
      </div>
    </div>
  );
}
