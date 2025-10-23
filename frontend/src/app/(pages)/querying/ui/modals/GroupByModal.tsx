import { Modal, Label } from "@gravity-ui/uikit";
import { TableField } from "@/types";
import { useState } from "react";
import CancelButton from "../buttons/CancelButton";
import SubmitButton from "../buttons/SubmitButton";
import FieldNameSelector from "../selectors/FieldNameSelector";
import s from "./style.module.sass";
import AbstractModal from "./AbstractModal";

interface GroupByModalParams {
  open: boolean;
  handleCloseModal: (arg0: boolean) => void;
  setReturnValues: (arg0: object) => void;
  fields: TableField[];
}

export default function GroupByModal({
  open,
  handleCloseModal,
  setReturnValues,
  fields,
}: GroupByModalParams) {
  const [fieldName, setFieldName] = useState<string>();

  return (
    <AbstractModal open={open} handleCloseModal={handleCloseModal}>
      <h1 className="h1 filter-modal__title">Добавить агрегатную функцию</h1>
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
      </form>
      <div className="filter-modal__buttons">
        <CancelButton handleCloseModal={handleCloseModal} />
        <SubmitButton
          handleCloseModal={handleCloseModal}
          values={{ fieldName }}
          setReturnValues={setReturnValues}
        />
      </div>
    </AbstractModal>
  );
}
