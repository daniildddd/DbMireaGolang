import { useContext, useRef } from "react";
import FieldNameSelector from "../../../../shared/ui/components/Inputs/FieldNameSelector";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { useForm } from "react-hook-form";
import { FilterType } from "@/shared/types/filtering";
import FormRow from "../FormRow/FormRow";
import ModalActionButtons from "./ui/ModalActionButtons/ModalActionButtons";
import Form from "@/shared/ui/components/Form/Form";
import useNotifications from "@/shared/hooks/useNotifications";

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
  const notifier = useNotifications();

  const onSubmit = (values: FormData) => {
    const groupByFilter = `${values.fieldName}`;
    const error = updateFilterValueByType(
      filters,
      setFilters,
      FilterType.groupBy,
      groupByFilter
    );

    if (error) {
      notifier.error(error);
      return;
    }

    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h2 className="h2 filter-modal__title">Добавить группировку</h2>
      <Form formId={formId.current} onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="Поле">
          <FieldNameSelector register={register} errors={errors} />
        </FormRow>
        <ModalActionButtons
          handleCloseModal={handleCloseModal}
          formId={formId.current}
        />
      </Form>
    </AbstractModal>
  );
}
