import { Button } from "@gravity-ui/uikit";
import clsx from "clsx";
import s from "./style.module.sass";

export default function CopyButton({ content }: { content: string }) {
  return (
    <Button
      className={clsx(s["copy-button"], s.button)}
      view="flat"
      size="s"
      onClick={() => navigator.clipboard.writeText(content)}
    >
      Копировать
    </Button>
  );
}
