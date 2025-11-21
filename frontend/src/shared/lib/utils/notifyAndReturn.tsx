import { Notifier } from "@/shared/hooks/useNotifications";

export default function notifyAndReturn(
  notifier: Notifier,
  error: Error | string
): null {
  notifier.error(error);
  return null;
}
