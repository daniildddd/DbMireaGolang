"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import styles from "./styles.module.sass";

export default function AppModalLinkList({
  className = "",
}: {
  className?: string;
}) {
  const pathname = usePathname();
  const links = [
    { href: "/database-structure", label: "Структура БД" },
    { href: "/querying", label: "Запросы и фильтрация" },
    { href: "/join", label: "Соединения (JOIN)" },
  ];

  return (
    <ul className={clsx(styles["nav-links"], className)}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li
            key={link.href}
            className={clsx(styles["nav-links__item"], {
              [styles.active]: isActive,
            })}
          >
            <Link href={link.href}>{link.label}</Link>
          </li>
        );
      })}
    </ul>
  );
}
