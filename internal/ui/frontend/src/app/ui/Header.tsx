import { Button, Text } from "@gravity-ui/uikit";
import AppModalLinkList from "@shared/ui/components/AppModalLinkList";
import "./header.sass";

export default function Header({
  connectedDbName = "N/A",
}: {
  connectedDbName?: string;
}) {
  return (
    <header className="header">
      <div className="header__primary-row">
        <div className="header__website-meta">
          <Text className="website-meta__title h1" variant="header-1" as="h1">
            DB Master
          </Text>
          <Text className="website-meta__db-name">
            Подключено к {connectedDbName}
          </Text>
        </div>
        <ul className="header__extras">
          <li className="header__extras-item">
            <Button>Файл</Button>
          </li>
          <li className="header__extras-item">
            <Button>Правка</Button>
          </li>
          <li className="header__extras-item">
            <Button>Вид</Button>
          </li>
          <li className="header__extras-item">
            <Button>Справка</Button>
          </li>
        </ul>
      </div>
      <AppModalLinkList />
    </header>
  );
}
