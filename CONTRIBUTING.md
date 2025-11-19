# Содержание

- [Первичная настройка проекта](#первичная-настройка-проекта)
- [Запуск](#запуск)

## Первичная настройка проекта

Все эти шаги нужно сделать только ОДИН РАЗ.

- Устанавливаем Golang последней стабильной версии
- Настраиваем PostgreSQL
  - Устанавливаем PostgreSQL v18
  - Открываем pgadmin4.exe
  - Задаем пароль (любой, запомни его)
  - Создаем новую базу данных, название любое (на латинице и без пробелов)
    ![create-db](./docs/create-db.png)
- Настраиваем NodeJS
  - Открываем cmd/bash/powershell и ПООЧЕРЕДНО вставляем и выполняем эти команды:

```pwsh
# === WINDOWS ===
powershell -c "irm https://community.chocolatey.org/install.ps1|iex"
# Закрываем терминал и открываем новый
choco install nodejs --version="24.11.0"
node -v # Should print "v24.11.0".
corepack enable pnpm
pnpm -v

```

```bash
# === LINUX ===
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# Закрываем терминал и открываем новый
nvm install 24
node -v # Should print "v24.11.0".
corepack enable pnpm
pnpm -v
```

- Открываем в VSCode консоль (`ctrl` + `~`, или Вид->Терминал)
- Вводим в консоль `chmod +x ./setup.sh && ./setup.sh`
- В файле `.env` меняем пароль и название базы данных на введенные ранее
- Вводим в консоль `wails dev`
- Ура, все работает!

## Запуск

Проект запускается в режиме разработчика с помощью команды `wails dev`. Чтобы сбилдить exe-файл без последующего запуска приложения (как делает `wails dev`), используйте команду `wails build`.
