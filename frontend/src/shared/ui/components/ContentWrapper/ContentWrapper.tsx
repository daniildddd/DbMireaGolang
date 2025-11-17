import { PropsWithChildren } from "react";
import s from "./style.module.sass";

export default function ContextWrapper({ children }: PropsWithChildren) {
  return <div className={s["content-wrapper"]}>{children}</div>;
}
