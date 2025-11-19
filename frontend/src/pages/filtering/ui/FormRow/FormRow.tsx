import { PropsWithChildren } from "react";
import s from "./style.module.sass";

export default function FormRow({
  children,
  label,
}: PropsWithChildren & { label: string }) {
  return (
    <div className={s["form-row"]}>
      <label>{label}</label>
      {children}
    </div>
  );
}
