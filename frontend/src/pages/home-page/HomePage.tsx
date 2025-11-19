"use client";

import PageLinkList from "@/shared/ui/components/PageLinkList/PageLinkList";
import s from "./page.module.sass";
import clsx from "clsx";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import Main from "@/shared/ui/components/Main/Main";

export default function HomePage() {
  const notifier = useNotifications();

  const tryRecreateTables = async () => {
    const result = await ApiMiddleware.recreateTables();
    if (result.success) {
      notifier.success("Таблицы успешно пересозданы");
    } else {
      notifier.error(result.message);
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
          Пересоздать таблицы
        </button>
      </div>
      <PageLinkList />
    </Main>
  );
}
