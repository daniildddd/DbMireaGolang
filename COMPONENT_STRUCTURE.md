# Структура компонентов Frontend

## Иерархия компонентов

```
App (Next.js)
└── Layout
    └── Navigation
        └── FilteringPage (/pages/filtering/page.tsx)
            ├── FilterContext.Provider
            │   └── ContentWrapper
            │       └── FilterSelectionGrid
            │           ├── Кнопки модалей (WHERE, GROUP BY, ORDER BY, etc)
            │           └── Dropdown выбора таблицы
            │
            ├── WhereModal (ui/modals/WhereModal.tsx)
            │   └── Условия WHERE с field, operator, value
            │
            ├── GroupByModal (ui/modals/GroupByModal.tsx)
            │   └── Выбор полей для GROUP BY
            │
            ├── AggregateModal (ui/modals/AggregateModal.tsx)
            │   └── Функции агрегации (COUNT, SUM, AVG, MIN, MAX)
            │
            ├── HavingModal (ui/modals/HavingModal.tsx)
            │   └── Условия HAVING для агрегатных функций
            │
            ├── OrderByModal (ui/modals/OrderByModal.tsx)
            │   └── Сортировка с ASC/DESC
            │
            ├── CaseWhenModal (ui/modals/CaseWhenModal.tsx)
            │   └── CASE WHEN THEN выражения
            │
            ├── SubqueryModal (ui/modals/SubqueryModal.tsx)
            │   └── Подзапросы с типами IN/NOT IN/EXISTS/NOT EXISTS
            │
            ├── RegexModal (ui/modals/RegexModal.tsx)
            │   └── Regex фильтры для текстовых полей
            │
            ├── NullHandlingRuleModal (ui/modals/NullHandlingRuleModal.tsx)
            │   └── Обработка NULL значений
            │
            ├── GeneratedSQL (shared/ui/components/GeneratedSQL/GeneratedSQL.tsx)
            │   ├── Отображение SQL запроса
            │   └── Кнопка [Выполнить] с callback
            │
            └── QueryResults (shared/ui/components/QueryResults/QueryResults.tsx)
                ├── Таблица с результатами
                ├── Информация о количестве записей
                ├── Обработка ошибок
                └── Обработка пустых результатов
```

## Файловая структура

```
/frontend/src/
│
├── /pages/filtering/
│   ├── page.tsx                    ← Главная страница фильтрации
│   ├── page.module.sass            ← Стили для страницы
│   │
│   └── /ui/
│       ├── /modals/
│       │   ├── WhereModal.tsx
│       │   ├── WhereModal.module.sass
│       │   ├── GroupByModal.tsx
│       │   ├── GroupByModal.module.sass
│       │   ├── AggregateModal.tsx
│       │   ├── AggregateModal.module.sass
│       │   ├── HavingModal.tsx
│       │   ├── HavingModal.module.sass
│       │   ├── OrderByModal.tsx
│       │   ├── OrderByModal.module.sass
│       │   ├── CaseWhenModal.tsx
│       │   ├── CaseWhenModal.module.sass
│       │   ├── CaseQueryModal.tsx
│       │   ├── CaseQueryModal.module.sass
│       │   ├── SubqueryModal.tsx
│       │   ├── SubqueryModal.module.sass
│       │   ├── RegexModal.tsx
│       │   ├── RegexModal.module.sass
│       │   ├── NullHandlingRuleModal.tsx
│       │   ├── NullHandlingRuleModal.module.sass
│       │   └── index.ts            ← Экспорт всех модалей
│       │
│       └── /FilterSelectionGrid/
│           ├── FilterSelectionGrid.tsx
│           └── FilterSelectionGrid.module.sass
│
├── /shared/
│   ├── /lib/
│   │   ├── /api/
│   │   │   └── ApiMiddleware.ts    ← API слой для backend
│   │   │
│   │   ├── /hooks/
│   │   │   ├── useTableNames.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── ...
│   │   │
│   │   ├── /utils/
│   │   │   ├── notifyAndReturn.ts
│   │   │   └── ...
│   │   │
│   │   └── /wailsjs/
│   │       └── /go/models/
│   │           └── index.ts        ← Go типы (auto-generated)
│   │
│   ├── /ui/components/
│   │   ├── /GeneratedSQL/
│   │   │   └── GeneratedSQL.tsx    ← Отображение SQL с кнопкой
│   │   │
│   │   ├── /QueryResults/
│   │   │   ├── QueryResults.tsx    ← NEW: Компонент результатов
│   │   │   ├── style.module.sass   ← NEW: Стили результатов
│   │   │   └── ... (другие компоненты)
│   │   │
│   │   ├── /Loading/
│   │   ├── /ContentWrapper/
│   │   └── ... (другие компоненты)
│   │
│   ├── /context/
│   │   └── FilterContext.tsx       ← Контекст для фильтров
│   │
│   ├── /types/
│   │   ├── filtering.ts            ← Типы фильтров
│   │   └── ...
│   │
│   └── /const/
│       └── index.ts                ← Констансты
│
└── /features/
    └── /sqlQueryGenerator/
        └── generateSqlQuery.ts     ← Функция генерации SQL
```

## Компонент QueryResults (НОВЫЙ)

### Props:

```typescript
interface QueryResultsProps {
	columns?: string[] // Названия колонок из результата
	rows?: any[] // Данные строк (массив объектов)
	error?: string // Сообщение об ошибке если есть
}
```

### Состояния:

**1. Состояние ERROR:**

```
⚠️  Ошибка запроса:
[детальное сообщение об ошибке]
```

**2. Состояние EMPTY:**

```
📭 Результатов не найдено
```

**3. Состояние SUCCESS:**

```
Найдено записей: N

┌───┬──────────┬──────────┬──────────┐
│ # │ column1  │ column2  │ column3  │
├───┼──────────┼──────────┼──────────┤
│ 1 │ value    │ value    │ NULL     │
│ 2 │ value    │ true     │ value    │
│ 3 │ value    │ false    │ value    │
└───┴──────────┴──────────┴──────────┘
```

### Функция renderCellValue:

```typescript
function renderCellValue(value: any): string {
	if (value === null || value === undefined) return 'NULL'
	if (typeof value === 'boolean') return value ? 'true' : 'false'
	if (typeof value === 'object') return JSON.stringify(value)
	return String(value)
}
```

## Компонент GeneratedSQL

### Props:

```typescript
interface GeneratedSQLProps {
	query: string // SQL запрос
	onExecute?: (query: string) => Promise<void> // Callback при выполнении
}
```

### Функционал:

- Отображает SQL текст в `<pre>` блоке
- Кнопка [Выполнить] вызывает onExecute callback
- Кнопка отключена если запрос пуст
- Показывает "Выполнение..." во время обработки
- Копирует запрос при клике на текст (опционально)

## FilteringPage Component

### State:

```typescript
const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
const [activeModal, setActiveModal] = useState<string | null>(null)
const [queryResults, setQueryResults] = useState<any>(null)
```

### Основные функции:

**handleOpenModal(modalId: string):**

- Открывает указанную модальное окно
- Возможные значения: 'whereModal', 'groupByModal', 'orderByModal', etc.

**handleCloseModal():**

- Закрывает активное модальное окно

**handleExecuteQuery(sqlQuery: string):**

- Отправляет запрос на backend через ApiMiddleware
- Сохраняет результаты в state
- Показывает уведомления об успехе/ошибке

### Эффекты:

```typescript
useEffect(() => {
	// Устанавливает первую таблицу как по умолчанию
	if (!globalContext.currentTable && tableNames.data.length > 0) {
		setGlobalContext({ ...globalContext, currentTable: tableNames.data[0] })
	}
}, [tableNames.data])
```

## ApiMiddleware

### Методы:

**executeCustomQuery(query: string)**

```typescript
// Выполняет произвольный SQL запрос
// Параметр: SQL строка
// Возврат: TableDataResponse { columns?, rows?, error? }
const result = await ApiMiddleware.executeCustomQuery('SELECT * FROM users')
```

**getTableData(tableName: string)**

```typescript
// Получает все данные из таблицы
// Параметр: имя таблицы
// Возврат: TableDataResponse
const result = await ApiMiddleware.getTableData('users')
```

**searchInTable(request: SearchRequest)**

```typescript
// Поиск в таблице
// Параметр: SearchRequest { tableName, searchTerm, fields }
// Возврат: TableDataResponse
```

**executeJoinQuery(request: JoinRequest)**

```typescript
// Выполнить JOIN запрос
// Параметр: JoinRequest
// Возврат: TableDataResponse
```

**getTableMetadata()**

```typescript
// Получить метаданные всех таблиц
// Параметр: -
// Возврат: TableMetadata[] { name, fields }
const metadata = await ApiMiddleware.getTableMetadata()
```

**getTableSchema(tableName: string)**

```typescript
// Получить схему таблицы
// Параметр: имя таблицы
// Возврат: FieldSchema[] { name, type, isPrimaryKey, isNullable }
const schema = await ApiMiddleware.getTableSchema('users')
```

## FilterContext

### Тип Filters:

```typescript
interface Filters {
	where?: WhereCondition[]
	groupBy?: GroupByField[]
	aggregate?: AggregateFunction[]
	having?: HavingCondition[]
	orderBy?: OrderByField[]
	caseWhen?: CaseWhenExpression[]
	subqueries?: SubqueryFilter[]
	// ... другие фильтры
}
```

### Использование:

```typescript
const { filters, setFilters } = useContext(FilterContext)

// Обновление фильтра
setFilters({
	...filters,
	where: [...(filters.where || []), newCondition],
})
```

## Функция generateSqlQuery

### Сигнатура:

```typescript
function generateSqlQuery(
	selectClause: string, // "*" или список столбцов
	tableName: string | null, // Имя таблицы
	filters: Filters // Объект фильтров
): string // Возвращает SQL строку
```

### Пример:

```typescript
const sql = generateSqlQuery('*', 'users', {
	where: [{ field: 'age', operator: '>', value: '18' }],
	groupBy: [{ field: 'country' }],
	orderBy: [{ field: 'created_at', direction: 'DESC' }],
})
// Результат: SELECT * FROM users WHERE age > 18 GROUP BY country ORDER BY created_at DESC
```

## Стили

### Page стили (page.module.sass):

- `.query-section` - основной контейнер фильтров
- `.results-section` - секция с результатами

### QueryResults стили (style.module.sass):

- `.results-container` - основной контейнер (border, border-radius)
- `.results-info` - информационная строка (серый фон)
- `.results-table` - таблица (overflow для больших результатов)
- `.row-number` - столбец с номерами (sticky left)
- `.error` - стили для ошибок (красный фон)
- `.empty` - стили для пустого результата (зелёный фон)
- Таблица: thead (светлый фон), tbody (hover эффект)

## Поток данных для выполнения запроса

```
1. Пользователь нажимает [Выполнить] в GeneratedSQL
   ↓
2. GeneratedSQL вызывает onExecute(query)
   ↓
3. FilteringPage получает callback в handleExecuteQuery(query)
   ↓
4. handleExecuteQuery вызывает ApiMiddleware.executeCustomQuery(query)
   ↓
5. ApiMiddleware через Wails отправляет запрос на backend
   ExecuteCustomQuery({ query })
   ↓
6. Backend (App.ExecuteCustomQuery) выполняет SQL
   ↓
7. Backend возвращает TableDataResponse { columns, rows }
   ↓
8. handleExecuteQuery сохраняет результат в state
   setQueryResults(result)
   ↓
9. QueryResults компонент отображает таблицу с данными
   ↓
10. Показывается успешное уведомление
```

## Обработка ошибок

### В handleExecuteQuery:

```typescript
try {
	const result = await ApiMiddleware.executeCustomQuery(sqlQuery)
	setQueryResults(result)
	notifier.success('Запрос выполнен успешно!')
} catch (error) {
	notifier.error(`Ошибка: ${error}`)
	setQueryResults({ error: error.message })
}
```

### В QueryResults:

```typescript
if (error) {
	// Показывает блок с ошибкой
	return <div className={clsx(s['results-container'], s['error'])}>...</div>
}
```

## Типы из Go (Auto-generated)

Все типы импортируются из wailsjs/go/models:

```typescript
import { main } from '../wailsjs/go/models'

// Основные типы:
main.TableDataResponse // { columns?, rows?, error? }
main.FieldSchema // { name, type, isPrimaryKey, isNullable }
main.TableMetadata // { name, fields? }
main.SearchRequest // { tableName, searchTerm, fields }
main.JoinRequest // { table1, table2, joinType, condition }
main.CustomQueryRequest // { query }
```

## Development Workflow

### Для добавления новой функции:

1. **Добавить на Backend (Go):**

   - Добавить метод в app.go
   - Метод должен быть Exported (начинаться с заглавной буквы)

2. **Regenerate Wails bindings:**

   ```bash
   wails generate bindings
   ```

3. **Обновить ApiMiddleware:**

   - Импортировать новый метод из wailsjs
   - Создать wrapper метод в ApiMiddleware

4. **Использовать в компонентах:**

   - Вызвать через ApiMiddleware
   - Обработать результаты
   - Обновить UI

5. **Скомпилировать и тестировать:**
   ```bash
   npm run build --prefix frontend
   wails dev
   ```

## Материалы для дальнейшего изучения

- Wails документация: https://wails.io
- React Hooks: https://react.dev
- TypeScript: https://www.typescriptlang.org
- SQL Query Building: https://www.w3schools.com/sql
