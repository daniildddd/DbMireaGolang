#!/bin/bash
set -e

go_get() {
    package="$1"
    echo "Устанавливаю пакет $package..."
    go get "$package"
    echo "Пакет $package установлен."
    echo ""
}

main() {
    echo "Произвожу настройку проекта."

    echo "=== Установка пакетов ==="

    go mod tidy

    echo "Установка Wails CLI"
    go install github.com/wailsapp/wails/v2/cmd/wails@latest

    go_get fyne.io/fyne/v2
    go_get github.com/joho/godotenv
    go_get gorm.io/driver/postgres
    go_get gorm.io/gorm

    echo "=== Создание .env ==="
    cp .env.example .env

    echo "Настройка завершена."
}

main