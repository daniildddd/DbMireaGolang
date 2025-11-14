import { Modal } from "@gravity-ui/uikit";
import clsx from "clsx";
import { PropsWithChildren } from "react";
import s from "./style.module.sass";
import CancelButton from "./buttons/CancelButton";
import SubmitButton from "./buttons/SubmitButton";

interface AbstractModalParams {
  onSubmit: (...args: any) => void;
  handleCloseModal: (open: boolean) => void;
}

export default function AbstractModal({
  children,
  onSubmit,
  handleCloseModal,
}: PropsWithChildren & AbstractModalParams) {
  return (
    <Modal
      open={true}
      contentClassName={clsx(s.modal)}
      onOpenChange={(isOpen, e, reason) => {
        // Quit only in certain conditions
        if (reason == "escape-key" || reason == "outside-press") {
          handleCloseModal(false);
        }
      }}
    >
      {children}
      <div className="filter-modal__buttons">
        <CancelButton handleCloseModal={handleCloseModal} />
        <SubmitButton
          handleCloseModal={handleCloseModal}
          onClick={(args) => {
            onSubmit(args);
          }}
        />
      </div>
    </Modal>
  );
}
