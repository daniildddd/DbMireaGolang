import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import Form from "@/shared/ui/components/Form/Form";
import FormRow from "../FormRow/FormRow";
import FieldNameSelector from "./ui/FieldNameSelector";
import ModalActionButtons from "./ui/ModalActionButtons/ModalActionButtons";
import FilterContext from "@/shared/context/FilterContext";
import { FilterType } from "@/shared/types/filtering";
import { Select } from "@/shared/ui/components/Inputs";
import { useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { NullFunctionOptionSet } from "./lib/predefinedOptionSets";

/**
 * Sanitizes text input to prevent SQL injection
 */
function sanitizeSqlInput(text: string): string {
  if (typeof text !== "string") return "";
  return text
    .replace(/'/g, "''")
    .replace(/"/g, "\\\"")
    .replace(/;/g, "")
    .replace(/--/g, "")
    .replace(/\/\*/g, "")
    .replace(/\*\//g, "");
}

interface ModalParams {
  handleCloseModal: (arg0: boolean) => void;
}

type NullFunction = "COALESCE" | "NULLIF";

interface FormData {
  nullFunction: NullFunction;
  fieldName: string;
  defaultValue: string;
  resultAlias: string;
}

export default function NullHandlingRuleModal({
  handleCloseModal,
}: ModalParams) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const formId = useRef("null-handling-rule-form");
  const { filters, setFilters } = useContext(FilterContext);

  const onSumbit = (d: FormData) => {
    const sanitizedDefaultValue = sanitizeSqlInput(d.defaultValue);
    const sanitizedResultAlias = sanitizeSqlInput(d.resultAlias);
    const filter = `${d.nullFunction}(${d.fieldName}, ${sanitizedDefaultValue}) AS ${sanitizedResultAlias}`;
    updateFilterValueByType(
      filters,
      setFilters,
      FilterType.nullHandlingRule,
      filter
    );

    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <Form onSubmit={handleSubmit(onSumbit)} formId={formId.current}>
        <h2 className="h1 filter-modal__title">
          Обработка <code>NULL</code>
        </h2>
        <FormRow label="Функция">
          <Select name="nullFunction" register={register} errors={errors}>
            <NullFunctionOptionSet />
          </Select>
        </FormRow>
        <FormRow label="Поле">
          <FieldNameSelector register={register} errors={errors} />
        </FormRow>
        <FormRow label="Значение по умолчанию">
          <input
            type="text"
            name="pattern"
            maxLength={20}
            {...register("defaultValue", { required: true, maxLength: 20 })}
          />
        </FormRow>
        <FormRow label="Псевдоним результата">
          <input
            type="text"
            name="pattern"
            maxLength={20}
            {...register("resultAlias", { required: true, maxLength: 20 })}
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
