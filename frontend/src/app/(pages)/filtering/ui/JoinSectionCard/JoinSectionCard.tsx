import { PropsWithChildren } from "react";
import s from "./style.module.sass";

export default function JoinSectionCard({ children }: PropsWithChildren) {
  return <div className={s["grid__grid-item"]}>{children}</div>;
}
