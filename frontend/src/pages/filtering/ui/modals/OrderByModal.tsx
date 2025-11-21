import { useContext, useRef } from "react";
import FieldNameSelector from "../../../../shared/ui/components/Inputs/FieldNameSelector";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { useForm } from "react-hook-form";
import { Select } from "@/shared/ui/components/Inputs";
import { OrderingOptionSet } from "./lib/predefinedOptionSets";
import { FilterType } from "@/shared/types/filtering";
import FormRow from "../FormRow/FormRow";
import ModalActionButtons from "./ui/ModalActionButtons/ModalActionButtons";
import Form from "@/shared/ui/components/Form/Form";
import useNotifications from "@/shared/hooks/useNotifications";

interface OrderByModalParams {
  handleCloseModal: (arg0: boolean) => void;
}

interface FormData {
  fieldName: string;
  ordering: string;
}

export default function OrderByModal({ handleCloseModal }: OrderByModalParams) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const formId = useRef("order-by-form");
  const { filters, setFilters } = useContext(FilterContext);
  const notifier = useNotifications();

  const onSumbit = (values: FormData) => {
    const orderByFilter = `${values.fieldName} ${values.ordering}`;
    const error = updateFilterValueByType(
      filters,
      setFilters,
      FilterType.orderBy,
      orderByFilter
    );

    if (error) {
      notifier.error(error);
      return;
    }

    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h2 className="h2 filter-modal__title">
        Добавить сортировку (<code className="code">ORDER BY</code>)
      </h2>
      <Form formId={formId.current} onSubmit={handleSubmit(onSumbit)}>
        <FormRow label="Агрегат или поле">
          <FieldNameSelector register={register} errors={errors} />
        </FormRow>
        <FormRow label="Оператор">
          <Select
            name="ordering"
            multiple={false}
            register={register}
            errors={errors}
          >
            <OrderingOptionSet />
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
