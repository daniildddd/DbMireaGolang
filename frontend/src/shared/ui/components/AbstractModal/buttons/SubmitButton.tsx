import useNotifications from "@/shared/lib/hooks/useNotifications";

export default function SubmitButton({
  onClick,
  handleCloseModal,
}: {
  onClick: (arg0?: any) => void;
  handleCloseModal: (open: boolean) => void;
}) {
  const notifier = useNotifications();

  return (
    <button
      className="button buttons__button important"
      onClick={() => {
        notifier.notify("Применено");
        onClick();
        handleCloseModal(false);
      }}
    >
      Применить
    </button>
  );
}
