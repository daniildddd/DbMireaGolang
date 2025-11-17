import clsx from "clsx";
import { PropsWithChildren } from "react";
import s from "./style.module.sass";

export default function Main({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  return <main className={clsx(s.main, className)}>{children}</main>;
}
