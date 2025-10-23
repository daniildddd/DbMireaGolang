import useNotifications from "@/shared/lib/hooks/useNotifications";
import { Button } from "@gravity-ui/uikit";

export default function CancelButton({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const notifier = useNotifications();
  return (
    <Button
      className="button buttons__button"
      onClick={() => {
        notifier.notify("Отменено");
        setOpen(false);
      }}
    >
      Отмена
    </Button>
  );
}
