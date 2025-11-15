#!/bin/bash
set -ex

go_get() {
    package="$1"
    go get "$package"
}

main() {
    echo "Произвожу настройку проекта."

    echo "=== Установка пакетов Go ==="
    go mod tidy

    echo "Установка Wails CLI"
    go install github.com/wailsapp/wails/v2/cmd/wails@latest

    # export PATH=$PATH:$(go env GOPATH)/bin

    go_get github.com/joho/godotenv
    go_get gorm.io/driver/postgres
    go_get gorm.io/gorm
    go_get github.com/wailsapp/wails/v2

    echo "=== Установка пакетов фронтенда ==="
    cd frontend
    pnpm install
    cd ../

    echo "=== Создание .env ==="
    if [ ! -f ".env" ]; then
        cp .env.example .env
        echo ".env создан"
    else
        echo ".env уже существует"
    fi

    echo "Настройка завершена."
}

main