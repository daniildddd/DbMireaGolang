import { Card } from "@gravity-ui/uikit";
import { PropsWithChildren } from "react";

export default function JoinSectionCard({ children }: PropsWithChildren) {
  return <Card className="grid__grid-item">{children}</Card>;
}
