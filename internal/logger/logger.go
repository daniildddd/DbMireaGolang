package logger

import (
	"fmt"
	"io"
	"log"
	"os"
	"strings"

	"github.com/daniildddd/DbMireaGolang/config"
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

// глобальная переменная для логера которую можно дергать из других пакетов
var Logger *AppLogger

// функция для инициализиации логера, возвращает ошибку если не смогли загрузить данные из .env файла или
func InitLogger() error {
	config.MustLoad()

	rawValue := os.Getenv("LOG_LEVEL")
	fmt.Printf("DEBUG: LOG_LEVEL =%s", rawValue)

	//получаем уровень логгирование, если такого поля нет в .env файле то по дефолту выставится уровень INFO
	logLevelStr := config.GetEnvWithDefault("LOG_LEVEL", "INFO")

	//убираем всякие кавычки и пробелы
	logLevelStr = strings.Trim(logLevelStr, `"' `)

	//определеяем какой в итоге logLevel
	logLevel := LogLevelInfo
	if strings.ToUpper(logLevelStr) == "ERROR" {
		logLevel = LogLevelError
	}

	//создаем папку для логов
	if err := os.MkdirAll("logs", 0755); err != nil {
		return fmt.Errorf("не удалось создать директорию logs %v", err)
	}

	logFileName := "logs/app.log"
	//открываем файл(если его не существует то создается), он открывается только для записи, если файл уже создан то будут записываться новые записи в конец файла
	file, err := os.OpenFile(logFileName, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		return fmt.Errorf("не удалось сощдать файл лога: %v", err)
	}

	// мультиплексор для записи в консольку и в файл
	multiWriter := io.MultiWriter(os.Stdout, file)

	//инициализируем логгер
	Logger = &AppLogger{
		infoLoger:  log.New(multiWriter, "[INFO]", log.Ldate|log.Ltime),
		errorLoger: log.New(multiWriter, "[ERROR]", log.Ldate|log.Ltime|log.Lmicroseconds|log.Lshortfile),
		logLevel:   logLevel,
		file:       file,
	}

	if logLevel == LogLevelError {
		Logger.errorLoger.Printf("=== приложение запущено(режим ERROR) ===")
	} else {
		Logger.errorLoger.Printf("=== приложение запущено(режим INFO) ===")
	}
	Logger.errorLoger.Printf("лог-файл: %s", logFileName)
	return nil
}

// логгирует на уровне INFO если этого уровень позволяет
//
// принимает формат и аргументы которые будут выведены в этом формате строки
func (a *AppLogger) Info(format string, v ...any) {
	if a.logLevel <= LogLevelInfo {
		a.infoLoger.Printf(format, v...)
	}
}

// логгирует на уровне ERROR
//
// принимает формат и аргументы которые будут выведены в этом формате строки
func (a *AppLogger) Error(format string, v ...any) {
	a.errorLoger.Printf(format, v...)
}

// закрывает файл лога и записывает финальное сообщение об закрытии
func (a *AppLogger) Close() {
	if a.file != nil {
		if a.logLevel == LogLevelError {
			a.errorLoger.Print("=== приложение завершено ===")
		} else {
			a.infoLoger.Print("=== приложение завершено ===")
		}
		a.file.Close()
	}
}

// получение переменной окружения(если такой переменной нет то будет возвращено значение по умолчанию)
func getEnvWithDefault(key, defolt string) string {
	value := os.Getenv(key)
	if value == "" {
		return defolt
	}
	return value
}
