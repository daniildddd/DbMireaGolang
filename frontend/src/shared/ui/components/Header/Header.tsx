import PageLinkList from "@/shared/ui/components/PageLinkList/PageLinkList";
import s from "./style.module.sass";
import Link from "next/link";
import clsx from "clsx";

export default function Header({
  connectedDbName = "N/A",
}: {
  connectedDbName?: string;
}) {
  return (
    <header className={s.header}>
      <div className={s["header__primary-row"]}>
        <div className={s["header__website-meta"]}>
          <h1 className={clsx(s["website-meta__title"])}>
            <Link href="/">DB Master</Link>
          </h1>
          <span className={s["website-meta__db-name"]}>
            Подключено к {connectedDbName}
          </span>
        </div>
      </div>
      <PageLinkList />
    </header>
  );
}
