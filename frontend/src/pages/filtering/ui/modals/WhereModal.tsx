import { Operator } from "@/types";
import { useContext, useRef, useState } from "react";
import FieldNameSelector from "../selectors/FieldNameSelector";
import OperatorSelector from "../selectors/OperatorSelector";
import s from "./style.module.sass";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { FilterType } from "@/pages/filtering/types";
import useFormRef from "@/shared/lib/hooks/useFormRef";
import Form from "@/shared/ui/components/Form/Form";
import { WhereModalParams } from "./types/types";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import onSubmitCallback from "./lib/onSubmitCallback";

export default function WhereModal({
  handleCloseModal,
  step = 1,
  min = -Infinity,
  max = +Infinity,
}: WhereModalParams) {
  const placeholder = useRef(min <= 0 ? 0 : min);
  const [fieldName, setFieldName] = useState<string>();
  const [operator, setOperator] = useState<Operator>();
  const [inputNumber, setInputNumber] = useState<number>(placeholder.current);
  const { filters, setFilters } = useContext(FilterContext);
  const formRef = useFormRef();
  const notifier = useNotifications();
  const FORM_ID = useRef("where-form");

  const onSubmit = (e: React.FormEvent) => {
    onSubmitCallback(e, formRef.current, notifier, () => {
      const whereFilter = `${fieldName} ${operator} ${inputNumber}`;
      updateFilterValueByType(
        filters,
        setFilters,
        FilterType.where,
        whereFilter
      );
    });
    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h1 className="h1 filter-modal-title">
        Добавить фильтр (<code className="code">WHERE</code>)
      </h1>
      <Form
        handleCloseModal={handleCloseModal}
        ref={formRef}
        method="post"
        formId={FORM_ID.current}
        onSubmit={onSubmit}
      >
        <div className={s["form-row"]}>
          <label>Поле</label>
          <FieldNameSelector setFieldName={setFieldName} />
        </div>
        <div className={s["form-row"]}>
          <label>Оператор</label>
          <OperatorSelector setOperator={setOperator} required={true} />
        </div>
        <div className={s["form-row"]}>
          <label>Число</label>
          <input
            required
            placeholder={placeholder.current.toString()}
            value={inputNumber}
            step={step}
            min={min}
            max={max}
            onChange={(e) => setInputNumber(+e.target.value)}
          />
        </div>
      </Form>
    </AbstractModal>
  );
}
