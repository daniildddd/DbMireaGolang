import { Button } from "@gravity-ui/uikit";

export default function CancelButton({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  return (
    <Button
      className="button buttons__button"
      onClick={() => {
        console.log("Отменено");
        setOpen(false);
      }}
    >
      Отмена
    </Button>
  );
}
