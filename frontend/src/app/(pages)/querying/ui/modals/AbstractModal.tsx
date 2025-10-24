import { Modal } from "@gravity-ui/uikit";
import { PropsWithChildren } from "react";

interface AbstractModalParams {
  handleCloseModal: (arg0: boolean) => void;
}

export default function AbstractModal({
  children,
  handleCloseModal,
}: PropsWithChildren & AbstractModalParams) {
  return (
    <Modal
      open={true}
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
