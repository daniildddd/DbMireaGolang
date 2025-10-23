import { Card } from "@gravity-ui/uikit";
import { PropsWithChildren } from "react";
import s from "./style.module.sass";

export default function JoinSectionCard({ children }: PropsWithChildren) {
  return <Card className={s["grid__grid-item"]}>{children}</Card>;
}
