package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// загружаем из файла .env переменные в переменные окружения
//
// функции у которых в начале имени предписка Must могут паниковать(то есть программа будет просто падать)
func MustLoad() {
	err := godotenv.Load()
	if err != nil {
		fmt.Printf("DEBUG: .env файл не найден %v\n", err)
		panic(err)
	}
	fmt.Println("DEBUG: .env файл успешно загружен")
}

// получение переменной окружения(если такой переменной нет то будет возвращено значение по умолчанию)
func GetEnvWithDefault(key, defolt string) string {
	value := os.Getenv(key)
	if value == "" {
		return defolt
	}
	return value
}
