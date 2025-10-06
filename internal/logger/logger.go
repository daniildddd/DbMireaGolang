package logger

import (
	"log"
	"os"
)

// отдельный тип для уровня логирования
type LogLevel int

// перечисление доступных уровней логированияб,LogLevelInfo = 0, LogLevelError = 1
const (
	LogLevelInfo LogLevel = iota
	LogLevelError
)

// структура логгера
type AppLogger struct {
	//логгер для уровня INFO
	infoLoger *log.Logger
	//логгер для уровня ERROR
	errorLoger *log.Logger
	//уровень логирования
	logLevel LogLevel
	//файл в который будут записываться логи
	file *os.File
}

// глоабльная переменная для логера которую можно дергать из других пакетов
var Logger *AppLogger

// функция для инициализиации логера, возвращает ошибку если не смогли загрузить данные из .env файла или
func InitLogger() error {
	return nil
}

// логгирует на уровне INFO если этого уровень позволяет
func (a *AppLogger) Info(format string, v ...any) {

}

// логгирует на уровне ERROR
func (a *AppLogger) Error(format string, v ...any) {

}

// закрывает файл лога и записывает финальное сообщение об закрытии
func (a *AppLogger) Close() {

}

func getEnvWithDefault(key, defolt string) string {
	value := os.Getenv(key)
	if value == "" {
		return defolt
	}
	return value
}
