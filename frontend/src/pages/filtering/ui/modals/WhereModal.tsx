import { Label } from "@gravity-ui/uikit";
import { useContext, useRef, useState } from "react";
import FieldNameSelector from "./ui/FieldNameSelector";
import s from "./style.module.sass";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { useForm } from "react-hook-form";
import NumberInput from "@/shared/ui/components/NumberInput/NumberInput";
import CancelButton from "@/shared/ui/components/AbstractModal/buttons/CancelButton";
import Select from "@/shared/ui/components/Select/Select";
import { OperatorOptionSet } from "./ui/predefinedOptionSets";
import { Operator } from "@/types";
import { FilterType } from "@/shared/types/filtering";
import FormRow from "../FormRow/FormRow";
import ModalActionButtons from "./ui/ModalActionButtons";

interface WhereModalParams {
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

export default function WhereModal({
  handleCloseModal,
  step = 1,
  min = -Infinity,
  max = +Infinity,
}: WhereModalParams) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const formId = useRef("where-form");
  const { filters, setFilters } = useContext(FilterContext);

  const onSubmit = (values: FormData) => {
    const whereFilter = `${values.fieldName} ${values.operator} ${values.number}`;

    updateFilterValueByType(filters, setFilters, FilterType.where, whereFilter);

    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h1 className="h1 filter-modal__title">
        Добавить фильтр (<code className="code">WHERE</code>)
      </h1>
      <form
        id={formId.current}
        className="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormRow>
          <Label>Поле</Label>
          <FieldNameSelector register={register} />
        </FormRow>
        <FormRow>
          <Label>Оператор</Label>
          <Select required={true} register={register} name="operator">
            <OperatorOptionSet />
          </Select>
        </FormRow>
        <FormRow>
          <Label>Число</Label>
          <NumberInput
            required={true}
            options={{ min, max, step }}
            register={register}
            name="number"
            errors={errors}
          />
        </FormRow>
        <ModalActionButtons
          handleCloseModal={handleCloseModal}
          formId={formId.current}
        />
      </form>
    </AbstractModal>
  );
}
