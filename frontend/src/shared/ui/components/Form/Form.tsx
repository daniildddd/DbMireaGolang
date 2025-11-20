import { PropsWithChildren } from "react";
import s from "./Form.module.sass";

export default function Form({
  children,
  formId,
  onSubmit,
}: PropsWithChildren & { formId: string; onSubmit: (...args: any) => void }) {
  return (
    <form className={s.form} onSubmit={onSubmit} id={formId}>
      {children}
    </form>
  );
}
