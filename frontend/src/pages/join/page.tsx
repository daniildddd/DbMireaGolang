"use client";

import { useEffect, useState } from "react";
import { Button } from "@gravity-ui/uikit";
import s from "./page.module.sass";
import clsx from "clsx";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";
import Loading from "@/shared/ui/components/Loading/Loading";
import notifyAndReturn from "@/shared/lib/utils/notifyAndReturn";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import { useCurrentTableSchema } from "@/shared/lib/hooks/useTableSchema";
import useTableSchema from "@/shared/lib/hooks/useTableSchema";
import GeneratedSQL from "@/shared/ui/components/GeneratedSQL/GeneratedSQL";
import QueryResults from "@/shared/ui/components/QueryResults/QueryResults";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";

type JoinType = "INNER" | "LEFT" | "RIGHT" | "FULL";

interface JoinClause {
  id: string;
  type: JoinType;
  table: string;
  mainFields: string[]; // Массив для множественного выбора
  joinFields: string[]; // Массив для множественного выбора
}

export default function JoinPage() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useGlobalContext();
  const currentTableSchema = useCurrentTableSchema();
  const notifier = useNotifications();
  const [queryResults, setQueryResults] = useState<any>(null);
  const [tableSchemas, setTableSchemas] = useState<Record<string, any[]>>({});

  const [mainTable, setMainTable] = useState("");
  const [joins, setJoins] = useState<JoinClause[]>([]);

  // Устанавливаем первую таблицу при загрузке
  useEffect(() => {
    if (
      tableNames.data &&
      tableNames.data.length > 0 &&
      !globalContext.currentTable
    ) {
      setGlobalContext({ ...globalContext, currentTable: tableNames.data[0] });
    }
  }, [tableNames.data]);

  // Инициализируем основную таблицу
  useEffect(() => {
    if (globalContext.currentTable && !mainTable) {
      setMainTable(globalContext.currentTable);
      // Сразу загружаем её поля в кэш
      if (
        !tableSchemas[globalContext.currentTable] &&
        currentTableSchema.data
      ) {
        setTableSchemas((prev) => ({
          ...prev,
          [globalContext.currentTable]: currentTableSchema.data || [],
        }));
      }
    }
  }, [globalContext.currentTable, currentTableSchema.data]);

  // Когда основная таблица изменяется, загружаем её поля
  useEffect(() => {
    if (mainTable && !tableSchemas[mainTable] && currentTableSchema.data) {
      setTableSchemas((prev) => ({
        ...prev,
        [mainTable]: currentTableSchema.data || [],
      }));
    }
  }, [mainTable]);

  const handleAddJoin = () => {
    const newJoin: JoinClause = {
      id: Date.now().toString(),
      type: "INNER",
      table: "",
      mainFields: [],
      joinFields: [],
    };
    setJoins([...joins, newJoin]);
  };

  const handleRemoveJoin = (id: string) => {
    setJoins(joins.filter((j) => j.id !== id));
  };

  const handleUpdateJoin = (id: string, updates: Partial<JoinClause>) => {
    // Проверяем если пользователь выбрал основную таблицу в JOIN
    if (updates.table && updates.table === mainTable) {
      notifier.error("JOIN таблица не может совпадать с основной таблицей");
      return;
    }
    setJoins(joins.map((j) => (j.id === id ? { ...j, ...updates } : j)));
  };

  const generateSQL = (): string => {
    if (!mainTable) return "";

    let sql = `SELECT * FROM ${mainTable}`;

    joins.forEach((join) => {
      // Пропускаем если таблица совпадает с основной или не выбрана
      if (
        !join.table ||
        join.table === mainTable ||
        join.mainFields.length === 0 ||
        join.joinFields.length === 0
      ) {
        return;
      }

      // Объединяем условия для всех выбранных полей
      const conditions = join.mainFields
        .map((mainField, idx) => {
          const joinField = join.joinFields[idx] || join.joinFields[0];
          return `${mainTable}.${mainField} = ${join.table}.${joinField}`;
        })
        .join(" AND ");
      sql += ` ${join.type} JOIN ${join.table} ON ${conditions}`;
    });

    return sql;
  };

  const handleExecuteQuery = async (sqlQuery: string) => {
    try {
      const result = await ApiMiddleware.executeCustomQuery(sqlQuery);
      setQueryResults(result);
      notifier.success("Запрос выполнен успешно!");
    } catch (error) {
      notifier.error(`Ошибка: ${error}`);
    }
  };

  const handleExecuteGeneratedQuery = () => {
    const query = generateSQL();
    if (!query) {
      notifier.error("Выберите таблицу и настройте JOINs");
      return;
    }
    handleExecuteQuery(query);
  };

  const query = generateSQL();

  if (tableNames.isPending) return <Loading />;
  if (tableNames.error) return notifyAndReturn(notifier, tableNames.error);
  if (tableNames.data.length === 0) return <div>В базе данных нет таблиц</div>;

  // Получаем поля для текущей основной таблицы из кэша или текущей схемы
  const mainTableFields = (
    tableSchemas[mainTable] ||
    currentTableSchema.data ||
    []
  ).map((f: any) => ({
    value: f.name,
    label: f.name,
  }));

  // Функция для загрузки полей для join таблицы
  const getJoinTableFields = (tableName: string) => {
    if (!tableName) return [];

    // Если уже загружены в кэш, вернем из кэша
    if (tableSchemas[tableName]) {
      return tableSchemas[tableName].map((f: any) => ({
        value: f.name,
        label: f.name,
      }));
    }

    // Загружаем поля для таблицы асинхронно
    (async () => {
      try {
        const fields = await ApiMiddleware.getTableSchema(tableName);
        setTableSchemas((prev) => ({
          ...prev,
          [tableName]: fields || [],
        }));
      } catch (error) {
        console.error(`Ошибка загрузки полей для ${tableName}:`, error);
      }
    })();

    return [];
  };
  return (
    <ContentWrapper>
      <section className={clsx("section")}>
        <h2 className="h2">Соединения (JOIN) между таблицами</h2>

        <div className={s["join-container"]}>
          {/* Основная таблица */}
          <div className={s["main-table-selector"]}>
            <label className={s["section-title"]}>Основная таблица</label>
            <select
              value={mainTable}
              onChange={(e) => setMainTable(e.target.value)}
              className={s["table-select"]}
            >
              <option value="">Выберите таблицу</option>
              {tableNames.data.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>

          {/* Список JOIN условий */}
          {joins.length > 0 && (
            <div className={s["joins-list"]}>
              {joins.map((join, index) => (
                <div key={join.id} className={s["join-clause"]}>
                  <div className={s["join-clause__row"]}>
                    <label className={s["section-title"]}>Тип</label>
                    <select
                      value={join.type}
                      onChange={(e) =>
                        handleUpdateJoin(join.id, {
                          type: e.target.value as JoinType,
                        })
                      }
                      className={s["table-select"]}
                    >
                      <option value="INNER">INNER JOIN</option>
                      <option value="LEFT">LEFT JOIN</option>
                      <option value="RIGHT">RIGHT JOIN</option>
                      <option value="FULL">FULL JOIN</option>
                    </select>
                  </div>

                  <div className={s["join-clause__row"]}>
                    <label className={s["section-title"]}>Таблица</label>
                    <select
                      value={join.table}
                      onChange={(e) =>
                        handleUpdateJoin(join.id, {
                          table: e.target.value || "",
                        })
                      }
                      className={s["table-select"]}
                    >
                      <option value="">Выберите таблицу</option>
                      {tableNames.data.map((table) => (
                        <option key={table} value={table}>
                          {table}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={s["join-clause__row"]}>
                    <label className={s["section-title"]}>
                      Поля из {mainTable} (несколько)
                    </label>
                    <select
                      multiple
                      value={join.mainFields}
                      onChange={(e) => {
                        const selected = Array.from(
                          e.target.selectedOptions,
                          (opt) => opt.value
                        );
                        handleUpdateJoin(join.id, {
                          mainFields: selected,
                        });
                      }}
                      className={s["table-select"]}
                      style={{ minHeight: "100px" }}
                    >
                      {mainTableFields.map((field) => (
                        <option key={field.value} value={field.value}>
                          {field.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={s["join-clause__row"]}>
                    <label className={s["section-title"]}>
                      Поля из {join.table} (несколько)
                    </label>
                    <select
                      multiple
                      value={join.joinFields}
                      onChange={(e) => {
                        const selected = Array.from(
                          e.target.selectedOptions,
                          (opt) => opt.value
                        );
                        handleUpdateJoin(join.id, {
                          joinFields: selected,
                        });
                      }}
                      className={s["table-select"]}
                      style={{ minHeight: "100px" }}
                    >
                      {getJoinTableFields(join.table).map((field) => (
                        <option key={field.value} value={field.value}>
                          {field.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={s["join-clause__delete"]}>
                    <Button
                      size="s"
                      onClick={() => handleRemoveJoin(join.id)}
                      view="outlined"
                    >
                      Удалить JOIN #{index + 1}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Кнопка добавления JOIN */}
          <Button
            onClick={handleAddJoin}
            view="action"
            className={s["add-join-button"]}
          >
            + Добавить JOIN
          </Button>
        </div>

        {/* SQL запрос - СКРЫТО */}
        {/* <div className={s["sql-section"]}>
          <GeneratedSQL query={query} onExecute={handleExecuteQuery} />
        </div> */}

        {/* Кнопка выполнения запроса */}
        <div className={s["execute-button-section"]}>
          <Button
            onClick={handleExecuteGeneratedQuery}
            view="action"
            size="l"
            className={s["execute-button"]}
          >
            Выполнить запрос
          </Button>
        </div>

        {/* Результаты запроса */}
        {queryResults && (
          <div className={s["results-section"]}>
            <h2 className="h2">Результаты запроса</h2>
            <QueryResults
              columns={queryResults.columns}
              rows={queryResults.rows}
              error={queryResults.error}
            />
          </div>
        )}
      </section>
    </ContentWrapper>
  );
}
