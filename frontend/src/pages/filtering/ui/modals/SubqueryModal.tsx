"use client";

import { useContext, useState, useEffect } from "react";
import FilterContext from "@/shared/context/FilterContext";
import { CurrentTableContext } from "@/shared/context/CurrentTableContext";
import { FilterType } from "../../types";
import s from "./SubqueryModal.module.sass";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";
import { main } from "@/shared/lib/wailsjs/go/models";

type SubqueryType = "IN" | "NOT IN" | "EXISTS" | "NOT EXISTS";

interface SubqueryModalProps {
  handleCloseModal: () => void;
}

export default function SubqueryModal({
  handleCloseModal,
}: SubqueryModalProps) {
  const currentTable = useContext(CurrentTableContext);
  const { filters, setFilters } = useContext(FilterContext);

  const [isCorrelated, setIsCorrelated] = useState(false);
  const [subqueryType, setSubqueryType] = useState<SubqueryType>("IN");
  const [comparisonField, setComparisonField] = useState("");
  const [comparisonOp, setComparisonOp] = useState("=");
  const [subqueryTable, setSubqueryTable] = useState("");
  const [selectField, setSelectField] = useState("");
  const [hasWhereCondition, setHasWhereCondition] = useState(false);
  const [tableSchema, setTableSchema] = useState<main.FieldSchema[]>([]);

  const comparisonOperators = ["=", "!=", "<>", "<", ">", "<=", ">="];
  const subqueryTypes: SubqueryType[] = [
    "IN",
    "NOT IN",
    "EXISTS",
    "NOT EXISTS",
  ];

  // Загружаем схему таблицы при монтировании
  useEffect(() => {
    if (currentTable) {
      ApiMiddleware.getTableSchema(currentTable)
        .then((schema) => {
          setTableSchema(schema);
          if (!comparisonField && schema.length > 0) {
            setComparisonField(schema[0].name);
          }
        })
        .catch((err) => console.error("Ошибка загрузки схемы:", err));
    }
  }, [currentTable]);

  const handleSubmit = () => {
    // Validation
    if (!comparisonField.trim()) {
      alert("Выберите поле для сравнения");
      return;
    }
    if (!subqueryTable.trim()) {
      alert("Выберите таблицу подзапроса");
      return;
    }
    if (!selectField.trim()) {
      alert("Выберите поле для выборки");
      return;
    }

    // Build the subquery
    let subquery = `SELECT ${selectField} FROM ${subqueryTable}`;
    if (hasWhereCondition) {
      subquery += " WHERE ...";
    }

    // Build the final filter
    let filter = "";
    if (subqueryType === "EXISTS" || subqueryType === "NOT EXISTS") {
      filter = `${subqueryType} (${subquery})`;
    } else {
      filter = `${comparisonField} ${subqueryType} (${subquery})`;
    }

    // Add to filters
    setFilters((prevFilters) => ({
      ...prevFilters,
      [FilterType.where]: [...(prevFilters[FilterType.where] || []), filter],
    }));

    // Reset
    setIsCorrelated(false);
    setSubqueryType("IN");
    setComparisonField("");
    setComparisonOp("=");
    setSubqueryTable("");
    setSelectField("");
    setHasWhereCondition(false);
    handleCloseModal();
  };

  return (
    <div className={s["modal-overlay"]} onClick={handleCloseModal}>
      <div className={s["modal"]} onClick={(e) => e.stopPropagation()}>
        <h2 className={s["modal-title"]}>Добавить подзапрос</h2>

        {/* Correlated subquery checkbox */}
        <div className={s["form-group"]}>
          <label className={s["checkbox-label"]}>
            <input
              type="checkbox"
              checked={isCorrelated}
              onChange={(e) => setIsCorrelated(e.target.checked)}
            />
            Коррелированный подзапрос (добавить в SELECT)
          </label>
        </div>

        {/* Subquery Type */}
        <div className={s["form-group"]}>
          <label className={s["label"]}>Тип подзапроса</label>
          <select
            value={subqueryType}
            onChange={(e) => setSubqueryType(e.target.value as SubqueryType)}
            className={s["input-select"]}
          >
            {subqueryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Comparison Field (for IN/NOT IN) */}
        {(subqueryType === "IN" || subqueryType === "NOT IN") && (
          <div className={s["form-group"]}>
            <label className={s["label"]}>Поле для сравнения</label>
            <select
              value={comparisonField}
              onChange={(e) => setComparisonField(e.target.value)}
              className={s["input-select"]}
            >
              <option value="">-- Выберите поле --</option>
              {tableSchema.map((field) => (
                <option key={field.name} value={field.name}>
                  {field.name} ({field.type})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Operator (currently hidden, can be used for future enhancements) */}
        {(subqueryType === "IN" || subqueryType === "NOT IN") && (
          <div className={s["form-group"]}>
            <label className={s["label"]}>Оператор</label>
            <select
              value={comparisonOp}
              onChange={(e) => setComparisonOp(e.target.value)}
              className={s["input-select"]}
            >
              {comparisonOperators.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subquery Table */}
        <div className={s["form-group"]}>
          <label className={s["label"]}>Таблица подзапроса</label>
          <select
            value={subqueryTable}
            onChange={(e) => setSubqueryTable(e.target.value)}
            className={s["input-select"]}
          >
            <option value="">-- Выберите таблицу --</option>
            <option value="Product">Product</option>
            <option value="Sales">Sales</option>
            <option value="Inventory">Inventory</option>
            <option value="ProductionBatches">ProductionBatches</option>
          </select>
        </div>

        {/* Select Field */}
        <div className={s["form-group"]}>
          <label className={s["label"]}>Поле для выборки</label>
          <select
            value={selectField}
            onChange={(e) => setSelectField(e.target.value)}
            className={s["input-select"]}
          >
            <option value="">-- Выберите поле --</option>
            <option value="id">id</option>
            <option value="name">name</option>
            <option value="price">price</option>
            <option value="quantity">quantity</option>
          </select>
        </div>

        {/* WHERE condition checkbox */}
        <div className={s["form-group"]}>
          <label className={s["checkbox-label"]}>
            <input
              type="checkbox"
              checked={hasWhereCondition}
              onChange={(e) => setHasWhereCondition(e.target.checked)}
            />
            Добавить условие WHERE
          </label>
        </div>

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
