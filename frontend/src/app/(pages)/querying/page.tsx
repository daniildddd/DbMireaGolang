"use client";

import { Button, Text } from "@gravity-ui/uikit";
import { useState } from "react";
import TableSelectorSidebar from "@shared/ui/components/TableSelectorSidebar/TableSelectorSidebar";
import useTableNames from "@shared/lib/hooks/useTableNames";
import JoinSectionCard from "./ui/JoinSectionCard/JoinSectionCard";
import CardRow from "./ui/CardRow/CardRow";
import Code from "@shared/ui/components/Code/Code";
import s from "./page.module.sass";
import clsx from "clsx";
import WhereModal from "./ui/modals/WhereModal";

export default function Page() {
  const tableNames = useTableNames();
  const [currentTable, setCurrentTable] = useState<string>(tableNames[0]);
  const [returnValues, setReturnValues] = useState<object>({});
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <TableSelectorSidebar
        tableNames={tableNames}
        setCurrentTable={setCurrentTable}
      />
      <section className={clsx("section", s["join-section"])}>
        <div className={s["join-section__grid"]}>
          <JoinSectionCard>
            <CardRow
              title="Фильтры (WHERE)"
              buttonText="Добавить фильтр"
              modal={
                <WhereModal
                  open={open}
                  setOpen={setOpen}
                  setReturnValues={(newValues) => {
                    setReturnValues({ ...returnValues, ...newValues });
                  }}
                  fields={[{ name: "test", type: "UInt32" }]}
                />
              }
              onClick={() => {
                setOpen(true);
              }}
            />
          </JoinSectionCard>
          <JoinSectionCard>
            <CardRow title="Сортировка" buttonText="Добавить сортировку" />
            <CardRow
              title="Группировка (GROUP BY)"
              buttonText="Добавить группировку"
            />
          </JoinSectionCard>
          <JoinSectionCard>
            <CardRow title="Агрегатные функции" buttonText="Добавить агрегат" />
            <CardRow
              title="Фильтр групп (HAVING)"
              buttonText="Добавить HAVING"
            />
          </JoinSectionCard>
        </div>
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
      </section>
    </>
  );
}
