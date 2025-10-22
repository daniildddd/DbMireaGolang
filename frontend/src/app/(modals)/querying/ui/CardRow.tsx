import { Button, Text } from "@gravity-ui/uikit";
import "../page.sass";

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
    <div className="grid-item__row">
      <Text className="h2 row__title" as="h2">
        {title}
      </Text>
      <Button className="row__button" onClick={(e) => onClick(e)}>
        + {buttonText}
      </Button>
    </div>
  );
}
