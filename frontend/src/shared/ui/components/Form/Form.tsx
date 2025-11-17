import { PropsWithChildren, RefObject } from "react";
import s from "./style.module.sass";
import clsx from "clsx";
import CancelButton from "./components/CancelButton";
import SubmitButton from "./components/SubmitButton";

export default function Form({
  ref,
  method,
  children,
  formId,
  handleCloseModal,
  onSubmit,
}: PropsWithChildren & {
  ref: RefObject<HTMLFormElement>;
  method: "get" | "post";
  formId: string;
  handleCloseModal: (open: boolean) => void;
  onSubmit: (e: any) => void;
}) {
  return (
    <form
      ref={ref}
      action="."
      method={method}
      className={clsx(s.form, formId)}
      id={formId}
      onSubmit={onSubmit}
    >
      {children}
      <div className={s["modal-buttons"]}>
        <CancelButton handleCloseModal={handleCloseModal} />
        <SubmitButton formId={formId} />
      </div>
    </form>
  );
}
