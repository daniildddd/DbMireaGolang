import "./styles.module.sass";

export default function Code({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  return <code className={`code ${className}`}>{content}</code>;
}
