"use client";

import PageLinkList from "@/shared/ui/components/PageLinkList/PageLinkList";
import s from "./page.module.sass";
import clsx from "clsx";

export default function Page() {
  return (
    <main className={clsx("main", s["index-page"])}>
      <h1 className={clsx("h1", s["index-page_website-title"])}>DB Master</h1>
      <PageLinkList className="vertical" />
    </main>
  );
}
