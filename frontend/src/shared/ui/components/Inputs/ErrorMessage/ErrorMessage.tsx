import { PropsWithChildren } from "react";
import s from "./ErrorMessage.module.sass";

export default function ErrorMessage({ children }: PropsWithChildren) {
  return <span className={s["error-message"]}>{children}</span>;
}
