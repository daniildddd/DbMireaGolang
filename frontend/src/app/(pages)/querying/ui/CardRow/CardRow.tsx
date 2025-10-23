import { Button, Text } from "@gravity-ui/uikit";
import s from "./style.module.sass";
import clsx from "clsx";

export default function CardRow({
  title,
  buttonText,
  onClick,
}: {
  title: string;
  buttonText: string;
  onClick: (e: any) => void;
}) {
  return (
    <div className={s["grid-item__row"]}>
      <Text className={clsx(s["row__title"])} as="h3">
        {title}
      </Text>
      <Button
        className={clsx(s["row__button"], "button")}
        onClick={(e: any) => onClick(e)}
      >
        + {buttonText}
      </Button>
    </div>
  );
}
