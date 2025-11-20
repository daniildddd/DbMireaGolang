import { Notifier } from "@/shared/lib/hooks/useNotifications";

export default function notifyAndReturn(
  notifier: Notifier,
  error: Error | string
): null {
  notifier.error(error);
  return null;
}
