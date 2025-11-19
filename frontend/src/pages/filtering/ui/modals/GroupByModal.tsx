import { useContext, useRef, useState } from "react";
import FieldNameSelector from "./ui/FieldNameSelector";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { useForm } from "react-hook-form";
import { FilterType } from "@/shared/types/filtering";
import FormRow from "../FormRow/FormRow";
import ModalActionButtons from "./ui/ModalActionButtons";
import Form from "@/shared/ui/components/Form/Form";

interface GroupByModalParams {
  handleCloseModal: (arg0: boolean) => void;
}

interface FormData {
  fieldName: string;
}

export default function GroupByModal({ handleCloseModal }: GroupByModalParams) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const formId = useRef("group-by-form");
  const { filters, setFilters } = useContext(FilterContext);

  const onSubmit = (values: FormData) => {
    const groupByFilter = `${values.fieldName}`;
    updateFilterValueByType(
      filters,
      setFilters,
      FilterType.groupBy,
      groupByFilter
    );

    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h1 className="h1 filter-modal__title">Добавить агрегатную функцию</h1>
      <Form formId={formId.current} onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="Поле">
          <FieldNameSelector register={register} options={{ required: true }} />
        </FormRow>
        <ModalActionButtons
          handleCloseModal={handleCloseModal}
          formId={formId.current}
        />
      </Form>
    </AbstractModal>
  );
}
