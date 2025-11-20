import { useContext, useRef } from "react";
import FieldNameSelector from "./ui/FieldNameSelector";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { useForm } from "react-hook-form";
import { Select, NumberInput } from "@/shared/ui/components/Inputs";
import { Operator } from "@/types";
import { OperatorOptionSet } from "./lib/predefinedOptionSets";
import { FilterType } from "@/shared/types/filtering";
import FormRow from "../FormRow/FormRow";
import ModalActionButtons from "./ui/ModalActionButtons/ModalActionButtons";
import Form from "@/shared/ui/components/Form/Form";

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
      <h2 className="h1 filter-modal__title">
        Добавить фильтр групп (<code className="code">HAVING</code>)
      </h2>
      <Form formId={formId.current} onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="Аргегат или поле">
          <FieldNameSelector register={register} errors={errors} />
        </FormRow>
        <FormRow label="Оператор">
          <Select register={register} name="operator" errors={errors}>
            <OperatorOptionSet />
          </Select>
        </FormRow>
        <FormRow label="Число">
          <NumberInput
            name="number"
            options={{ min, max, step, required: true }}
            register={register}
            errors={errors}
            min={min}
            max={max}
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
