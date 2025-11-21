# Инструкция по запуску и развёртыванию

## Требования

### Системные требования:

- **OS**: macOS, Windows, или Linux
- **Go**: 1.20 или выше
- **Node.js**: 18 LTS или выше
- **npm/yarn**: последняя версия
- **Wails**: 2.5.1 или выше

### Установка зависимостей (macOS):

```bash
# Установить Homebrew если её нет
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Установить требуемые пакеты
brew install go node

# Установить Wails (глобально)
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Добавить в PATH если нужно
export PATH=$PATH:$(go env GOPATH)/bin
```

## Первоначальная установка

### 1. Клонирование репозитория

```bash
cd /Applications/vscode/golang
git clone <repository-url>
cd DbMireaGolang
```

### 2. Установка зависимостей Frontend

```bash
# Перейти в папку frontend
cd frontend

# Установить npm зависимости
npm install

# Вернуться в корневую папку
cd ..
```

### 3. Загрузка Go модулей

```bash
# Go автоматически загрузит зависимости при первом запуске
# Если нужно явно:
go mod download
go mod tidy
```

## Запуск приложения

### Development режим (с Hot Reload)

```bash
# Запустить Wails dev server
wails dev

# Приложение откроется в окне на http://localhost:34115
# Frontend изменения перезагружаются автоматически
# Backend изменения требуют перезагрузки
```

### Production режим

```bash
# Скомпилировать для текущой ОС
wails build

# Приложение находится в build/bin/
# На macOS: build/bin/DbMireaGolang.app
```

### Build для разных платформ

```bash
# macOS (Intel и Apple Silicon)
wails build -platform darwin

# Windows
wails build -platform windows

# Linux
wails build -platform linux

# Все платформы одновременно
wails build -platform darwin,windows,linux
```

## Development workflow

### Структура папок при разработке:

```
DbMireaGolang/
├── frontend/              ← React/TypeScript код
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/               ← Исходный код
│       ├── pages/
│       ├── shared/
│       └── features/
│
├── internal/              ← Go пакеты
│   ├── database/
│   ├── logger/
│   ├── models/
│   ├── repository/
│   └── utils/
│
├── config/                ← Конфигурация
│   └── config.go
│
├── app.go                 ← Главное приложение
├── main.go                ← Entry point
├── go.mod                 ← Go зависимости
├── go.sum
├── wails.json             ← Конфигурация Wails
└── build/                 ← Скомпилированное приложение
```

### Рабочий процесс разработки:

#### 1. Запуск Dev сервера

```bash
cd DbMireaGolang
wails dev
```

#### 2. Редактирование Frontend кода

- Все изменения в `/frontend/src/` автоматически перезагружаются
- Проверьте консоль браузера на ошибки

#### 3. Редактирование Backend кода

```bash
# Измените код в /internal/ или app.go

# Перезагрузите приложение (Ctrl+R в окне или перезапустите wails dev)
# Или остановите wails dev (Ctrl+C) и запустите заново
```

#### 4. Генерирование Wails bindings

Когда добавляете новые методы в app.go:

```bash
# Остановите wails dev (Ctrl+C)

# Генерируйте bindings (выполните из root папки)
wails generate bindings

# Это создаст новые файлы в frontend/wailsjs/

# Затем обновите ApiMiddleware в frontend/src/shared/lib/api/

# Запустите wails dev снова
wails dev
```

## Компиляция Frontend

### Режимы компиляции:

```bash
# Development сборка (с исходными картами, медленнее)
cd frontend
npm run dev

# Production сборка (оптимизирована, быстрее)
npm run build

# Вернуться в корневую папку
cd ..
```

### Frontend скрипты (package.json):

```json
{
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview",
		"lint": "eslint src --ext .ts,.tsx"
	}
}
```

## Отладка

### Frontend отладка:

```bash
# 1. Откройте DevTools (F12 в Wails окне)
# 2. Используйте Console/Network вкладки
# 3. Проверьте журнал ошибок в browser console
```

### Backend отладка:

```bash
# 1. В app.go добавьте log.Println() для вывода
# 2. Проверьте логи в терминале где запущен wails dev

# Пример:
func (a *App) ExecuteCustomQuery(req main.CustomQueryRequest) main.TableDataResponse {
    log.Println("Выполнение запроса:", req.Query)  ← Будет видно в консоли
    // ... код
}
```

### Profiling производительности:

```bash
# Frontend профилирование
# 1. Откройте DevTools
# 2. Перейдите на вкладку Performance
# 3. Запишите активность приложения
# 4. Анализируйте узкие места

# Backend профилирование (продвинуто)
# Используйте pprof из Go:
import "net/http/pprof"
```

## Production развёртывание

### Подготовка к production:

```bash
# 1. Обновите вермию в wails.json
{
  "appName": "DbMireaGolang",
  "appVersion": "1.0.0"
}

# 2. Убедитесь что все зависимости обновлены
cd frontend && npm audit && npm update
cd ../
go mod tidy

# 3. Запустите тесты (если есть)
go test ./...
npm run test --prefix frontend

# 4. Создайте production build
wails build

# 5. Протестируйте скомпилированное приложение
./build/bin/DbMireaGolang
```

### Распределение приложения:

```bash
# На macOS создается .app bundle
cd build/bin/
open DbMireaGolang.app

# Для распределения создайте DMG (macOS)
hdiutil create -volname "DbMireaGolang" -srcfolder build/bin -ov -format UDZO DbMireaGolang.dmg

# Или ZIP архив
cd build/bin
zip -r ../DbMireaGolang.zip .
```

## Troubleshooting

### Проблема: Wails не установлен

```bash
# Решение:
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Проверьте PATH:
echo $PATH
# Должен содержать $(go env GOPATH)/bin
```

### Проблема: npm install не работает

```bash
# Решение 1: Очистите кеш
npm cache clean --force

# Решение 2: Удалите node_modules и package-lock.json
rm -rf frontend/node_modules
rm frontend/package-lock.json

# Решение 3: Переустановите
cd frontend
npm install
```

### Проблема: Port 34115 занят

```bash
# Найдите процесс использующий port
lsof -i :34115

# Убейте процесс (замените PID)
kill -9 <PID>

# Или используйте другой port в wails.json:
{
  "frontend:devServerUrl": "http://localhost:3000"
}
```

### Проблема: Frontend не обновляется

```bash
# Решение 1: Перезагрузитесь (Ctrl+R в окне)

# Решение 2: Очистите браузер кеш
# F12 → Application → Clear Storage → Clear site data

# Решение 3: Перезапустите wails dev
# Ctrl+C в терминале и снова wails dev
```

### Проблема: Backend методы не видны в frontend

```bash
# Решение: Генерируйте bindings заново
# 1. Остановите wails dev
# 2. Выполните: wails generate bindings
# 3. Проверьте что метод появился в frontend/wailsjs/
# 4. Обновите ApiMiddleware
# 5. Перезапустите wails dev
```

### Проблема: SQL запрос не выполняется

```bash
# Проверьте:
# 1. Синтаксис SQL (смотрите "Итоговый SQL:" в UI)
# 2. Названия таблиц/полей (смотрите в таблице columns)
# 3. Типы данных в WHERE условиях
# 4. Логи backend (смотрите в консоли где запущен wails dev)

# Добавьте лог для отладки в app.go:
log.Printf("SQL: %s\n", req.Query)
```

## Обновления и обслуживание

### Обновление зависимостей:

```bash
# Go зависимости
go get -u
go mod tidy

# Frontend зависимости
cd frontend
npm update
npm outdated  # Посмотрите что устарело
```

### Проверка совместимости:

```bash
# Проверьте версии
go version
node -v
npm -v
wails version

# Убедитесь что соответствуют requirements
```

## Performance оптимизация

### Frontend оптимизация:

```bash
# 1. Используйте production build
npm run build --prefix frontend

# 2. Проверьте размер бандла
npm run build --prefix frontend -- --analyze

# 3. Кэшируйте результаты запросов
// В ApiMiddleware добавьте кэш
const queryCache = new Map()

# 4. Ленивая загрузка компонентов
import lazy from 'react'
const QueryResults = lazy(() => import('./QueryResults'))
```

### Backend оптимизация:

```bash
# 1. Используйте индексы в БД
CREATE INDEX idx_column ON table(column)

# 2. Оптимизируйте SQL запросы
# Избегайте SELECT *, используйте нужные столбцы

# 3. Добавьте LIMIT для больших таблиц
SELECT * FROM table LIMIT 1000

# 4. Используйте connection pooling
// В config.go настройте pool size
```

## Мониторинг и логирование

### Логирование:

```bash
# Логи находятся в /logs/app.log

# Для развертывания используйте структурированное логирование:
import "go.uber.org/zap"

# В коде:
a.Logger.Info("Запрос выполнен", zap.String("query", req.Query))
```

### Мониторинг приложения:

```bash
# Смотрите использование памяти/CPU:
# macOS: Activity Monitor
# Linux: top, htop
# Windows: Task Manager
```

## Регулярное обслуживание

### Ежедневно:

- Проверьте логи на ошибки
- Убедитесь что приложение работает

### Еженедельно:

- Обновите зависимости
- Запустите тесты

### Ежемесячно:

- Проверьте performance
- Обновите documentation
- Сделайте backup базы данных

## Контакты и поддержка

Если возникли проблемы:

1. Проверьте этот документ (раздел Troubleshooting)
2. Посмотрите логи (terminal console, browser console)
3. Прочитайте official Wails документацию
4. Откройте issue в GitHub репозитории
