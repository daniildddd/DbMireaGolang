import { useContext, useReducer, useRef, useState } from "react";
import s from "./style.module.sass";
import FilterContext from "@/shared/context/FilterContext";
import { FilterType } from "@/pages/filtering/types";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import useFormRef from "@/shared/lib/hooks/useFormRef";
import Form from "@/shared/ui/components/Form/Form";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import FieldNameSelector from "../selectors/FieldNameSelector";
import onSubmitCallback from "./lib/onSubmitCallback";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { Actions, AggregateModalParams } from "./types/types";
import Select from "@/shared/ui/components/Select/Select";

type Aggregate = "SUM" | "COUNT" | "AVG" | "MIN" | "MAX";

interface FormState {
  fieldName: string;
  aggregate: Aggregate;
}

interface Action {
  type: Actions.SET_AGGREGATE | Actions.SET_FIELD_NAME;
  payload: {
    fieldName?: string;
    aggregate?: Aggregate;
  };
}

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case Actions.SET_FIELD_NAME:
      return { ...state, fieldName: action.payload.fieldName };
    case Actions.SET_AGGREGATE:
      return { ...state, aggregate: action.payload.aggregate };
  }
}

export default function AggregateModal({
  handleCloseModal,
}: AggregateModalParams) {
  const initialFormValues: FormState = { fieldName: "", aggregate: "SUM" };
  const [formValues, dispatch] = useReducer(reducer, initialFormValues);
  const { filters, setFilters } = useContext(FilterContext);
  const formRef = useFormRef();
  const FORM_ID = useRef("aggregate-form");
  const notifier = useNotifications();

  const setFieldName = (fieldName: string) => {
    dispatch({ type: Actions.SET_FIELD_NAME, payload: { fieldName } });
  };

  const setAggregate = (aggregate: Aggregate) => {
    dispatch({ type: Actions.SET_AGGREGATE, payload: { aggregate } });
  };

  const onSubmit = (e: React.FormEvent) => {
    onSubmitCallback(e, formRef.current, notifier, () => {
      const aggregateFilter = `${formValues.aggregate}(${formValues.fieldName})`;
      updateFilterValueByType(
        filters,
        setFilters,
        FilterType.aggregate,
        aggregateFilter
      );
      handleCloseModal(false);
    });
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h1 className="h1 filter-modal-title">Добавить агрегатную функцию</h1>
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
          <label>Агрегатная функция</label>
          <Select
            name="aggregate"
            onChange={(e) => setAggregate(e.target.value as Aggregate)}
            required={true}
          >
            <option value="SUM">SUM</option>
            <option value="COUNT">COUNT</option>
            <option value="AVG">AVG</option>
            <option value="MAX">MAX</option>
            <option value="MIN">MIN</option>
          </Select>
        </div>
      </Form>
    </AbstractModal>
  );
}
