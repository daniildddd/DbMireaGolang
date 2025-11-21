"use client";

import { useEffect, useState } from "react";
import { Button, TextInput, Select } from "@gravity-ui/uikit";
import s from "./page.module.sass";
import clsx from "clsx";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";
import Loading from "@/shared/ui/components/Loading/Loading";
import notifyAndReturn from "@/shared/lib/utils/notifyAndReturn";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import { useCurrentTableSchema } from "@/shared/lib/hooks/useTableSchema";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";

interface FormValues {
  [key: string]: string | number | boolean | null;
}

export default function InsertPage() {
  const tableNames = useTableNames();
  const { globalContext } = useGlobalContext();
  const notifier = useNotifications();
  const [selectedTable, setSelectedTable] = useState("");
  const [formValues, setFormValues] = useState<FormValues>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastInsertedId, setLastInsertedId] = useState<number | null>(null);

  // Загружаем схему для выбранной таблицы через отдельный хук
  const useTableSchemaForInsert = (tableName: string) => {
    const { isPending, error, data } = useCurrentTableSchema();
    return { isPending, error, data };
  };

  const tableSchema = useTableSchemaForInsert(selectedTable);

  // При выборе новой таблицы, обновляем контекст
  useEffect(() => {
    if (selectedTable) {
      const newContext = { ...globalContext, currentTable: selectedTable };
      // Пересоздаем контекст если нужно
    }
  }, [selectedTable]);

  const handleTableSelect = (table: string) => {
    setSelectedTable(table);
    setFormValues({});
    setLastInsertedId(null);
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const generateInsertQuery = (): string => {
    if (!selectedTable || !tableSchema.data) return "";

    const fields = tableSchema.data.filter(
      (field) =>
        !field.constraints?.includes("PRIMARY KEY") || field.name !== "id"
    );

    const columns = fields.map((f) => f.name);
    const values = fields.map((field) => {
      const value = formValues[field.name];
      if (value === null || value === undefined || value === "") {
        return "NULL";
      }

      // Типы, которые нужно заключить в кавычки
      if (
        field.type === "VARCHAR" ||
        field.type === "TEXT" ||
        field.type === "DATE" ||
        field.type === "TIMESTAMP"
      ) {
        const escapedValue = String(value).replace(/'/g, "''");
        return `'${escapedValue}'`;
      }

      return String(value);
    });

    return `INSERT INTO ${selectedTable} (${columns.join(
      ", "
    )}) VALUES (${values.join(", ")});`;
  };

  const handleSubmit = async () => {
    if (!selectedTable) {
      notifier.error("Выберите таблицу");
      return;
    }

    if (!tableSchema.data || tableSchema.data.length === 0) {
      notifier.error("Не удалось загрузить схему таблицы");
      return;
    }

    const query = generateInsertQuery();

    if (!query) {
      notifier.error("Не удалось создать запрос");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await ApiMiddleware.executeCustomQuery(query);

      if (result.error) {
        notifier.error(`Ошибка: ${result.error}`);
      } else {
        notifier.success("Данные успешно добавлены в таблицу!");

        // Пытаемся получить ID последней вставленной записи
        // В PostgreSQL это работает через RETURNING id
        setLastInsertedId(null);

        // Очищаем форму
        setFormValues({});

        // Инвалидируем кэш данных таблицы
        // const queryClient = useQueryClient();
        // await queryClient.invalidateQueries({
        //   queryKey: ["tableData", selectedTable],
        // });
      }
    } catch (error) {
      notifier.error(`Ошибка при вставке данных: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormValues({});
    setLastInsertedId(null);
  };

  if (tableNames.isPending) return <Loading />;
  if (tableNames.error) return notifyAndReturn(notifier, tableNames.error);
  if (tableNames.data.length === 0) return <div>В базе данных нет таблиц</div>;

  const tableOptions = tableNames.data.map((table) => ({
    value: table,
    label: table,
  }));

  // Фильтруем поля (исключаем PRIMARY KEY поля)
  const editableFields = (tableSchema.data || []).filter(
    (field) => !field.constraints?.includes("PRIMARY KEY")
  );

  return (
    <ContentWrapper>
      <section className={clsx("section")}>
        <h2 className="h2">Вставка данных в таблицу</h2>

        <div className={s["insert-container"]}>
          {/* Выбор таблицы */}
          <div className={s["table-selector"]}>
            <label className={s["section-title"]}>Выберите таблицу</label>
            <Select
              value={[selectedTable]}
              options={tableOptions}
              onUpdate={(value) => handleTableSelect(value[0] || "")}
              placeholder="Выберите таблицу для вставки данных"
            />
          </div>

          {/* Форма вставки данных */}
          {selectedTable && tableSchema.data && (
            <>
              {editableFields.length === 0 ? (
                <div className={s["no-fields"]}>
                  <p>В таблице нет редактируемых полей</p>
                </div>
              ) : (
                <div className={s["form-container"]}>
                  <div className={s["form-title"]}>Данные для вставки</div>

                  {editableFields.map((field) => (
                    <div key={field.name} className={s["form-group"]}>
                      <label className={s["field-label"]}>
                        {field.name}
                        {field.constraints?.includes("NOT NULL") && (
                          <span className={s["required"]}>*</span>
                        )}
                        {field.constraints?.includes("UNIQUE") && (
                          <span className={s["unique"]}>(уникальное)</span>
                        )}
                      </label>

                      {field.type === "BOOLEAN" ? (
                        <Select
                          value={
                            formValues[field.name] !== undefined
                              ? [String(formValues[field.name])]
                              : [""]
                          }
                          options={[
                            { value: "", label: "Не выбрано" },
                            { value: "true", label: "Да" },
                            { value: "false", label: "Нет" },
                          ]}
                          onUpdate={(value) =>
                            handleInputChange(
                              field.name,
                              value[0] === "" ? null : value[0] === "true"
                            )
                          }
                        />
                      ) : (
                        <TextInput
                          type={
                            field.type === "INT" || field.type === "BIGINT"
                              ? "number"
                              : "text"
                          }
                          placeholder={`Введите ${field.name}${
                            field.type === "DATE" || field.type === "TIMESTAMP"
                              ? " (YYYY-MM-DD или YYYY-MM-DD HH:MM:SS)"
                              : ""
                          }`}
                          value={String(formValues[field.name] || "")}
                          onUpdate={(value) =>
                            handleInputChange(field.name, value)
                          }
                        />
                      )}
                    </div>
                  ))}

                  {/* Кнопки действия */}
                  <div className={s["button-group"]}>
                    <Button
                      onClick={handleSubmit}
                      view="action"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Загрузка..." : "Добавить запись"}
                    </Button>
                    <Button
                      onClick={handleReset}
                      view="outlined"
                      disabled={isSubmitting}
                    >
                      Очистить форму
                    </Button>
                  </div>
                </div>
              )}

              {/* Предпросмотр SQL запроса */}
              {selectedTable && (
                <div className={s["sql-preview"]}>
                  <div className={s["sql-title"]}>Предпросмотр запроса</div>
                  <pre className={s["sql-code"]}>{generateInsertQuery()}</pre>
                </div>
              )}

              {/* Успешное добавление */}
              {lastInsertedId && (
                <div className={s["success-message"]}>
                  <p>✓ Запись успешно добавлена (ID: {lastInsertedId})</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </ContentWrapper>
  );
}
