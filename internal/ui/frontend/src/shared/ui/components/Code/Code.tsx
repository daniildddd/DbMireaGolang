import styles from "./styles.module.sass";

export default function Code({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  return <code className={`${styles.code} ${className}`}>{content}</code>;
}
