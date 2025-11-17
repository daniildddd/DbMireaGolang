import { useState, useContext, useRef } from "react";
import FieldNameSelector from "../selectors/FieldNameSelector";
import s from "./style.module.sass";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { FilterType } from "@/pages/filtering/types";
import useFormRef from "@/shared/lib/hooks/useFormRef";
import Form from "@/shared/ui/components/Form/Form";
import { OrderByModalParams } from "./types/types";
import useNotifications from "@/shared/lib/hooks/useNotifications";
import onSubmitCallback from "./lib/onSubmitCallback";
import Select from "@/shared/ui/components/Select/Select";

export default function OrderByModal({ handleCloseModal }: OrderByModalParams) {
  const [fieldName, setFieldName] = useState<string>();
  const [ordering, setOrdering] = useState<string>();
  const { filters, setFilters } = useContext(FilterContext);
  const FORM_ID = useRef("order-by-form");
  const formRef = useFormRef();
  const notifier = useNotifications();

  const onSubmit = (e: React.FormEvent) => {
    onSubmitCallback(e, formRef.current, notifier, () => {
      const orderByFilter = `${fieldName} ${ordering}`;
      updateFilterValueByType(
        filters,
        setFilters,
        FilterType.orderBy,
        orderByFilter
      );
      handleCloseModal(false);
    });
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h1 className="h1 filter-modal-title">
        Добавить сортировку (<code className="code">ORDER BY</code>)
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
          <Select
            name="order"
            onChange={(e) => setOrdering(e.target.value)}
            required={true}
          >
            <option value="ASC">По возрастанию</option>
            <option value="DESC">По убыванию</option>
          </Select>
        </div>
      </Form>
    </AbstractModal>
  );
}
