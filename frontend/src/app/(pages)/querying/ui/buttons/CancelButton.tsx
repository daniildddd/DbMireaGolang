import useNotifications from "@/shared/lib/hooks/useNotifications";
import { Button } from "@gravity-ui/uikit";

export default function CancelButton({
  handleCloseModal,
}: {
  handleCloseModal: (open: boolean) => void;
}) {
  const notifier = useNotifications();
  return (
    <Button
      className="button buttons__button"
      onClick={() => {
        notifier.notify("Отменено");
        handleCloseModal(false);
      }}
    >
      Отмена
    </Button>
  );
}
