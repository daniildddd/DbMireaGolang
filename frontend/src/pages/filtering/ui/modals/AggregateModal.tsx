import { Label } from "@gravity-ui/uikit";
import { useContext, useRef, useState } from "react";
import FieldNameSelector from "./ui/FieldNameSelector";
import s from "./style.module.sass";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { useForm } from "react-hook-form";
import Select from "@/shared/ui/components/Select/Select";
import CancelButton from "@/shared/ui/components/AbstractModal/buttons/CancelButton";
import { AggregateOptionSet } from "./ui/predefinedOptionSets";
import { FilterType } from "@/shared/types/filtering";
import FormRow from "../FormRow/FormRow";

interface AggregateModalParams {
  handleCloseModal: (arg0: boolean) => void;
}

interface FormData {
  fieldName: string;
  aggregate: string;
}

export default function AggregateModal({
  handleCloseModal,
}: AggregateModalParams) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const formId = useRef("aggregate-form");
  const { filters, setFilters } = useContext(FilterContext);

  const onSubmit = (data: FormData) => {
    console.log(data);

    const aggregateFilter = `${data.aggregate}(${data.fieldName})`;
    updateFilterValueByType(
      filters,
      setFilters,
      FilterType.aggregate,
      aggregateFilter
    );

    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h1 className="h1 filter-modal__title">Добавить агрегатную функцию</h1>
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
          <Label>Агрегатная функция</Label>
          <Select
            name="aggregate"
            register={register}
            options={{ required: true }}
          >
            <AggregateOptionSet />
          </Select>
        </FormRow>
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
