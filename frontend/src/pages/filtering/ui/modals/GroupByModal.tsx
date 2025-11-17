import { Label } from "@gravity-ui/uikit";
import { useContext, useState } from "react";
import FieldNameSelector from "../selectors/FieldNameSelector";
import s from "./style.module.sass";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { FilterType } from "@/pages/filtering/types";

interface GroupByModalParams {
  handleCloseModal: (arg0: boolean) => void;
}

export default function GroupByModal({ handleCloseModal }: GroupByModalParams) {
  const [fieldName, setFieldName] = useState<string>();
  const { filters, setFilters } = useContext(FilterContext);

  return (
    <AbstractModal
      handleCloseModal={handleCloseModal}
      onSubmit={() => {
        const groupByFilter = `${fieldName}`;
        updateFilterValueByType(
          filters,
          setFilters,
          FilterType.groupBy,
          groupByFilter
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
      </form>
    </AbstractModal>
  );
}
