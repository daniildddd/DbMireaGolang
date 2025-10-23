import clsx from "clsx";
import s from "./style.module.sass";

export default function Code({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  return <code className={clsx(className, s.code)}>{content}</code>;
}
