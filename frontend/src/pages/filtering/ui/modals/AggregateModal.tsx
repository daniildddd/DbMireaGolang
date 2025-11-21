import { useContext, useRef } from "react";
import FieldNameSelector from "../../../../shared/ui/components/Inputs/FieldNameSelector";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { useForm } from "react-hook-form";
import { AggregateOptionSet } from "./lib/predefinedOptionSets";
import { FilterType } from "@/shared/types/filtering";
import FormRow from "../FormRow/FormRow";
import ModalActionButtons from "./ui/ModalActionButtons/ModalActionButtons";
import { Select } from "@/shared/ui/components/Inputs";
import Form from "@/shared/ui/components/Form/Form";
import TextInput from "@/shared/ui/components/Inputs/TextInput";
import useNotifications from "@/shared/hooks/useNotifications";

interface AggregateModalParams {
  handleCloseModal: (arg0: boolean) => void;
}

interface FormData {
  fieldName: string;
  aggregate: string;
  alias?: string;
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
  const notifier = useNotifications();

  const onSubmit = (d: FormData) => {
    console.log(d);

    let aggregateFilter = `${d.aggregate}(${d.fieldName})`;
    if (d.alias) {
      aggregateFilter += ` AS ${d.alias}`;
    }
    const error = updateFilterValueByType(
      filters,
      setFilters,
      FilterType.aggregate,
      aggregateFilter
    );
    if (error) {
      notifier.error(error);
      return;
    }

    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h2 className="h2 filter-modal__title">Добавить агрегатную функцию</h2>
      <Form formId={formId.current} onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="Поле">
          <FieldNameSelector register={register} errors={errors} />
        </FormRow>
        <FormRow label="Агрегатная функция">
          <Select name="aggregate" register={register} errors={errors}>
            <AggregateOptionSet />
          </Select>
        </FormRow>
        <FormRow label="Алиас">
          <TextInput
            name="alias"
            register={register}
            errors={errors}
            options={{ required: false }}
          />
        </FormRow>
        <ModalActionButtons
          handleCloseModal={handleCloseModal}
          formId={formId.current}
        />
      </Form>
    </AbstractModal>
  );
}
