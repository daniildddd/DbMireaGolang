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

export default function useNotifications() {
  return {
    notify: (
      message: string,
      type: NotificationType = "info",
      theme: Theme = "light"
    ) => {
      customToast(type)(message, {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        theme,
      });
    },
  };
}
