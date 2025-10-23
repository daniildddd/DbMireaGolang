import { Label } from "@gravity-ui/uikit";
import { TableField } from "@/types";
import { useState } from "react";
import CancelButton from "../buttons/CancelButton";
import SubmitButton from "../buttons/SubmitButton";
import FieldNameSelector from "../selectors/FieldNameSelector";
import s from "./style.module.sass";
import OrderingSelector from "../selectors/OrderingSelector";
import AbstractModal from "./AbstractModal";

interface OrderByModalParams {
  open: boolean;
  handleCloseModal: (arg0: boolean) => void;
  setReturnValues: (arg0: object) => void;
  fields: TableField[];
}

export default function OrderByModal({
  open,
  handleCloseModal,
  setReturnValues,
  fields,
}: OrderByModalParams) {
  const [fieldName, setFieldName] = useState<string>();
  const [ordering, setOrdering] = useState<string>();

  return (
    <AbstractModal open={open} handleCloseModal={handleCloseModal}>
      <h1 className="h1 filter-modal__title">
        Добавить сортировку (<code className="code">ORDER BY</code>)
      </h1>
      <form
        action="."
        method="post"
        id="where-form"
        className="form where-form"
      >
        <div className={s["form__row"]}>
          <Label>Агрегат или поле</Label>
          <FieldNameSelector fields={fields} setFieldName={setFieldName} />
        </div>
        <div className={s["form__row"]}>
          <Label>Оператор</Label>
          <OrderingSelector onUpdate={(value) => setOrdering(value[0])} />
        </div>
      </form>
      <div className="filter-modal__buttons">
        <CancelButton handleCloseModal={handleCloseModal} />
        <SubmitButton
          handleCloseModal={handleCloseModal}
          values={{ fieldName, ordering }}
          setReturnValues={setReturnValues}
        />
      </div>
    </AbstractModal>
  );
}
