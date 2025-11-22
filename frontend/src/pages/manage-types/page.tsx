"use client";

import { useEffect, useState } from "react";
import { Button } from "@gravity-ui/uikit";
import s from "./page.module.sass";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import Loading from "@/shared/ui/components/Loading/Loading";
import useNotifications from "@/shared/lib/hooks/useNotifications";

// Функция для защиты от SQL-инъекций и опасных символов
const sanitizeInput = (input: string): string => {
  let sanitized = input.substring(0, 30);
  sanitized = sanitized.replace(/[^\w\-а-яА-ЯёЁ\s]/g, "");
  const sqlKeywords = [
    "DROP",
    "DELETE",
    "INSERT",
    "UPDATE",
    "SELECT",
    "ALTER",
    "CREATE",
    "TRUNCATE",
  ];
  const upperSanitized = sanitized.toUpperCase().trim();
  if (sqlKeywords.some((kw) => upperSanitized.startsWith(kw))) {
    return "";
  }

  return sanitized;
};

interface CustomType {
  name: string;
  kind: string;
  values?: string[];
  fields?: Array<{ fieldName: string; fieldType: string }>;
}

interface EnumFormData {
  typeName: string;
  values: string[];
  newValue: string;
}

interface CompositeField {
  fieldName: string;
  fieldType: string;
}

interface CompositeFormData {
  typeName: string;
  fields: CompositeField[];
  newFieldName: string;
  newFieldType: string;
}

export default function ManageTypesPage() {
  const notifier = useNotifications();

  // ENUM управление
  const [enumForm, setEnumForm] = useState<EnumFormData>({
    typeName: "",
    values: [],
    newValue: "",
  });
  const [compositeForm, setCompositeForm] = useState<CompositeFormData>({
    typeName: "",
    fields: [],
    newFieldName: "",
    newFieldType: "text",
  });

  // Список типов
  const [customTypes, setCustomTypes] = useState<CustomType[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadCustomTypes();
  }, []);

  const loadCustomTypes = async () => {
    console.log("loadCustomTypes called");
    setLoading(true);
    try {
      console.log("Calling GetCustomTypes...");
      const response = await (window as any).go.main.App.GetCustomTypes();
      console.log("GetCustomTypes response:", response);

      if (response.error) {
        console.error("GetCustomTypes error:", response.error);
        notifier.error(`Ошибка загрузки: ${response.error}`);
      } else {
        console.log(
          "Setting custom types:",
          response.types?.length || 0,
          "types"
        );
        setCustomTypes(response.types || []);
      }
    } catch (error) {
      console.error("Exception in loadCustomTypes:", error);
      notifier.error(`Ошибка при загрузке типов: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Добавляет новое значение в ENUM
  const handleAddEnumValue = () => {
    if (!enumForm.newValue.trim()) {
      notifier.error("Введите значение ENUM");
      return;
    }
    const sanitizedValue = sanitizeInput(enumForm.newValue);
    if (!sanitizedValue) {
      notifier.error(
        "Значение содержит недопустимые символы или SQL-ключевые слова"
      );
      return;
    }
    if (enumForm.values.includes(sanitizedValue)) {
      notifier.error("Это значение уже добавлено");
      return;
    }

    setEnumForm((prev) => ({
      ...prev,
      values: [...prev.values, sanitizedValue],
      newValue: "",
    }));
  };

  // Удаляет значение из ENUM
  const handleRemoveEnumValue = (index: number) => {
    setEnumForm((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  // Создает новый ENUM тип
  const handleCreateEnum = async () => {
    if (!enumForm.typeName.trim()) {
      notifier.error("Укажите имя типа");
      return;
    }

    // Санитизируем имя типа
    const sanitizedName = sanitizeInput(enumForm.typeName);
    if (!sanitizedName) {
      notifier.error(
        "Имя типа содержит недопустимые символы или SQL-ключевые слова"
      );
      return;
    }

    if (enumForm.values.length === 0) {
      notifier.error("Добавьте хотя бы одно значение");
      return;
    }

    // Санитизируем все значения
    const sanitizedValues = enumForm.values
      .map((v) => sanitizeInput(v))
      .filter((v) => v); // Удаляем пустые значения

    if (sanitizedValues.length === 0) {
      notifier.error("Все значения содержат недопустимые символы");
      return;
    }

    try {
      const result = await (window as any).go.main.App.CreateCustomType({
        typeName: sanitizedName,
        typeKind: "ENUM",
        values: sanitizedValues,
      });

      if (result.success) {
        notifier.success(result.message);
        setEnumForm({ typeName: "", values: [], newValue: "" });
        loadCustomTypes();
      } else {
        notifier.error(result.error || "Ошибка создания типа");
      }
    } catch (error) {
      notifier.error(`Ошибка: ${error}`);
    }
  };

  // === COMPOSITE Функции ===

  const handleAddCompositeField = () => {
    if (!compositeForm.newFieldName.trim()) {
      notifier.error("Введите имя поля");
      return;
    }

    // Санитизируем имя поля
    const sanitizedFieldName = sanitizeInput(compositeForm.newFieldName);
    if (!sanitizedFieldName) {
      notifier.error(
        "Имя поля содержит недопустимые символы или SQL-ключевые слова"
      );
      return;
    }

    if (!compositeForm.newFieldType.trim()) {
      notifier.error("Выберите тип поля");
      return;
    }

    // Проверяем, что такого поля еще нет
    if (compositeForm.fields.some((f) => f.fieldName === sanitizedFieldName)) {
      notifier.error("Поле с таким именем уже добавлено");
      return;
    }

    setCompositeForm((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        { fieldName: sanitizedFieldName, fieldType: prev.newFieldType },
      ],
      newFieldName: "",
      newFieldType: "text",
    }));
  };

  const handleRemoveCompositeField = (index: number) => {
    setCompositeForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const handleCreateComposite = async () => {
    if (!compositeForm.typeName.trim()) {
      notifier.error("Укажите имя типа");
      return;
    }

    // Санитизируем имя типа
    const sanitizedName = sanitizeInput(compositeForm.typeName);
    if (!sanitizedName) {
      notifier.error(
        "Имя типа содержит недопустимые символы или SQL-ключевые слова"
      );
      return;
    }

    if (compositeForm.fields.length === 0) {
      notifier.error("Добавьте хотя бы одно поле");
      return;
    }

    // Санитизируем все поля
    const sanitizedFields = compositeForm.fields
      .map((field) => ({
        fieldName: sanitizeInput(field.fieldName),
        fieldType: field.fieldType, // fieldType выбирается из dropdown, поэтому он безопасен
      }))
      .filter((f) => f.fieldName); // Удаляем пустые поля

    if (sanitizedFields.length === 0) {
      notifier.error("Все имена полей содержат недопустимые символы");
      return;
    }

    try {
      const result = await (window as any).go.main.App.CreateCustomType({
        typeName: sanitizedName,
        typeKind: "COMPOSITE",
        fields: sanitizedFields,
      });

      if (result.success) {
        notifier.success(result.message);
        setCompositeForm({
          typeName: "",
          fields: [],
          newFieldName: "",
          newFieldType: "text",
        });
        loadCustomTypes();
      } else {
        notifier.error(result.error || "Ошибка создания типа");
      }
    } catch (error) {
      notifier.error(`Ошибка: ${error}`);
    }
  };

  // === Удаление типа ===

  const handleDropType = async (typeName: string) => {
    console.log("=== handleDropType START ===");
    console.log("handleDropType called with:", typeName);

    // БЕЗ диалога - удаляем сразу
    console.log("Starting deletion without confirmation dialog");
    setLoading(true);

    try {
      console.log("Calling DropCustomType with:", { typeName });

      const dropResult = (window as any).go.main.App.DropCustomType({
        typeName,
      });

      console.log("DropCustomType returned, waiting for promise...");
      const result = await dropResult;
      console.log("DropCustomType result:", result);

      if (result?.success) {
        console.log("Success! Message:", result.message);
        notifier.success(result.message);
        console.log("Reloading custom types...");
        await loadCustomTypes();
        console.log("Custom types reloaded");
      } else {
        console.error("Drop failed - not success:", result);
        notifier.error(result?.error || "Ошибка удаления типа");
      }
    } catch (error) {
      console.error("=== EXCEPTION in handleDropType ===");
      console.error("Error object:", error);
      console.error(
        "Error message:",
        error instanceof Error ? error.message : String(error)
      );
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "no stack"
      );
      notifier.error(`Ошибка: ${error}`);
    } finally {
      console.log("Finally block - setLoading(false)");
      setLoading(false);
      console.log("=== handleDropType END ===");
    }
  };

  if (loading) return <Loading />;

  return (
    <ContentWrapper>
      <section className={s["manage-types-section"]}>
        <h1 className="h1">Управление пользовательскими типами</h1>

        <div className={s["forms-container"]}>
          {/* === Создание ENUM === */}
          <div className={s["form-block"]}>
            <h2 className="h2">+ Создать ENUM</h2>

            <div className={s["form-group"]}>
              <label>Имя типа</label>
              <input
                type="text"
                placeholder="Например: status, priority"
                value={enumForm.typeName}
                onChange={(e) =>
                  setEnumForm({ ...enumForm, typeName: e.target.value })
                }
                maxLength={30}
                className={s["input"]}
              />
            </div>

            <div className={s["form-group"]}>
              <label>Значения ENUM</label>
              <div className={s["enum-values-input"]}>
                <input
                  type="text"
                  placeholder="Введите значение"
                  value={enumForm.newValue}
                  onChange={(e) =>
                    setEnumForm({ ...enumForm, newValue: e.target.value })
                  }
                  maxLength={30}
                  className={s["input"]}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddEnumValue();
                  }}
                />
                <Button onClick={handleAddEnumValue} view="action" size="m">
                  Добавить
                </Button>
              </div>

              <div className={s["values-list"]}>
                {enumForm.values.map((value, idx) => (
                  <div key={idx} className={s["value-tag"]}>
                    <span>{value}</span>
                    <button
                      onClick={() => handleRemoveEnumValue(idx)}
                      className={s["remove-btn"]}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleCreateEnum} view="action" size="l">
              Создать ENUM
            </Button>
          </div>

          {/* === Создание COMPOSITE === */}
          <div className={s["form-block"]}>
            <h2 className="h2">+ Создать составной тип</h2>

            <div className={s["form-group"]}>
              <label>Имя типа</label>
              <input
                type="text"
                placeholder="Например: address, contact_info"
                value={compositeForm.typeName}
                onChange={(e) =>
                  setCompositeForm({
                    ...compositeForm,
                    typeName: e.target.value,
                  })
                }
                maxLength={30}
                className={s["input"]}
              />
            </div>

            <div className={s["form-group"]}>
              <label>Поля типа</label>
              <div className={s["composite-fields-input"]}>
                <input
                  type="text"
                  placeholder="Имя поля"
                  value={compositeForm.newFieldName}
                  onChange={(e) =>
                    setCompositeForm({
                      ...compositeForm,
                      newFieldName: e.target.value,
                    })
                  }
                  maxLength={30}
                  className={s["input-field-name"]}
                />
                <select
                  value={compositeForm.newFieldType}
                  onChange={(e) =>
                    setCompositeForm({
                      ...compositeForm,
                      newFieldType: e.target.value,
                    })
                  }
                  className={s["input-field-type"]}
                >
                  <option value="text">text</option>
                  <option value="int">int</option>
                  <option value="bigint">bigint</option>
                  <option value="numeric">numeric</option>
                  <option value="double precision">double precision</option>
                  <option value="boolean">boolean</option>
                  <option value="timestamp">timestamp</option>
                  <option value="date">date</option>
                </select>
                <Button
                  onClick={handleAddCompositeField}
                  view="action"
                  size="m"
                >
                  Добавить поле
                </Button>
              </div>

              <div className={s["fields-list"]}>
                {compositeForm.fields.map((field, idx) => (
                  <div key={idx} className={s["field-tag"]}>
                    <span>
                      {field.fieldName} ({field.fieldType})
                    </span>
                    <button
                      onClick={() => handleRemoveCompositeField(idx)}
                      className={s["remove-btn"]}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleCreateComposite} view="action" size="l">
              Создать тип
            </Button>
          </div>
        </div>

        {/* === Список существующих типов === */}
        <div className={s["types-list-section"]}>
          <h2 className="h2">Существующие типы</h2>

          {customTypes.length === 0 ? (
            <div className={s["no-types"]}>
              Пользовательские типы не найдены
            </div>
          ) : (
            <div className={s["types-grid"]}>
              {customTypes.map((type) => (
                <div key={type.name} className={s["type-card"]}>
                  <div className={s["type-header"]}>
                    <h3 className={s["type-name"]}>{type.name}</h3>
                    <span className={s["type-kind"]}>{type.kind}</span>
                  </div>

                  {type.kind === "enum" &&
                  type.values &&
                  type.values.length > 0 ? (
                    <div className={s["type-content"]}>
                      <div className={s["enum-values"]}>
                        {type.values.map((value, idx) => (
                          <span key={idx} className={s["enum-value"]}>
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : type.kind === "composite" && type.fields ? (
                    <div className={s["type-content"]}>
                      <div className={s["composite-fields"]}>
                        {type.fields.map((field, idx) => (
                          <div key={idx} className={s["composite-field"]}>
                            <span className={s["field-name"]}>
                              {field.fieldName}
                            </span>
                            <span className={s["field-type"]}>
                              {field.fieldType}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className={s["type-actions"]}>
                    <Button
                      onClick={() => handleDropType(type.name)}
                      view="outlined"
                      size="m"
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </ContentWrapper>
  );
}
