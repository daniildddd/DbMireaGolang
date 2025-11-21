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
        Схема базы данных
      </NavLink>
      <NavLink to="/filtering" className={getClassNames}>
        SELECT
      </NavLink>
      <NavLink to="/join" className={getClassNames}>
        JOIN
      </NavLink>
      <NavLink to="/insert" className={getClassNames}>
        INSERT
      </NavLink>
      <NavLink to="/manage-types" className={getClassNames}>
        Типы данных
      </NavLink>
    </nav>
  );
}
