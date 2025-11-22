import { Dialog, Button, TextInput, Checkbox } from "@gravity-ui/uikit";
import { useState } from "react";
import s from "./EditFieldModal.module.sass";
import useApiMiddleware from "@/shared/lib/hooks/useApiMiddleware";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";
import { useQueryClient } from "@tanstack/react-query";
import { main } from "@/shared/lib/wailsjs/go/models";

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
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

export default function AddFieldModal({
  isOpen,
  onClose,
  tableName,
}: AddFieldModalProps) {
  const { apiMiddleware } = useApiMiddleware();
  const notifier = useNotifications();
  const { globalContext } = useGlobalContext();
  const queryClient = useQueryClient();

  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("VARCHAR");
  const [notNull, setNotNull] = useState(false);
  const [unique, setUnique] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!fieldName || !fieldType) {
      notifier.error("Заполните обязательные поля");
      return;
    }

    setIsLoading(true);

    try {
      const constraints = new main.FieldConstraints({
        notNull,
        unique,
      });

      const request = new main.AddFieldRequest({
        tableName,
        fieldName,
        type: fieldType,
        constraints,
      });

      const response = await apiMiddleware.addTableField(request);

      if (!response.error) {
        notifier.success(`Поле '${fieldName}' успешно добавлено`);
        queryClient.invalidateQueries({
          queryKey: ["tableSchema", globalContext.currentTable],
        });
        handleClose();
      } else {
        notifier.error(response.message);
      }
    } catch (error) {
      notifier.error(`Ошибка: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFieldName("");
    setFieldType("VARCHAR");
    setNotNull(false);
    setUnique(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} size="m">
      <Dialog.Header caption="Добавить новое поле" />
      <Dialog.Body className={s["modal-body"]}>
        <div className={s["form-group"]}>
          <label className={s["label"]}>Имя поля</label>
          <TextInput
            value={fieldName}
            onUpdate={setFieldName}
            placeholder="Имя поля"
            maxLength={20}
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
        onClickButtonCancel={handleClose}
        textButtonApply="Добавить"
        textButtonCancel="Отменить"
        loading={isLoading}
      />
    </Dialog>
  );
}
