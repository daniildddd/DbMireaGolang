import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import sql from "react-syntax-highlighter/dist/esm/languages/hljs/sql";
export type SupportedLanguages = "sql";

document.addEventListener("loadend", () => {
  SyntaxHighlighter.registerLanguage("sql", sql);
});

export default SyntaxHighlighter;
