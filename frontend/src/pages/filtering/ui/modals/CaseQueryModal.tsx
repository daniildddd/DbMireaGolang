import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";

interface ModalParams {
  handleCloseModal: (arg0: boolean) => void;
}

export default function CaseQueryModal({ handleCloseModal }: ModalParams) {
  return <AbstractModal handleCloseModal={handleCloseModal}></AbstractModal>;
}
