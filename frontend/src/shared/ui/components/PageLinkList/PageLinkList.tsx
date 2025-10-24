"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import s from "./style.module.sass";

export default function PageLinkList() {
  const pathname = usePathname();
  const links = [
    { href: "/database-structure", label: "Структура БД" },
    { href: "/filtering", label: "Запросы и фильтрация" },
    { href: "/join", label: "Соединения (JOIN)" },
  ];

  return (
    <ul className={s["nav-links"]}>
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li
            key={link.href}
            className={clsx(s["nav-links__item"], {
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
