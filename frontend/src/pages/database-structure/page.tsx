"use client";

import { useEffect, useState } from "react";
import AsideTableSelector from "@/shared/ui/components/AsideTableSelector/AsideTableSelector";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import clsx from "clsx";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";
import { main } from "@/shared/lib/wailsjs/go/models";
import s from "./page.module.sass";
import SchemaTable from "./ui/SchemaTable";
import Header from "@/shared/ui/components/Header/Header";
import Main from "@/shared/ui/components/Main/Main";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";

export default function DatabaseStructurePage() {
  const tableNames = useTableNames();
  const [currentTable, setCurrentTable] = useState<string>(tableNames[0]);
  const [tableSchema, setTableSchema] = useState<main.FieldSchema[]>([]);

  useEffect(() => {
    ApiMiddleware.getTableSchema(currentTable).then((schema) =>
      setTableSchema(schema)
    );
  }, [currentTable]);

  return (
    <ContentWrapper>
      <Header />
      <AsideTableSelector setCurrentTable={setCurrentTable} />
      <Main>
        <section className={clsx("section", s["table-section"])}>
          <h2 className={clsx("h2", s["table-section__title"])}>
            Структура таблицы: {currentTable}
          </h2>
          <SchemaTable data={tableSchema} />
        </section>
      </Main>
    </ContentWrapper>
  );
}
