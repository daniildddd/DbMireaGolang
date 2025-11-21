"use client";

import { useEffect, useState } from "react";
import { Button, Select } from "@gravity-ui/uikit";
import s from "./page.module.sass";
import clsx from "clsx";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";
import Loading from "@/shared/ui/components/Loading/Loading";
import notifyAndReturn from "@/shared/lib/utils/notifyAndReturn";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import {
  GetInsertFormFields,
  InsertRecord,
} from "@/shared/lib/wailsjs/go/main/App";
import { main } from "@/shared/lib/wailsjs/go/models";

interface FormValues {
  [key: string]: string | number | boolean | null;
}

interface UseCurrentTimeState {
  [key: string]: boolean;
}

export default function InsertPage() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useGlobalContext();
  const notifier = useNotifications();
  const [selectedTable, setSelectedTable] = useState("");
  const [formValues, setFormValues] = useState<FormValues>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState<main.FieldInfo[]>([]);
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [useCurrentTime, setUseCurrentTime] = useState<UseCurrentTimeState>({});

  // При загрузке компонента - выбираем первую таблицу по дефолту
  useEffect(() => {
    if (tableNames.data && tableNames.data.length > 0 && !selectedTable) {
      const firstTable = tableNames.data[0];
      setSelectedTable(firstTable);
      setGlobalContext({ ...globalContext, currentTable: firstTable });
    }
  }, [tableNames.data]);

  // При выборе новой таблицы, загружаем поля
  useEffect(() => {
    if (selectedTable) {
      setFormValues({});

      // Загружаем поля формы из backend
      setFieldsLoading(true);
      GetInsertFormFields({ tableName: selectedTable })
        .then((fieldsList) => {
          setFields(fieldsList || []);
        })
        .catch(() => {
          setFields([]);
        })
        .finally(() => setFieldsLoading(false));
    }
  }, [selectedTable]);

  const handleTableSelect = (table: string) => {
    setSelectedTable(table);
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleInsertCurrentTime = (fieldName: string) => {
    // Форматируем текущее время в формате PostgreSQL timestamp
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace("T", " ");
    handleInputChange(fieldName, timestamp);
    setUseCurrentTime((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const formatDateInput = (input: string): string => {
    // Удаляем все символы кроме цифр
    const digits = input.replace(/\D/g, "");

    // YYYY-MM-DD HH:MM:SS (19 символов)
    // или YYYY-MM-DD (10 символов)
    if (digits.length <= 8) {
      // Форматируем как дату: YYYY-MM-DD
      if (digits.length <= 4) return digits;
      if (digits.length <= 6) {
        return `${digits.slice(0, 4)}-${digits.slice(4)}`;
      }
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
    } else {
      // Форматируем как дату с временем: YYYY-MM-DD HH:MM:SS
      const dateStr = `${digits.slice(0, 4)}-${digits.slice(
        4,
        6
      )}-${digits.slice(6, 8)}`;
      if (digits.length <= 8) return dateStr;

      const timeStr = digits.slice(8);
      if (timeStr.length <= 2) {
        return `${dateStr} ${timeStr}`;
      }
      if (timeStr.length <= 4) {
        return `${dateStr} ${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
      }
      return `${dateStr} ${timeStr.slice(0, 2)}:${timeStr.slice(
        2,
        4
      )}:${timeStr.slice(4, 6)}`;
    }
  };

  const handleSubmit = async () => {
    if (!selectedTable) {
      notifier.error("Выберите таблицу");
      return;
    }

    if (!fields || fields.length === 0) {
      notifier.error("Не удалось загрузить поля таблицы");
      return;
    }

    // Проверяем обязательные поля
    for (const field of fields) {
      if (!field.isNullable) {
        const value = formValues[field.name];
        if (value === null || value === undefined || value === "") {
          notifier.error(`Поле "${field.name}" обязательно для заполнения`);
          return;
        }
      }
    }

    // Проверяем ENUM значения
    for (const field of fields) {
      if (field.enumValues && field.enumValues.length > 0) {
        const value = formValues[field.name];
        if (value !== null && value !== undefined && value !== "") {
          const trimmedValue = String(value).trim();
          if (!field.enumValues.includes(trimmedValue)) {
            notifier.error(
              `Поле "${
                field.name
              }": недопустимое значение "${trimmedValue}". Допустимые значения: ${field.enumValues.join(
                ", "
              )}`
            );
            return;
          }
        }
      }
    }

    // Готовим данные для отправки
    const data: Record<string, any> = {};
    for (const field of fields) {
      const value = formValues[field.name];
      if (value !== null && value !== undefined && value !== "") {
        data[field.name] = value;
      }
    }

    if (Object.keys(data).length === 0) {
      notifier.error("Заполните хотя бы одно поле");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await InsertRecord({
        tableName: selectedTable,
        data: data,
      });

      if (!result.success) {
        notifier.error(result.message || "Не удалось добавить запись");
      } else {
        notifier.success(result.message || "Запись успешно добавлена!");
        setFormValues({});
      }
    } catch (error) {
      notifier.error(`Ошибка при вставке данных: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormValues({});
  };

  if (tableNames.isPending) return <Loading />;
  if (tableNames.error) return notifyAndReturn(notifier, tableNames.error);
  if (tableNames.data.length === 0) return <div>В базе данных нет таблиц</div>;

  return (
    <ContentWrapper>
      <section className={clsx("section")}>
        <h2 className="h2">Вставка данных в таблицу</h2>

        <div className={s["insert-container"]}>
          {/* Выбор таблицы */}
          <div className={s["table-selector"]}>
            <label className={s["section-title"]}>Выберите таблицу</label>
            <select
              value={selectedTable}
              onChange={(e) => handleTableSelect(e.target.value)}
              className={s["table-select"]}
            >
              <option value="">Выберите таблицу для вставки данных</option>
              {tableNames.data.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>{" "}
          {/* Форма вставки данных */}
          {selectedTable && fields.length > 0 && (
            <>
              {fields.filter((f) => !f.isAutoIncrement).length === 0 ? (
                <div className={s["no-fields"]}>
                  <p>В таблице нет редактируемых полей</p>
                </div>
              ) : (
                <div className={s["form-container"]}>
                  <div className={s["form-title"]}>Данные для вставки</div>

                  {fields
                    .filter((field) => !field.isAutoIncrement)
                    .map((field) => (
                      <div key={field.name} className={s["form-group"]}>
                        <label className={s["field-label"]}>
                          {field.name}
                          {!field.isNullable && (
                            <span className={s["required"]}>*</span>
                          )}
                        </label>

                        {field.type === "boolean" ? (
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
                        ) : field.enumValues && field.enumValues.length > 0 ? (
                          // Enum тип - используем Select
                          <Select
                            value={
                              formValues[field.name] !== undefined
                                ? [String(formValues[field.name])]
                                : [""]
                            }
                            options={[
                              { value: "", label: "Не выбрано" },
                              ...field.enumValues.map((val) => ({
                                value: val,
                                label: val,
                              })),
                            ]}
                            onUpdate={(value) =>
                              handleInputChange(
                                field.name,
                                value[0] === "" ? null : value[0]
                              )
                            }
                          />
                        ) : field.type === "integer" ||
                          field.type === "bigint" ||
                          field.type.includes("int") ||
                          field.type.includes("numeric") ||
                          field.type.includes("double") ||
                          field.type.includes("real") ||
                          field.type.includes("decimal") ? (
                          // NUMERIC тип - ЦИФРЫ, ТОЧКА И МИНУС
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="Введите число"
                            value={String(formValues[field.name] || "")}
                            onKeyDown={(e) => {
                              const key = e.key;
                              const isNumber = /[0-9]/.test(key);
                              const isDot =
                                key === "." &&
                                !String(formValues[field.name] || "").includes(
                                  "."
                                );
                              const isMinus =
                                key === "-" && formValues[field.name] === "";
                              const isControl = [
                                "Backspace",
                                "Delete",
                                "ArrowLeft",
                                "ArrowRight",
                                "Tab",
                              ].includes(key);

                              if (
                                !isNumber &&
                                !isDot &&
                                !isMinus &&
                                !isControl
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                                handleInputChange(field.name, value);
                              }
                            }}
                            className={s["form-input"]}
                          />
                        ) : field.type.includes("date") &&
                          !field.type.includes("timestamp") ? (
                          // DATE тип - встроенный date picker
                          <input
                            type="date"
                            value={String(formValues[field.name] || "")}
                            onChange={(e) => {
                              handleInputChange(field.name, e.target.value);
                            }}
                            className={s["form-input"]}
                          />
                        ) : field.type.includes("timestamp") ||
                          field.type.includes("time") ? (
                          // TIMESTAMP тип - с кнопкой "Текущее время" и автоформатированием
                          <div className={s["timestamp-group"]}>
                            <input
                              type="text"
                              placeholder="YYYY-MM-DD HH:MM:SS (разделители опциональны)"
                              value={String(formValues[field.name] || "")}
                              onChange={(e) => {
                                const formatted = formatDateInput(
                                  e.target.value
                                );
                                handleInputChange(field.name, formatted);
                                setUseCurrentTime((prev) => ({
                                  ...prev,
                                  [field.name]: false,
                                }));
                              }}
                              className={s["form-input"]}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleInsertCurrentTime(field.name)
                              }
                              className={s["timestamp-button"]}
                              title="Вставить текущее время"
                            >
                              Сейчас
                            </button>
                          </div>
                        ) : (
                          // Текстовый тип - РАЗРЕШЕНЫ ВСЕ СИМВОЛЫ (макс 20)
                          <input
                            type="text"
                            placeholder="Введите текст (макс 20 символов)"
                            maxLength={20}
                            value={String(formValues[field.name] || "")}
                            onChange={(e) => {
                              handleInputChange(field.name, e.target.value);
                            }}
                            className={s["form-input"]}
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
            </>
          )}
        </div>
      </section>
    </ContentWrapper>
  );
}
