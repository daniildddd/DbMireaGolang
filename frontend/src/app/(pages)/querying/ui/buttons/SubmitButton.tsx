import useNotifications from "@/shared/lib/hooks/useNotifications";
import { Button } from "@gravity-ui/uikit";

export default function SubmitButton({
  onClick,
  handleCloseModal,
}: {
  onClick: (arg0?: any) => void;
  handleCloseModal: (open: boolean) => void;
}) {
  const notifier = useNotifications();

  return (
    <Button
      className="button buttons__button important"
      onClick={() => {
        notifier.notify("Применено");
        onClick();
        handleCloseModal(false);
      }}
    >
      Применить
    </Button>
  );
}
