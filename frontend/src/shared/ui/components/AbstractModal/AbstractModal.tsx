import { Modal } from "@gravity-ui/uikit";
import clsx from "clsx";
import { PropsWithChildren } from "react";
import s from "./style.module.sass";

interface AbstractModalParams {
  handleCloseModal: (open: boolean) => void;
}

export default function AbstractModal({
  children,
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
    </Modal>
  );
}
