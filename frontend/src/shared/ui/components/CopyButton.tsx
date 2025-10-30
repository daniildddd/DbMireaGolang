import clsx from "clsx";
import s from "./style.module.sass";

export default function CopyButton({ content }: { content: string }) {
  return (
    <button
      className={clsx(s["copy-button"], "button")}
      onClick={() => navigator.clipboard.writeText(content)}
    >
      Копировать
    </button>
  );
}
