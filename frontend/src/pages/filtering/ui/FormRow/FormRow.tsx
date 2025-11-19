import { PropsWithChildren } from "react";
import s from "./style.module.sass";

export default function FormRow({ children }: PropsWithChildren) {
  return <div className={s["form-row"]}>{children}</div>;
}
