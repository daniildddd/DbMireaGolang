import PageLinkList from "@/shared/ui/components/PageLinkList/PageLinkList";
import { Link } from "react-router-dom";
import s from "./style.module.sass";

export default function Header() {
  return (
    <header className={s.header}>
      <h1>
        <Link to="/" className={s["header-title"]}>
          DB Master
        </Link>
      </h1>
      <PageLinkList />
    </header>
  );
}
