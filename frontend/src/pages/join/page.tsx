"use client";

import { useEffect, useState } from "react";
import { Select, Button } from "@gravity-ui/uikit";
import s from "./page.module.sass";
import clsx from "clsx";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";
import Loading from "@/shared/ui/components/Loading/Loading";
import notifyAndReturn from "@/shared/lib/utils/notifyAndReturn";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import { useCurrentTableSchema } from "@/shared/lib/hooks/useTableSchema";
import GeneratedSQL from "@/shared/ui/components/GeneratedSQL/GeneratedSQL";
import QueryResults from "@/shared/ui/components/QueryResults/QueryResults";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";

type JoinType = "INNER" | "LEFT" | "RIGHT" | "FULL";

interface JoinClause {
  id: string;
  type: JoinType;
  table: string;
  mainField: string;
  joinField: string;
}

export default function JoinPage() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useGlobalContext();
  const currentTableSchema = useCurrentTableSchema();
  const notifier = useNotifications();
  const [queryResults, setQueryResults] = useState<any>(null);

  const [mainTable, setMainTable] = useState("");
  const [joins, setJoins] = useState<JoinClause[]>([]);

  // Устанавливаем первую таблицу при загрузке
  if (
    tableNames.data &&
    tableNames.data.length > 0 &&
    !globalContext.currentTable
  ) {
    setGlobalContext({ ...globalContext, currentTable: tableNames.data[0] });
  }

  // Инициализируем основную таблицу
  useEffect(() => {
    if (globalContext.currentTable && !mainTable) {
      setMainTable(globalContext.currentTable);
    }
  }, [globalContext.currentTable]);

  const handleAddJoin = () => {
    const newJoin: JoinClause = {
      id: Date.now().toString(),
      type: "INNER",
      table: "",
      mainField: "",
      joinField: "",
    };
    setJoins([...joins, newJoin]);
  };

  const handleRemoveJoin = (id: string) => {
    setJoins(joins.filter((j) => j.id !== id));
  };

  const handleUpdateJoin = (id: string, updates: Partial<JoinClause>) => {
    setJoins(joins.map((j) => (j.id === id ? { ...j, ...updates } : j)));
  };

  const generateSQL = (): string => {
    if (!mainTable) return "";

    let sql = `SELECT * FROM ${mainTable}`;

    joins.forEach((join) => {
      if (join.table && join.mainField && join.joinField) {
        sql += ` ${join.type} JOIN ${join.table} ON ${mainTable}.${join.mainField} = ${join.table}.${join.joinField}`;
      }
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

  const query = generateSQL();

  if (tableNames.isPending) return <Loading />;
  if (tableNames.error) return notifyAndReturn(notifier, tableNames.error);
  if (tableNames.data.length === 0) return <div>В базе данных нет таблиц</div>;

  const tableOptions = tableNames.data.map((table) => ({
    value: table,
    label: table,
  }));

  // Получаем поля для текущей основной таблицы
  const mainTableSchema = mainTable ? currentTableSchema.data || [] : [];
  const mainTableFields = mainTableSchema.map((f) => ({
    value: f.name,
    label: f.name,
  }));

  // Функция для загрузки полей для join таблицы
  const getJoinTableFields = (tableName: string) => {
    // TODO: Здесь нужно загрузить поля для конкретной таблицы
    // Сейчас возвращаем пустой массив
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
            <Select
              value={[mainTable]}
              options={tableOptions}
              onUpdate={(value) => setMainTable(value[0] || "")}
            />
          </div>

          {/* Список JOIN условий */}
          {joins.length > 0 && (
            <div className={s["joins-list"]}>
              {joins.map((join, index) => (
                <div key={join.id} className={s["join-clause"]}>
                  <div className={s["join-clause__row"]}>
                    <label className={s["section-title"]}>Тип</label>
                    <Select
                      value={[join.type]}
                      options={[
                        { value: "INNER", label: "INNER JOIN" },
                        { value: "LEFT", label: "LEFT JOIN" },
                        { value: "RIGHT", label: "RIGHT JOIN" },
                        { value: "FULL", label: "FULL JOIN" },
                      ]}
                      onUpdate={(value) =>
                        handleUpdateJoin(join.id, {
                          type: value[0] as JoinType,
                        })
                      }
                    />
                  </div>

                  <div className={s["join-clause__row"]}>
                    <label className={s["section-title"]}>Таблица</label>
                    <Select
                      value={[join.table]}
                      options={tableOptions}
                      onUpdate={(value) =>
                        handleUpdateJoin(join.id, { table: value[0] || "" })
                      }
                    />
                  </div>

                  <div className={s["join-clause__row"]}>
                    <label className={s["section-title"]}>
                      Поле из {mainTable}
                    </label>
                    <Select
                      value={[join.mainField]}
                      options={mainTableFields}
                      onUpdate={(value) =>
                        handleUpdateJoin(join.id, { mainField: value[0] || "" })
                      }
                    />
                  </div>

                  <div className={s["join-clause__row"]}>
                    <label className={s["section-title"]}>
                      Поле из {join.table}
                    </label>
                    <Select
                      value={[join.joinField]}
                      options={getJoinTableFields(join.table)}
                      onUpdate={(value) =>
                        handleUpdateJoin(join.id, { joinField: value[0] || "" })
                      }
                    />
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

        {/* SQL запрос */}
        <div className={s["sql-section"]}>
          <GeneratedSQL query={query} onExecute={handleExecuteQuery} />
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
