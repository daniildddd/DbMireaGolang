// app/(modals)/join/ui/SqlOutput.tsx
"use client";

import { Card, Text } from "@gravity-ui/uikit";
import Code from "@shared/ui/components/Code/Code";
import CopyButton from "@shared/ui/components/CopyButton";

interface SqlOutputProps {
  sql: string;
}

export default function SqlOutput({ sql }: SqlOutputProps) {
  return (
    <Card className="sql-output">
      <Text variant="subheader-1" className="h3 sql-output__header" as="h3">
        Сгенерированный SQL
      </Text>
      <pre className="sql-output__output">
        <Code content={sql} />
      </pre>
      <CopyButton content={sql} />
    </Card>
  );
}
