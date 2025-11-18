import { Label } from "@gravity-ui/uikit";
import { useContext, useState } from "react";
import FieldNameSelector from "../selectors/FieldNameSelector";
import s from "./style.module.sass";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { FilterType } from "@/pages/filtering/types";

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
    <AbstractModal
      handleCloseModal={handleCloseModal}
      onSubmit={() => {
        const aggregateFilter = `${aggregate}(${fieldName})`;
        updateFilterValueByType(
          filters,
          setFilters,
          FilterType.aggregate,
          aggregateFilter
        );
      }}
    >
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
          <select
            className="select"
            multiple={false}
            required={true}
            aria-required={true}
            onChange={(e) => setAggregate(e.target.value)}
          >
            <option value="SUM">SUM</option>
            <option value="COUNT">COUNT</option>
            <option value="AVG">AVG</option>
            <option value="MAX">MAX</option>
            <option value="MIN">MIN</option>
          </select>
        </div>
      </form>
    </AbstractModal>
  );
}
