import useNotifications from "@/shared/lib/hooks/useNotifications";

export default function CancelButton({
  handleCloseModal,
}: {
  handleCloseModal: (open: boolean) => void;
}) {
  const notifier = useNotifications();
  return (
    <button
      className="button buttons__button"
      onClick={() => {
        notifier.notify("Отменено");
        handleCloseModal(false);
      }}
    >
      Отмена
    </button>
  );
}
