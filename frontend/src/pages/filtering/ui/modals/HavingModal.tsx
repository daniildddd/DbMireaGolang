import { Label } from "@gravity-ui/uikit";
import { useContext, useRef, useState } from "react";
import FieldNameSelector from "./ui/FieldNameSelector";
import s from "./style.module.sass";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { FilterType } from "@/pages/filtering/types";
import { useForm } from "react-hook-form";
import NumberInput from "@/shared/ui/components/NumberInput/NumberInput";
import CancelButton from "@/shared/ui/components/AbstractModal/buttons/CancelButton";
import Select from "@/shared/ui/components/Select/Select";
import { Operator } from "@/types";
import { OperatorOptionSet } from "./ui/predefinedOptionSets";

interface HavingModalParams {
  handleCloseModal: (arg0: boolean) => void;
  step?: number;
  min?: number;
  max?: number;
}

interface FormData {
  fieldName: string;
  operator: Operator;
  number: number;
}

export default function HavingModal({
  handleCloseModal,
  step = 1,
  min = -Infinity,
  max = +Infinity,
}: HavingModalParams) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const formId = useRef("having-form");
  const { filters, setFilters } = useContext(FilterContext);

  const onSubmit = (values: FormData) => {
    const havingFilter = `${values.fieldName} ${values.operator} ${values.number}`;
    updateFilterValueByType(
      filters,
      setFilters,
      FilterType.having,
      havingFilter
    );

    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h1 className="h1 filter-modal__title">
        Добавить фильтр групп (<code className="code">HAVING</code>)
      </h1>
      <form
        id={formId.current}
        className="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={s["form__row"]}>
          <Label>Агрегат или поле</Label>
          <FieldNameSelector register={register} />
        </div>
        <div className={s["form__row"]}>
          <Label>Оператор</Label>
          <Select
            register={register}
            name="operator"
            options={{ required: true }}
          >
            <OperatorOptionSet />
          </Select>
        </div>
        <div className={s["form__row"]}>
          <Label>Число</Label>
          <NumberInput
            required={true}
            name="number"
            options={{ min, max, step }}
            register={register}
            errors={errors}
          />
        </div>
        <div className="filter-modal__buttons">
          <CancelButton handleCloseModal={handleCloseModal} />
          <button
            type="submit"
            form={formId.current}
            className="button important"
          >
            Применить
          </button>
        </div>
      </form>
    </AbstractModal>
  );
}
