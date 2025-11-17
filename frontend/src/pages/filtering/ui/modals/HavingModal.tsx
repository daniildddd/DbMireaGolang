import { Operator } from "@/types";
import { useContext, useReducer, useRef } from "react";
import FieldNameSelector from "../selectors/FieldNameSelector";
import OperatorSelector from "../selectors/OperatorSelector";
import s from "./style.module.sass";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { FilterType } from "@/pages/filtering/types";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import useFormRef from "@/shared/lib/hooks/useFormRef";
import Form from "@/shared/ui/components/Form/Form";
import { Actions, HavingModalParams } from "./types/types";
import onSubmitCallback from "./lib/onSubmitCallback";

interface FormState {
  fieldName: string;
  operator: Operator;
  inputNumber: number;
}

interface Action {
  type:
    | Actions.SET_FIELD_NAME
    | Actions.SET_OPERATOR
    | Actions.SET_INPUT_NUMBER;
  payload: {
    fieldName?: string;
    operator?: Operator;
    inputNumber?: number;
  };
}

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case Actions.SET_FIELD_NAME:
      return { ...state, fieldName: action.payload.fieldName };
    case Actions.SET_OPERATOR:
      return { ...state, operator: action.payload.operator };
    case Actions.SET_INPUT_NUMBER:
      return { ...state, inputNumber: action.payload.inputNumber };
  }
}

export default function HavingModal({
  handleCloseModal,
  step = 1,
  min = -Infinity,
  max = +Infinity,
}: HavingModalParams) {
  const initialFormValues: FormState = {
    fieldName: "",
    operator: "=",
    inputNumber: min == -Infinity ? 0 : min,
  };
  const [formValues, dispatch] = useReducer(reducer, initialFormValues);
  const { filters, setFilters } = useContext(FilterContext);
  const notifier = useNotifications();
  const formRef = useFormRef();
  const FORM_ID = useRef("having-form");

  const setFieldName = (fieldName: string) => {
    dispatch({ type: Actions.SET_FIELD_NAME, payload: { fieldName } });
  };

  const setOperator = (operator: Operator) => {
    dispatch({ type: Actions.SET_OPERATOR, payload: { operator } });
  };

  const setInputNumber = (inputNumber: number) => {
    dispatch({ type: Actions.SET_INPUT_NUMBER, payload: { inputNumber } });
  };

  const onSubmit = (e: React.FormEvent) => {
    onSubmitCallback(e, formRef.current, notifier, () => {
      const havingFilter = `${formValues.fieldName} ${formValues.operator} ${formValues.inputNumber}`;
      updateFilterValueByType(
        filters,
        setFilters,
        FilterType.having,
        havingFilter
      );
      handleCloseModal(false);
    });
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h1 className="h1 filter-modal-title">
        Добавить фильтр групп (<code className="code">HAVING</code>)
      </h1>
      <Form
        handleCloseModal={handleCloseModal}
        ref={formRef}
        formId={FORM_ID.current}
        method="post"
        onSubmit={onSubmit}
      >
        <div className={s["form-row"]}>
          <label>Агрегат или поле</label>
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
            type="number"
            placeholder="0"
            value={formValues.inputNumber}
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
