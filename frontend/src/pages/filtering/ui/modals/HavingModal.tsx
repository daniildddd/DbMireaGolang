import { Label, NumberInput } from "@gravity-ui/uikit";
import { Operator } from "@/types";
import { useContext, useState } from "react";
import FieldNameSelector from "../selectors/FieldNameSelector";
import OperatorSelector from "../selectors/OperatorSelector";
import s from "./style.module.sass";
import AbstractModal from "./AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { FilterType } from "@/pages/filtering/types";

interface HavingModalParams {
  handleCloseModal: (arg0: boolean) => void;
  step?: number;
  min?: number;
  max?: number;
}

export default function HavingModal({
  handleCloseModal,
  step = 1,
  min = -Infinity,
  max = +Infinity,
}: HavingModalParams) {
  const [fieldName, setFieldName] = useState<string>();
  const [operator, setOperator] = useState<Operator>();
  const [inputNumber, setInputNumber] = useState<number>();
  const { filters, setFilters } = useContext(FilterContext);

  return (
    <AbstractModal
      handleCloseModal={handleCloseModal}
      onSubmit={() => {
        const havingFilter = `${fieldName} ${operator} ${inputNumber}`;
        updateFilterValueByType(
          filters,
          setFilters,
          FilterType.having,
          havingFilter
        );
      }}
    >
      <h1 className="h1 filter-modal__title">
        Добавить фильтр групп (<code className="code">HAVING</code>)
      </h1>
      <form
        action="."
        method="post"
        id="where-form"
        className="form where-form"
      >
        <div className={s["form__row"]}>
          <Label>Агрегат или поле</Label>
          <FieldNameSelector setFieldName={setFieldName} />
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
    </AbstractModal>
  );
}
