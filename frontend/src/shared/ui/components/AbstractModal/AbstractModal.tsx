import { Modal } from "@gravity-ui/uikit";
import clsx from "clsx";
import { PropsWithChildren } from "react";
import s from "./style.module.sass";

interface AbstractModalParams {
  handleCloseModal: (open: boolean) => void;
  title?: string;
}

export default function AbstractModal({
  children,
  title = "",
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
      {title && <h3 className={clsx("h3", s["modal-title"])}>{title}</h3>}
      {children}
    </Modal>
  );
}
