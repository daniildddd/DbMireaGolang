import { Modal } from "@gravity-ui/uikit";
import { PropsWithChildren } from "react";

interface AbstractModalParams {
  open: boolean;
  handleCloseModal: (arg0: boolean) => void;
}

export default function AbstractModal({
  children,
  open,
  handleCloseModal,
}: PropsWithChildren & AbstractModalParams) {
  return (
    <Modal
      open={open}
      className="filter-modal"
      onOpenChange={(opem, e, reason) => {
        if (reason == "escape-key" || reason == "outside-press") {
          handleCloseModal(false);
        }
      }}
    >
      {children}
    </Modal>
  );
}
