import { useContext, useReducer, useRef, useState } from "react";
import FieldNameSelector from "../selectors/FieldNameSelector";
import s from "./style.module.sass";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { FilterType } from "@/pages/filtering/types";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import useFormRef from "@/shared/lib/hooks/useFormRef";
import Form from "@/shared/ui/components/Form/Form";
import { Actions, GroupByModalParams } from "./types/types";
import onSubmitCallback from "./lib/onSubmitCallback";

interface FormState {
  fieldName: string;
}

interface Action {
  type: Actions.SET_FIELD_NAME;
  payload: {
    fieldName?: string;
  };
}

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case Actions.SET_FIELD_NAME:
      return { ...state, fieldName: action.payload.fieldName };
  }
}

export default function GroupByModal({ handleCloseModal }: GroupByModalParams) {
  const initialFormValues: FormState = { fieldName: "" };
  const [formValues, dispatch] = useReducer(reducer, initialFormValues);
  const { filters, setFilters } = useContext(FilterContext);
  const notifier = useNotifications();
  const FORM_ID = useRef("group-by-form");
  const formRef = useFormRef();

  const setFieldName = (fieldName: string) => {
    dispatch({ type: Actions.SET_FIELD_NAME, payload: { fieldName } });
  };

  const onSubmit = (e: React.FormEvent) => {
    onSubmitCallback(e, formRef.current, notifier, () => {
      const groupByFilter = `${formValues.fieldName}`;
      updateFilterValueByType(
        filters,
        setFilters,
        FilterType.groupBy,
        groupByFilter
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
        formId={FORM_ID.current}
        method="post"
        onSubmit={onSubmit}
      >
        <div className={s["form-row"]}>
          <label>Поле</label>
          <FieldNameSelector setFieldName={setFieldName} />
        </div>
      </Form>
    </AbstractModal>
  );
}
