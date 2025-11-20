import CancelButton from "@/shared/ui/components/AbstractModal/buttons/CancelButton";
import s from "./ModalActionButtons.module.sass";

export default function ModalActionButtons({
  handleCloseModal,
  formId,
}: {
  handleCloseModal: (open: boolean) => void;
  formId: string;
}) {
  return (
    <div className={s["filter-modal__buttons"]}>
      <CancelButton handleCloseModal={handleCloseModal} />
      <button type="submit" form={formId} className="button important">
        Применить
      </button>
    </div>
  );
}
