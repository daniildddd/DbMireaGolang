import { Button } from "@gravity-ui/uikit";

export default function CopyButton({ content }: { content: string }) {
  return (
    <Button
      className="copy-button button"
      view="flat"
      size="s"
      onClick={() => navigator.clipboard.writeText(content)}
    >
      Копировать
    </Button>
  );
}
