import { Button, Text } from "@gravity-ui/uikit";
import s from "./style.module.sass";
import clsx from "clsx";
import React from "react";

export default function CardRow({
  title,
  buttonText,
  modalId,
  onOpenModal,
}: {
  title: string;
  buttonText: string;
  modalId: string;
  onOpenModal?: (modalId: string) => void;
}) {
  return (
    <>
      <div className={s["grid-item__row"]}>
        <Text className={clsx(s["row__title"])} as="h3">
          {title}
        </Text>
        <Button
          className={clsx(s["row__button"], "button")}
          onClick={() => onOpenModal(modalId)}
        >
          + {buttonText}
        </Button>
      </div>
    </>
  );
}
