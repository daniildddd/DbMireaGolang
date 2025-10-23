import useNotifications from "@/shared/lib/hooks/useNotifications";
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
  const notifier = useNotifications();

  return (
    <Button
      className="button buttons__button important"
      onClick={() => {
        notifier.notify("Применено");
        setReturnValues(values);
        setOpen(false);
      }}
    >
      Применить
    </Button>
  );
}
