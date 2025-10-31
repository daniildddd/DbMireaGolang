package logger

import (
	"fmt"
	"io"
	"log"
	"os"
	"strings"

	"github.com/daniildddd/DbMireaGolang/config"
)

type LogLevel int

const (
	LogLevelInfo LogLevel = iota
	LogLevelError
)

type AppLogger struct {
	infoLoger  *log.Logger
	errorLoger *log.Logger
	logLevel   LogLevel
	file       *os.File
}

var Logger *AppLogger

// === БЕЗОПАСНЫЕ МЕТОДЫ (не падают при nil) ===
func (a *AppLogger) Info(format string, v ...any) {
	if a == nil || a.infoLoger == nil || a.logLevel > LogLevelInfo {
		return
	}
	a.infoLoger.Printf(format, v...)
}

func (a *AppLogger) Error(format string, v ...any) {
	if a == nil || a.errorLoger == nil {
		return
	}
	a.errorLoger.Printf(format, v...)
}

func Info(format string, v ...any) {
	if Logger != nil {
		Logger.Info(format, v...)
	}
}

func Error(format string, v ...any) {
	if Logger != nil {
		Logger.Error(format, v...)
	}
}

func InitLogger() error {
	config.MustLoad()

	logLevelStr := config.GetEnvWithDefault("LOG_LEVEL", "INFO")
	logLevelStr = strings.Trim(logLevelStr, `"' `)

	logLevel := LogLevelInfo
	if strings.ToUpper(logLevelStr) == "ERROR" {
		logLevel = LogLevelError
	}

	if err := os.MkdirAll("logs", 0755); err != nil {
		return fmt.Errorf("не удалось создать директорию logs %v", err)
	}

	logFileName := "logs/app.log"
	file, err := os.OpenFile(logFileName, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		return fmt.Errorf("не удалось создать файл лога: %v", err)
	}

	multiWriter := io.MultiWriter(os.Stdout, file)

	Logger = &AppLogger{
		infoLoger:  log.New(multiWriter, "[INFO] ", log.Ldate|log.Ltime),
		errorLoger: log.New(multiWriter, "[ERROR] ", log.Ldate|log.Ltime|log.Lmicroseconds|log.Lshortfile),
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

func (a *AppLogger) Close() {
	if a == nil || a.file == nil {
		return
	}
	if a.logLevel == LogLevelError {
		a.errorLoger.Print("=== приложение завершено ===")
	} else {
		a.infoLoger.Print("=== приложение завершено ===")
	}
	a.file.Close()
}
