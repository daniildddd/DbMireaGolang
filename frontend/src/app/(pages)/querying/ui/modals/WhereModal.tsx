import { Modal, Label, NumberInput } from "@gravity-ui/uikit";
import { Operator, TableField } from "@/types";
import { useState } from "react";
import CancelButton from "../buttons/CancelButton";
import SubmitButton from "../buttons/SubmitButton";
import FieldNameSelector from "../selectors/FieldNameSelector";
import OperatorSelector from "../selectors/OperatorSelector";
import s from "./style.module.sass";

interface WhereModalParams {
  open: boolean;
  setOpen: (arg0: boolean) => void;
  setReturnValues: (arg0: object) => void;
  fields: TableField[];
  step?: number;
  min?: number;
  max?: number;
}

export default function WhereModal({
  open,
  setOpen,
  setReturnValues,
  fields,
  step = 1,
  min = -Infinity,
  max = +Infinity,
}: WhereModalParams) {
  const [fieldName, setFieldName] = useState<string>();
  const [operator, setOperator] = useState<Operator>();
  const [inputNumber, setInputNumber] = useState<number>();

  return (
    <Modal
      open={open}
      className="filter-modal"
      onOpenChange={(opem, e, reason) => {
        if (reason == "escape-key" || reason == "outside-press") {
          setOpen(false);
        }
      }}
    >
      <h1 className="h1 filter-modal__title">Добавить фильтр (WHERE)</h1>
      <form
        action="."
        method="post"
        id="where-form"
        className="form where-form"
      >
        <div className={s["form__row"]}>
          <Label>Поле</Label>
          <FieldNameSelector fields={fields} setFieldName={setFieldName} />
        </div>
        <div className={s["form__row"]}>
          <Label>Оператор</Label>
          <OperatorSelector onUpdate={(value) => setOperator(value[0])} />
        </div>
        <div className={s["form__row"]}>
          <Label>Число</Label>
          <NumberInput
            placeholder="0"
            value={inputNumber}
            step={step}
            min={min}
            max={max}
            onChange={(e) => {
              setInputNumber(+e.target.value);
            }}
          />
        </div>
      </form>
      <div className="filter-modal__buttons">
        <CancelButton setOpen={setOpen} />
        <SubmitButton
          setOpen={setOpen}
          values={{ fieldName, operator, inputNumber }}
          setReturnValues={setReturnValues}
        />
      </div>
    </Modal>
  );
}
