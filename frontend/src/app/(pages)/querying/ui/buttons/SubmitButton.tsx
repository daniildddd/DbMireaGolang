import { Button } from "@gravity-ui/uikit";

export default function SubmitButton({
  setOpen,
  setReturnValues,
  values,
}: {
  setOpen: (open: boolean) => void;
  setReturnValues: (arg0: object) => void;
  values: object;
}) {
  return (
    <Button
      className="button buttons__button important"
      onClick={() => {
        console.log("Применено");
        setReturnValues(values);
        setOpen(false);
      }}
    >
      Применить
    </Button>
  );
}
