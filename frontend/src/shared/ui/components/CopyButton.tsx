import { Button } from "@gravity-ui/uikit";
import clsx from "clsx";

export default function CopyButton({ content }: { content: string }) {
  return (
    <Button
      className={clsx("copy-button", "button")}
      view="flat"
      size="s"
      onClick={() => navigator.clipboard.writeText(content)}
    >
      Копировать
    </Button>
  );
}
