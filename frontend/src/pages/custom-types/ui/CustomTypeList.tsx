"use client";

import { CustomTypeInfo } from "../types";
import s from "./style.module.sass";

interface CustomTypeListProps {
  types: CustomTypeInfo[];
  onEdit: (type: CustomTypeInfo) => void;
  onDelete: (typeName: string) => void;
  isLoading?: boolean;
}

export default function CustomTypeList({
  types,
  onEdit,
  onDelete,
  isLoading = false,
}: CustomTypeListProps) {
  if (types.length === 0) {
    return (
      <div className={s["empty-state"]}>
        <p>Пользовательских типов ещё не создано</p>
      </div>
    );
  }

  return (
    <div className={s["types-grid"]}>
      {types.map((type) => (
        <div key={type.typeName} className={s["type-card"]}>
          <div className={s["type-header"]}>
            <h3 className={s["type-name"]}>{type.typeName}</h3>
            <span className={s[`type-badge-${type.typeKind.toLowerCase()}`]}>
              {type.typeKind}
            </span>
          </div>

          <div className={s["type-content"]}>
            {type.typeKind === "ENUM" && type.enumValues && (
              <div className={s["enum-values"]}>
                {type.enumValues.map((value) => (
                  <span key={value} className={s["enum-value"]}>
                    {value}
                  </span>
                ))}
              </div>
            )}

            {type.typeKind === "COMPOSITE" && type.fields && (
              <div className={s["composite-fields"]}>
                {type.fields.map((field) => (
                  <div key={field.name} className={s["field"]}>
                    <span className={s["field-name"]}>{field.name}</span>
                    <span className={s["field-type"]}>{field.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={s["type-actions"]}>
            <button
              className={s["btn-edit"]}
              onClick={() => onEdit(type)}
              disabled={isLoading}
            >
              Редактировать
            </button>
            <button
              className={s["btn-delete"]}
              onClick={() => onDelete(type.typeName)}
              disabled={isLoading}
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
