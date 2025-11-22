import { Dialog, Button, TextInput, Checkbox } from "@gravity-ui/uikit";
import { useState } from "react";
import s from "./EditFieldModal.module.sass";
import useApiMiddleware from "@/shared/lib/hooks/useApiMiddleware";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";
import { useQueryClient } from "@tanstack/react-query";
import { main } from "@/shared/lib/wailsjs/go/models";

interface EditFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  field: main.FieldSchema | null;
}

const TypeOptions = [
  { value: "VARCHAR", label: "VARCHAR(255)" },
  { value: "INT", label: "INT" },
  { value: "BIGINT", label: "BIGINT" },
  { value: "DECIMAL", label: "DECIMAL(10,2)" },
  { value: "FLOAT", label: "FLOAT" },
  { value: "BOOLEAN", label: "BOOLEAN" },
  { value: "TEXT", label: "TEXT" },
  { value: "TIMESTAMP", label: "TIMESTAMP" },
  { value: "DATE", label: "DATE" },
  { value: "UUID", label: "UUID" },
];

export default function EditFieldModal({
  isOpen,
  onClose,
  tableName,
  field,
}: EditFieldModalProps) {
  const { apiMiddleware } = useApiMiddleware();
  const notifier = useNotifications();
  const { globalContext } = useGlobalContext();
  const queryClient = useQueryClient();

  const [fieldName, setFieldName] = useState(field?.name || "");
  const [fieldType, setFieldType] = useState(
    field?.type?.split("(")[0] || "VARCHAR"
  );
  const [notNull, setNotNull] = useState(false);
  const [unique, setUnique] = useState(false);

  const handleSave = async () => {
    if (!fieldName || !fieldType) {
      notifier.error("Заполните обязательные поля");
      return;
    }

    const constraints = new main.FieldConstraints({
      notNull,
      unique,
    });

    const request = new main.UpdateFieldRequest({
      tableName,
      oldName: field?.name || "",
      newName: fieldName,
      type: fieldType,
      constraints,
    });

    const response = await apiMiddleware.updateTableField(request);

    if (!response.error) {
      notifier.success(`Поле успешно обновлено`);
      // Инвалидируем кеш
      queryClient.invalidateQueries({
        queryKey: ["tableSchema", globalContext.currentTable],
      });
      onClose();
    } else {
      notifier.error(response.message);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} size="m" onEnterKeyDown={() => {}}>
      <Dialog.Header caption={`Редактирование поля: ${field?.name}`} />
      <Dialog.Body className={s["modal-body"]}>
        <div className={s["form-group"]}>
          <label className={s["label"]}>Имя поля</label>
          <TextInput
            value={fieldName}
            onUpdate={setFieldName}
            placeholder="Имя поля"
          />
        </div>

        <div className={s["form-group"]}>
          <label className={s["label"]}>Тип данных</label>
          <select
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
            className={s["select-input"]}
          >
            {TypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={s["form-group"]}>
          <label className={s["label"]}>Ограничения</label>
          <div className={s["checkbox-group"]}>
            <Checkbox
              checked={notNull}
              onUpdate={setNotNull}
              content="NOT NULL"
            />
            <Checkbox checked={unique} onUpdate={setUnique} content="UNIQUE" />
          </div>
        </div>
      </Dialog.Body>
      <Dialog.Footer
        onClickButtonApply={handleSave}
        onClickButtonCancel={onClose}
        textButtonApply="Сохранить"
        textButtonCancel="Отменить"
      />
    </Dialog>
  );
}
