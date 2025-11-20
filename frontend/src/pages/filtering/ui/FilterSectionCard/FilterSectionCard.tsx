import { PropsWithChildren } from "react";
import s from "./style.module.sass";

export default function FilterSectionCard({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  return (
    <div className={s["grid__grid-item"]}>
      <h3 className={s["filter-card__title"]}>{title}</h3>
      {children}
    </div>
  );
}
