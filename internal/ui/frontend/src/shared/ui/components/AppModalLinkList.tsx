"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function AppModalLinkList() {
  const pathname = usePathname();

  const links = [
    { href: "/database-structure", label: "Структура БД" },
    { href: "/querying", label: "Запросы и фильтрация" },
    { href: "/join", label: "Соединения (JOIN)" },
  ];

  return (
    <ul className="nav__links">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li
            key={link.href}
            className={clsx("nav-links__item", {
              active: isActive,
            })}
          >
            <Link href={link.href}>{link.label}</Link>
          </li>
        );
      })}
    </ul>
  );
}
