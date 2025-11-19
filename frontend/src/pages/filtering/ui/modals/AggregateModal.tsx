import { useContext, useRef } from "react";
import FieldNameSelector from "./ui/FieldNameSelector";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { useForm } from "react-hook-form";
import { AggregateOptionSet } from "./lib/predefinedOptionSets";
import { FilterType } from "@/shared/types/filtering";
import FormRow from "../FormRow/FormRow";
import ModalActionButtons from "./ui/ModalActionButtons";
import { Select } from "@/shared/ui/components/Inputs";
import Form from "@/shared/ui/components/Form/Form";

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
      <h2 className="h1 filter-modal__title">Добавить агрегатную функцию</h2>
      <Form formId={formId.current} onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="Поле">
          <FieldNameSelector register={register} />
        </FormRow>
        <FormRow label="Агрегатная функция">
          <Select
            name="aggregate"
            register={register}
            options={{ required: true }}
          >
            <AggregateOptionSet />
          </Select>
        </FormRow>
        <ModalActionButtons
          handleCloseModal={handleCloseModal}
          formId={formId.current}
        />
      </Form>
    </AbstractModal>
  );
}
