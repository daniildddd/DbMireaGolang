import { Notifier } from "@/shared/lib/hooks/useNotifications";

/** Вызывает коллбек, если форма валидна
 * @param {React.FormEvent} e - параметр события onSubmit
 * @param {HTMLFormElement} form - референс на элемент form
 * @param {Notifier} notifier
 * @param {Function} cb - колбек
 */
export default function onSubmitCallback(
  e: React.FormEvent,
  form: HTMLFormElement,
  notifier: Notifier,
  cb: () => void
) {
  e.preventDefault();
  if (!form || !form.checkValidity()) {
    form?.reportValidity();
    notifier.error("Пожалуйста, заполните все обязательные поля");
  } else {
    cb();
  }
}
