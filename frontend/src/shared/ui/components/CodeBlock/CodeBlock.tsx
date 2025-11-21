import clsx from "clsx";
import s from "./style.module.sass";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter, {
  SupportedLanguages,
} from "../SyntaxHighlighter/SyntaxHighlighter";

interface CodeBlockProps {
  content: string;
  language?: SupportedLanguages;
  className?: string;
}

export default function CodeBlock({
  content,
  language = "sql",
  className = "",
}: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={docco}
      className={clsx(className, s.code)}
    >
      {content}
    </SyntaxHighlighter>
  );
}
