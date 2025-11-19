import { Label } from "@gravity-ui/uikit";
import { useContext, useRef } from "react";
import FieldNameSelector from "./ui/FieldNameSelector";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { useForm } from "react-hook-form";
import { Select } from "@/shared/ui/components/Inputs";
import { OrderingOptionSet } from "./lib/predefinedOptionSets";
import { FilterType } from "@/shared/types/filtering";
import FormRow from "../FormRow/FormRow";
import ModalActionButtons from "./ui/ModalActionButtons";
import Form from "@/shared/ui/components/Form/Form";

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

  const onSumbit = (values: FormData) => {
    const orderByFilter = `${values.fieldName} ${values.ordering}`;
    updateFilterValueByType(
      filters,
      setFilters,
      FilterType.orderBy,
      orderByFilter
    );

    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h1 className="h1 filter-modal__title">
        Добавить сортировку (<code className="code">ORDER BY</code>)
      </h1>
      <Form formId={formId.current} onSubmit={handleSubmit(onSumbit)}>
        <FormRow>
          <Label>Агрегат или поле</Label>
          <FieldNameSelector register={register} />
        </FormRow>
        <FormRow>
          <Label>Оператор</Label>
          <Select
            options={{ required: true }}
            name="ordering"
            multiple={false}
            register={register}
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
