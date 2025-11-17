import { useRef } from "react";

export default function useFormRef() {
  const formRef = useRef<HTMLFormElement>(document.createElement("form"));
  return formRef;
}
