import { Theme, toast } from "react-toastify";

type NotificationType = "warn" | "info" | "error" | "success";

function customToast(
  messageType: NotificationType
): (arg0: string, arg1?: object) => void {
  switch (messageType) {
    case "warn":
      return toast.warn;
    case "error":
      return toast.error;
    case "success":
      return toast.success;
    default:
      return toast.info;
  }
}

function notify(
  message: string | Error,
  type: NotificationType = "info",
  theme: Theme = "light"
) {
  customToast(type)(message.toString(), {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    theme,
  });
}

export interface Notifier {
  notify: (
    message: string | Error,
    type?: NotificationType,
    theme?: Theme
  ) => void;
  error: (message: string | Error, theme?: Theme) => void;
  warn: (message: string | Error, theme?: Theme) => void;
  success: (message: string | Error, theme?: Theme) => void;
}

export default function useNotifications(): Notifier {
  const notifier: Notifier = {
    notify: notify,
    warn: (message, theme) => notify(message, "warn", theme),
    error: (message, theme) => notify(message, "error", theme),
    success: (message, theme) => notify(message, "success", theme),
  };
  return notifier;
}
