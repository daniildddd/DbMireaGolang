"use client";

import PageLinkList from "@/shared/ui/components/PageLinkList/PageLinkList";
import s from "./page.module.sass";
import clsx from "clsx";
import { useState } from "react";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import Main from "@/shared/ui/components/Main/Main";

export default function HomePage() {
  const [tablesCreated, setTablesCreated] = useState(false);
  const notifier = useNotifications();

  const tryRecreateTables = async () => {
    if (!tablesCreated) {
      const result = await ApiMiddleware.recreateTables();
      if (result.success) {
        setTablesCreated(true);
        notifier.success("Таблицы успешно созданы");
      } else {
        notifier.error(result.message);
      }
    } else {
      notifier.error("Таблицы уже существуют");
    }
  };

  return (
    <Main className={s["index-page"]}>
      <h1 className={clsx("h1", s["index-page_website-title"])}>DB Master</h1>
      <div className={s["db-interactions"]}>
        <button
          className={clsx("button", s["db-interactions__button"])}
          onClick={tryRecreateTables}
        >
          Создать таблицы
        </button>
      </div>
      <PageLinkList />
    </Main>
  );
}
