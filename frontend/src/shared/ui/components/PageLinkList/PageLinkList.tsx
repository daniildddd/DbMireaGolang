"use client";
import { NavLink } from "react-router-dom";
import s from "./style.module.sass";
import clsx from "clsx";

function getClassNames({ isActive }: { isActive: boolean }) {
  return clsx(s["nav-links__item"], { active: isActive });
}

export default function PageLinkList() {
  return (
    <nav className={s["nav-links"]}>
      <NavLink to="/database-structure" className={getClassNames}>
        Структура БД
      </NavLink>
      <NavLink to="/filtering" className={getClassNames}>
        Запросы и фильтрация
      </NavLink>
      <NavLink to="/join" className={getClassNames}>
        Соединения (JOIN)
      </NavLink>
      <NavLink to="/custom-types" className={getClassNames}>
        Пользовательские типы
      </NavLink>
    </nav>
  );
}
