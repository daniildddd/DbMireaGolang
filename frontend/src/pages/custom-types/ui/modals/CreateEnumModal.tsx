"use client";

import { useState } from "react";
import { CreateCustomTypeRequest } from "../../types";
import s from "./style.module.sass";

interface CreateEnumModalProps {
  onClose: () => void;
  onSubmit: (data: CreateCustomTypeRequest) => Promise<void>;
  isLoading?: boolean;
}

export default function CreateEnumModal({
  onClose,
  onSubmit,
  isLoading = false,
}: CreateEnumModalProps) {
  const [typeName, setTypeName] = useState("");
  const [enumValues, setEnumValues] = useState<string[]>([""]);
  const [error, setError] = useState("");

  const addValueField = () => {
    setEnumValues([...enumValues, ""]);
  };

  const removeValueField = (index: number) => {
    setEnumValues(enumValues.filter((_, i) => i !== index));
  };

  const updateValue = (index: number, value: string) => {
    const newValues = [...enumValues];
    newValues[index] = value;
    setEnumValues(newValues);
  };

  const handleSubmit = async () => {
    if (!typeName.trim()) {
      setError("Название типа не может быть пусто");
      return;
    }

    const values = enumValues.filter((v) => v.trim());
    if (values.length === 0) {
      setError("Необходимо добавить хотя бы одно значение");
      return;
    }

    try {
      setError("");
      await onSubmit({
        typeName: typeName.trim(),
        typeKind: "ENUM",
        enumValues: values,
      });
      setTypeName("");
      setEnumValues([""]);
    } catch (err: any) {
      setError(err.message || "Ошибка при создании типа");
    }
  };

  return (
    <div className={s["modal-overlay"]} onClick={onClose}>
      <div className={s["modal"]} onClick={(e) => e.stopPropagation()}>
        <h2 className={s["modal-title"]}>Создать ENUM</h2>

        <div className={s["form-group"]}>
          <label className={s["label"]}>Название типа</label>
          <input
            type="text"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            placeholder="Например: coffee_size"
            className={s["input"]}
          />
        </div>

        <div className={s["form-group"]}>
          <label className={s["label"]}>Значения ENUM</label>
          {enumValues.map((value, index) => (
            <div key={index} className={s["input-row"]}>
              <input
                type="text"
                value={value}
                onChange={(e) => updateValue(index, e.target.value)}
                placeholder={`Значение ${index + 1}`}
                className={s["input"]}
              />
              {enumValues.length > 1 && (
                <button
                  className={s["btn-remove"]}
                  onClick={() => removeValueField(index)}
                  disabled={isLoading}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            className={s["btn-add"]}
            onClick={addValueField}
            disabled={isLoading}
          >
            + Добавить значение
          </button>
        </div>

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
