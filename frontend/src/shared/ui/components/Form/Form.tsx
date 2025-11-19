import { PropsWithChildren } from "react";

export default function Form({
  children,
  formId,
  onSubmit,
}: PropsWithChildren & { formId: string; onSubmit: (...args: any) => void }) {
  return (
    <form className="form" onSubmit={onSubmit} id={formId}>
      {children}
    </form>
  );
}
