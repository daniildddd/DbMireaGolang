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

interface WhereModalParams {
  handleCloseModal: (arg0: boolean) => void;
  step?: number;
  min?: number;
  max?: number;
}

export default function WhereModal({
  handleCloseModal,
  step = 1,
  min = -Infinity,
  max = +Infinity,
}: WhereModalParams) {
  const [fieldName, setFieldName] = useState<string>();
  const [operator, setOperator] = useState<Operator>();
  const [inputNumber, setInputNumber] = useState<number>(0);
  const { filters, setFilters } = useContext(FilterContext);

  return (
    <AbstractModal
      handleCloseModal={handleCloseModal}
      onSubmit={() => {
        const whereFilter = `${fieldName} ${operator} ${inputNumber}`;
        updateFilterValueByType(
          filters,
          setFilters,
          FilterType.where,
          whereFilter
        );
      }}
    >
      <h1 className="h1 filter-modal__title">
        Добавить фильтр (<code className="code">WHERE</code>)
      </h1>
      <form
        action="."
        method="post"
        id="where-form"
        className="form where-form"
      >
        <div className={s["form__row"]}>
          <Label>Поле</Label>
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
