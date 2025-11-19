export default function CancelButton({
  handleCloseModal,
}: {
  handleCloseModal: (open: boolean) => void;
}) {
  return (
    <button
      className="button buttons__button"
      onClick={() => {
        handleCloseModal(false);
      }}
    >
      Отмена
    </button>
  );
}
