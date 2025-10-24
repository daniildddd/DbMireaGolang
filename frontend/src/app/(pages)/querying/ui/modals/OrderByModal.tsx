import { Label } from "@gravity-ui/uikit";
import { useState, useContext } from "react";
import CancelButton from "../buttons/CancelButton";
import SubmitButton from "../buttons/SubmitButton";
import FieldNameSelector from "../selectors/FieldNameSelector";
import s from "./style.module.sass";
import OrderingSelector from "../selectors/OrderingSelector";
import AbstractModal from "./AbstractModal";
import FilterContext from "../../context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { FilterType } from "@/app/(pages)/types";

interface OrderByModalParams {
  handleCloseModal: (arg0: boolean) => void;
}

export default function OrderByModal({ handleCloseModal }: OrderByModalParams) {
  const [fieldName, setFieldName] = useState<string>();
  const [ordering, setOrdering] = useState<string>();
  const { filters, setFilters } = useContext(FilterContext);

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
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
          <FieldNameSelector setFieldName={setFieldName} />
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
          onClick={() => {
            const orderByFilter = `${fieldName} ${ordering}`;
            updateFilterValueByType(
              filters,
              setFilters,
              FilterType.orderBy,
              orderByFilter
            );
          }}
        />
      </div>
    </AbstractModal>
  );
}
