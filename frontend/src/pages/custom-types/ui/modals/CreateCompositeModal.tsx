"use client";

import { useState } from "react";
import { CreateCustomTypeRequest, CustomTypeField } from "../../types";
import s from "./style.module.sass";

interface CreateCompositeModalProps {
  onClose: () => void;
  onSubmit: (data: CreateCustomTypeRequest) => Promise<void>;
  isLoading?: boolean;
}

export default function CreateCompositeModal({
  onClose,
  onSubmit,
  isLoading = false,
}: CreateCompositeModalProps) {
  const [typeName, setTypeName] = useState("");
  const [typeKind, setTypeKind] = useState<"ENUM" | "COMPOSITE">("COMPOSITE");
  const [fields, setFields] = useState<CustomTypeField[]>([
    { name: "", type: "TEXT" },
  ]);
  const [enumValues, setEnumValues] = useState<string[]>([""]);
  const [error, setError] = useState("");

  const dataTypes = [
    "TEXT",
    "INT",
    "BIGINT",
    "DECIMAL",
    "BOOLEAN",
    "DATE",
    "TIMESTAMP",
  ];

  const addField = () => {
    setFields([...fields, { name: "", type: "TEXT" }]);
  };

  const removeField = (index: number) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const updateField = (
    index: number,
    key: keyof CustomTypeField,
    value: string
  ) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  const addEnumValue = () => {
    setEnumValues([...enumValues, ""]);
  };

  const removeEnumValue = (index: number) => {
    if (enumValues.length > 1) {
      setEnumValues(enumValues.filter((_, i) => i !== index));
    }
  };

  const updateEnumValue = (index: number, value: string) => {
    const newValues = [...enumValues];
    newValues[index] = value;
    setEnumValues(newValues);
  };

  const handleSubmit = async () => {
    if (!typeName.trim()) {
      setError("Название типа не может быть пустым");
      return;
    }

    if (typeKind === "COMPOSITE") {
      const validFields = fields.filter((f) => f.name.trim() && f.type.trim());
      if (validFields.length === 0) {
        setError("Необходимо добавить хотя бы одно поле");
        return;
      }

      try {
        setError("");
        await onSubmit({
          typeName: typeName.trim(),
          typeKind: "COMPOSITE",
          fields: validFields,
          enumValues: [], // пустой массив для COMPOSITE
        });

        // Очистка формы после успешного создания
        setTypeName("");
        setFields([{ name: "", type: "TEXT" }]);
        setEnumValues([""]);
      } catch (err: any) {
        setError(err.message || "Ошибка при создании типа");
      }
    } else {
      // ENUM
      const validValues = enumValues.filter((v) => v.trim());
      if (validValues.length === 0) {
        setError("Необходимо добавить хотя бы одно значение для ENUM");
        return;
      }

      try {
        setError("");
        await onSubmit({
          typeName: typeName.trim(),
          typeKind: "ENUM",
          enumValues: validValues,
          fields: [], // пустой массив для ENUM
        });

        // Очистка формы после успешного создания
        setTypeName("");
        setFields([{ name: "", type: "TEXT" }]);
        setEnumValues([""]);
      } catch (err: any) {
        setError(err.message || "Ошибка при создании типа");
      }
    }
  };

  return (
    <div className={s["modal-overlay"]} onClick={onClose}>
      <div className={s["modal"]} onClick={(e) => e.stopPropagation()}>
        <h2 className={s["modal-title"]}>Создать пользовательский тип</h2>

        <div className={s["form-group"]}>
          <label className={s["label"]}>Тип</label>
          <select
            value={typeKind}
            onChange={(e) =>
              setTypeKind(e.target.value as "ENUM" | "COMPOSITE")
            }
            className={s["input"]}
            disabled={isLoading}
          >
            <option value="COMPOSITE">COMPOSITE (составной тип)</option>
            <option value="ENUM">ENUM (перечисление)</option>
          </select>
        </div>

        <div className={s["form-group"]}>
          <label className={s["label"]}>Название типа</label>
          <input
            type="text"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            placeholder="Например: product_info или status_type"
            className={s["input"]}
            disabled={isLoading}
          />
        </div>

        {typeKind === "COMPOSITE" ? (
          <div className={s["form-group"]}>
            <label className={s["label"]}>Поля</label>
            {fields.map((field, index) => (
              <div key={index} className={s["field-row"]}>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => updateField(index, "name", e.target.value)}
                  placeholder="Имя поля"
                  className={s["input-field"]}
                  disabled={isLoading}
                />
                <select
                  value={field.type}
                  onChange={(e) => updateField(index, "type", e.target.value)}
                  className={s["select-type"]}
                  disabled={isLoading}
                >
                  {dataTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {fields.length > 1 && (
                  <button
                    className={s["btn-remove"]}
                    onClick={() => removeField(index)}
                    disabled={isLoading}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              className={s["btn-add"]}
              onClick={addField}
              disabled={isLoading}
            >
              + Добавить поле
            </button>
          </div>
        ) : (
          <div className={s["form-group"]}>
            <label className={s["label"]}>Значения ENUM</label>
            {enumValues.map((value, index) => (
              <div key={index} className={s["field-row"]}>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateEnumValue(index, e.target.value)}
                  placeholder={`Значение ${index + 1}`}
                  className={s["input"]}
                  disabled={isLoading}
                />
                {enumValues.length > 1 && (
                  <button
                    className={s["btn-remove"]}
                    onClick={() => removeEnumValue(index)}
                    disabled={isLoading}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              className={s["btn-add"]}
              onClick={addEnumValue}
              disabled={isLoading}
            >
              + Добавить значение
            </button>
          </div>
        )}

        {error && <div className={s["error"]}>{error}</div>}

        <div className={s["modal-actions"]}>
          <button
            className={s["btn-cancel"]}
            onClick={onClose}
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            className={s["btn-submit"]}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Создание..." : "Создать"}
          </button>
        </div>
      </div>
    </div>
  );
}
