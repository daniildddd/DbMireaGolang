import { Label } from "@gravity-ui/uikit";
import { useContext, useState } from "react";
import CancelButton from "../buttons/CancelButton";
import SubmitButton from "../buttons/SubmitButton";
import FieldNameSelector from "../selectors/FieldNameSelector";
import s from "./style.module.sass";
import AggregateSelector from "../selectors/AggregateSelector";
import AbstractModal from "./AbstractModal";
import FilterContext from "../../context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { FilterType } from "@/app/(pages)/types";

interface AggregateModalParams {
  handleCloseModal: (arg0: boolean) => void;
}

export default function AggregateModal({
  handleCloseModal,
}: AggregateModalParams) {
  const [fieldName, setFieldName] = useState<string>();
  const [aggregate, setAggregate] = useState<string>();
  const { filters, setFilters } = useContext(FilterContext);

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h1 className="h1 filter-modal__title">Добавить агрегатную функцию</h1>
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
          <Label>Агрегатная функция</Label>
          <AggregateSelector onUpdate={(value) => setAggregate(value[0])} />
        </div>
      </form>
      <div className="filter-modal__buttons">
        <CancelButton handleCloseModal={handleCloseModal} />
        <SubmitButton
          handleCloseModal={handleCloseModal}
          onClick={() => {
            const aggregateFilter = `${aggregate} (${fieldName})`;
            updateFilterValueByType(
              filters,
              setFilters,
              FilterType.aggregate,
              aggregateFilter
            );
          }}
        />
      </div>
    </AbstractModal>
  );
}
