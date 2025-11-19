import { Label, TextInput } from "@gravity-ui/uikit";
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
}

export default function WhereModal({ handleCloseModal }: WhereModalParams) {
  const [fieldName, setFieldName] = useState<string>("");
  const [operator, setOperator] = useState<Operator>("=");
  const [inputValue, setInputValue] = useState<string>("");
  const { filters, setFilters } = useContext(FilterContext);

  const handleSubmit = () => {
    if (!fieldName || !operator || !inputValue.trim()) {
      alert("Заполните все поля");
      return;
    }

    // Если значение - число, не берем в кавычки, иначе берем
    const value = isNaN(Number(inputValue)) ? `'${inputValue}'` : inputValue;
    const whereFilter = `${fieldName} ${operator} ${value}`;

    updateFilterValueByType(filters, setFilters, FilterType.where, whereFilter);
    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal} onSubmit={handleSubmit}>
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
          <Label>Значение</Label>
          <TextInput
            placeholder="Введите значение для сравнения"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </form>
    </AbstractModal>
  );
}
