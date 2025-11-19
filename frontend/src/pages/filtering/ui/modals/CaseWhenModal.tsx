"use client";

import { useContext, useState, useEffect } from "react";
import FilterContext from "@/shared/context/FilterContext";
import { CurrentTableContext } from "@/shared/context/CurrentTableContext";
import { FilterType } from "../../types";
import s from "./CaseWhenModal.module.sass";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";
import { main } from "@/shared/lib/wailsjs/go/models";

interface WhenThenPair {
  field: string;
  operator: string;
  value: string;
  alias: string;
}

type CaseMode = "simple" | "coalesce" | "nullif";

interface CaseWhenModalProps {
  handleCloseModal: () => void;
}

export default function CaseWhenModal({
  handleCloseModal,
}: CaseWhenModalProps) {
  const currentTable = useContext(CurrentTableContext);
  const { filters, setFilters } = useContext(FilterContext);

  const [mode, setMode] = useState<CaseMode>("simple");
  const [resultFieldName, setResultFieldName] = useState("");
  const [tableSchema, setTableSchema] = useState<main.FieldSchema[]>([]);

  // Simple CASE
  const [whenThenPairs, setWhenThenPairs] = useState<WhenThenPair[]>([
    { field: "", operator: ">", value: "", alias: "" },
  ]);
  const [elseValue, setElseValue] = useState("");

  // COALESCE
  const [coalesceFields, setCoalesceFields] = useState<string[]>(["", ""]);

  // NULLIF
  const [nullifField, setNullIfField] = useState("");
  const [nullifValue, setNullIfValue] = useState("");

  // Загружаем схему таблицы
  useEffect(() => {
    if (currentTable) {
      ApiMiddleware.getTableSchema(currentTable)
        .then((schema) => setTableSchema(schema))
        .catch((err) => console.error("Ошибка загрузки схемы:", err));
    }
  }, [currentTable]);

  const addWhenThen = () => {
    setWhenThenPairs([
      ...whenThenPairs,
      { field: "", operator: ">", value: "", alias: "" },
    ]);
  };

  const removeWhenThen = (index: number) => {
    setWhenThenPairs(whenThenPairs.filter((_, i) => i !== index));
  };

  const updateWhenThen = (
    index: number,
    field: keyof WhenThenPair,
    value: string
  ) => {
    const updated = [...whenThenPairs];
    updated[index][field] = value;
    setWhenThenPairs(updated);
  };

  const addCoalesceField = () => {
    setCoalesceFields([...coalesceFields, ""]);
  };

  const removeCoalesceField = (index: number) => {
    setCoalesceFields(coalesceFields.filter((_, i) => i !== index));
  };

  const updateCoalesceField = (index: number, value: string) => {
    const updated = [...coalesceFields];
    updated[index] = value;
    setCoalesceFields(updated);
  };

  const generateSQL = () => {
    let expression = "";

    if (mode === "simple") {
      if (
        whenThenPairs.some(
          (pair) =>
            !pair.field.trim() || !pair.operator.trim() || !pair.value.trim()
        )
      ) {
        return null;
      }

      let sql = `CASE`;
      whenThenPairs.forEach((pair) => {
        sql += ` WHEN ${pair.field} ${pair.operator} ${pair.value} THEN ${
          pair.alias || pair.field
        }`;
      });
      if (elseValue.trim()) {
        sql += ` ELSE ${elseValue}`;
      }
      sql += " END";
      expression = sql;
    } else if (mode === "coalesce") {
      const fields = coalesceFields.filter((f) => f.trim());
      if (fields.length < 2) {
        return null;
      }
      expression = `COALESCE(${fields.join(", ")})`;
    } else if (mode === "nullif") {
      if (!nullifField.trim() || !nullifValue.trim()) {
        return null;
      }
      expression = `NULLIF(${nullifField}, ${nullifValue})`;
    }

    return expression;
  };

  const handleSubmit = () => {
    const expression = generateSQL();
    if (!expression) {
      alert("Заполните все обязательные поля");
      return;
    }

    const finalExpression = resultFieldName.trim()
      ? `${expression} AS "${resultFieldName}"`
      : expression;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [FilterType.caseWhen]: [
        ...(prevFilters[FilterType.caseWhen] || []),
        finalExpression,
      ],
    }));

    // Reset
    setResultFieldName("");
    setWhenThenPairs([{ field: "", operator: ">", value: "", alias: "" }]);
    setElseValue("");
    setCoalesceFields(["", ""]);
    setNullIfField("");
    setNullIfValue("");
    setMode("simple");
    handleCloseModal();
  };

  return (
    <div className={s["modal-overlay"]} onClick={handleCloseModal}>
      <div className={s["modal"]} onClick={(e) => e.stopPropagation()}>
        <h2 className={s["modal-title"]}>Добавить CASE выражение</h2>

        {/* Mode Selector */}
        <div className={s["mode-selector"]}>
          <button
            className={`${s["mode-btn"]} ${
              mode === "simple" ? s["active"] : ""
            }`}
            onClick={() => setMode("simple")}
          >
            CASE WHEN
          </button>
          <button
            className={`${s["mode-btn"]} ${
              mode === "coalesce" ? s["active"] : ""
            }`}
            onClick={() => setMode("coalesce")}
          >
            COALESCE
          </button>
          <button
            className={`${s["mode-btn"]} ${
              mode === "nullif" ? s["active"] : ""
            }`}
            onClick={() => setMode("nullif")}
          >
            NULLIF
          </button>
        </div>

        {/* Result Field Name */}
        <div className={s["form-group"]}>
          <label className={s["label"]}>Имя результирующего поля</label>
          <input
            type="text"
            value={resultFieldName}
            onChange={(e) => setResultFieldName(e.target.value)}
            placeholder="например: price_category"
            className={s["input"]}
          />
        </div>

        {/* SIMPLE CASE MODE */}
        {mode === "simple" && (
          <>
            <div className={s["form-group"]}>
              <label className={s["label"]}>Условия WHEN-THEN</label>

              {whenThenPairs.map((pair, index) => (
                <div key={index} className={s["when-then-row"]}>
                  <div className={s["when-then-inputs"]}>
                    <select
                      value={pair.field}
                      onChange={(e) =>
                        updateWhenThen(index, "field", e.target.value)
                      }
                      className={s["input-select"]}
                    >
                      <option value="">-- Выберите поле --</option>
                      {tableSchema.map((field) => (
                        <option key={field.name} value={field.name}>
                          {field.name} ({field.type})
                        </option>
                      ))}
                    </select>

                    <select
                      value={pair.operator}
                      onChange={(e) =>
                        updateWhenThen(index, "operator", e.target.value)
                      }
                      className={s["input-select"]}
                    >
                      <option value=">">&gt;</option>
                      <option value="<">&lt;</option>
                      <option value="=">=</option>
                      <option value=">=">&gt;=</option>
                      <option value="<=">&lt;=</option>
                      <option value="!=">&lt;&gt;</option>
                    </select>

                    <input
                      type="text"
                      value={pair.value}
                      onChange={(e) =>
                        updateWhenThen(index, "value", e.target.value)
                      }
                      placeholder="Значение для сравнения"
                      className={s["input"]}
                    />

                    <input
                      type="text"
                      value={pair.alias}
                      onChange={(e) =>
                        updateWhenThen(index, "alias", e.target.value)
                      }
                      placeholder="Псевдоним (опционально)"
                      className={s["input"]}
                    />
                  </div>
                  {whenThenPairs.length > 1 && (
                    <button
                      className={s["btn-remove-small"]}
                      onClick={() => removeWhenThen(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button className={s["btn-add-small"]} onClick={addWhenThen}>
                + Добавить WHEN
              </button>
            </div>

            <div className={s["form-group"]}>
              <label className={s["label"]}>ELSE (опционально)</label>
              <input
                type="text"
                value={elseValue}
                onChange={(e) => setElseValue(e.target.value)}
                placeholder="Значение по умолчанию"
                className={s["input"]}
              />
            </div>
          </>
        )}

        {/* COALESCE MODE */}
        {mode === "coalesce" && (
          <div className={s["form-group"]}>
            <label className={s["label"]}>Поля (в порядке приоритета)</label>
            {coalesceFields.map((field, index) => (
              <div key={index} className={s["coalesce-row"]}>
                <select
                  value={field}
                  onChange={(e) => updateCoalesceField(index, e.target.value)}
                  className={s["input-select"]}
                >
                  <option value="">-- Выберите поле --</option>
                  {tableSchema.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name} ({f.type})
                    </option>
                  ))}
                </select>
                {coalesceFields.length > 2 && (
                  <button
                    className={s["btn-remove-small"]}
                    onClick={() => removeCoalesceField(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button className={s["btn-add-small"]} onClick={addCoalesceField}>
              + Добавить поле
            </button>
            <p className={s["description"]}>
              COALESCE возвращает первое не-NULL значение из списка
            </p>
          </div>
        )}

        {/* NULLIF MODE */}
        {mode === "nullif" && (
          <>
            <div className={s["form-group"]}>
              <label className={s["label"]}>Поле</label>
              <select
                value={nullifField}
                onChange={(e) => setNullIfField(e.target.value)}
                className={s["input-select"]}
              >
                <option value="">-- Выберите поле --</option>
                {tableSchema.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name} ({f.type})
                  </option>
                ))}
              </select>
            </div>
            <div className={s["form-group"]}>
              <label className={s["label"]}>Значение для замены на NULL</label>
              <input
                type="text"
                value={nullifValue}
                onChange={(e) => setNullIfValue(e.target.value)}
                placeholder="например: 'inactive'"
                className={s["input"]}
              />
            </div>
            <p className={s["description"]}>
              NULLIF вернёт NULL если значение совпадает, иначе вернёт значение
            </p>
          </>
        )}

        {/* Generated SQL */}
        {(() => {
          const sql = generateSQL();
          if (sql) {
            const finalSQL = resultFieldName.trim()
              ? `${sql} AS "${resultFieldName}"`
              : sql;
            return (
              <div className={s["generated-sql"]}>
                <p className={s["sql-label"]}>Итоговый SQL:</p>
                <code className={s["sql-code"]}>{finalSQL}</code>
              </div>
            );
          }
          return null;
        })()}

        <div className={s["modal-actions"]}>
          <button className={s["btn-cancel"]} onClick={handleCloseModal}>
            Отмена
          </button>
          <button className={s["btn-submit"]} onClick={handleSubmit}>
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}
