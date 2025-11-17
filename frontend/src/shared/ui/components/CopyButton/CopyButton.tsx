import clsx from "clsx";

export default function CopyButton({ content }: { content: string }) {
  return (
    <button
      className={clsx("copy-button", "button")}
      onClick={() => navigator.clipboard.writeText(content)}
    >
      Копировать
    </button>
  );
}
