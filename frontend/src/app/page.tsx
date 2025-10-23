"use client";

import PageLinkList from "@/shared/ui/components/PageLinkList/PageLinkList";
import s from "./page.module.sass";
import clsx from "clsx";
import { Button } from "@gravity-ui/uikit";
import { useState } from "react";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";
import useNotifications from "@/shared/lib/hooks/useNotifications";

export default function Page() {
  const [tablesCreated, setTablesCreated] = useState(false);
  const notifier = useNotifications();

  const tryRecreateTables = async () => {
    if (!tablesCreated) {
      const result = await ApiMiddleware.recreateTables();
      if (result.success) {
        setTablesCreated(true);
        notifier.notify("Таблицы успешно созданы", "success");
      } else {
        notifier.notify(result.message, "error");
      }
    } else {
      notifier.notify("Таблицы уже существуют");
    }
  };

  return (
    <main className={clsx("main", s["index-page"])}>
      <h1 className={clsx("h1", s["index-page_website-title"])}>DB Master</h1>
      <div className={s["db-interactions"]}>
        <Button
          className={clsx("button", s["db-interactions__button"])}
          onClick={tryRecreateTables}
        >
          Создать таблицы
        </Button>
      </div>
      <PageLinkList />
    </main>
  );
}
