import Link from "next/link";

export default function AppModalLinkList() {
  return (
    <ul className="nav__links">
      <li className="nav__link-item">
        <Link href="database-structure">Структура БД</Link>
      </li>
      <li className="nav__link-item">
        <Link href="join">Запросы и фильтрация</Link>
      </li>
      <li className="nav__link-item">
        <Link href="querying">Соединения (JOIN)</Link>
      </li>
    </ul>
  );
}
