"use client";

import CodeBlock from "@/shared/ui/components/CodeBlock/CodeBlock";
import CopyButton from "@/shared/ui/components/CopyButton/CopyButton";

interface SqlOutputProps {
  sql: string;
}

export default function SqlOutput({ sql }: SqlOutputProps) {
  return (
    <div className="sql-output">
      <h3 className="h3 sql-output__header">Сгенерированный SQL</h3>
      <pre className="sql-output__output">
        <CodeBlock content={sql} />
      </pre>
      <CopyButton content={sql} />
    </div>
  );
}
