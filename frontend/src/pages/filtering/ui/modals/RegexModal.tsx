import FilterContext from "@/shared/context/FilterContext";
import { FilterType } from "@/shared/types/filtering";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import { useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import FormRow from "../FormRow/FormRow";
import FieldNameSelector from "./ui/FieldNameSelector";
import { Select } from "@/shared/ui/components/Inputs";
import Form from "@/shared/ui/components/Form/Form";
import ModalActionButtons from "./ui/ModalActionButtons/ModalActionButtons";
import { RegexOperatorOptionSet } from "./lib/predefinedOptionSets";

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

type RegexOperator = "SIMILAR TO" | "NOT SIMILAR TO";

interface FormData {
  fieldName: string;
  regexOperator: RegexOperator;
  pattern: string;
}

export default function RegexModal({ handleCloseModal }: ModalParams) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const formId = useRef("regex-form");
  const { filters, setFilters } = useContext(FilterContext);

  const onSubmit = (data: FormData) => {
    const sanitizedPattern = sanitizeSqlInput(data.pattern);
    const filter = `${data.fieldName} ${data.regexOperator} ${sanitizedPattern}`;
    updateFilterValueByType(filters, setFilters, FilterType.regex, filter);

    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <Form onSubmit={handleSubmit(onSubmit)} formId={formId.current}>
        <h2 className="h1 filter-modal__title">
          Фильтр по регулярному выражению
        </h2>
        <FormRow label="Поле">
          <FieldNameSelector register={register} errors={errors} />
        </FormRow>
        <FormRow label="Оператор">
          <Select name="regexOperator" register={register} errors={errors}>
            <RegexOperatorOptionSet />
          </Select>
        </FormRow>
        <FormRow label="Шаблон">
          <input
            type="text"
            name="pattern"
            maxLength={20}
            {...register("pattern", { required: true, maxLength: 20 })}
          />
        </FormRow>
        <p className="small">Примеры шаблонов: %abc%, abc|def, [0-9]+</p>
        <ModalActionButtons
          handleCloseModal={handleCloseModal}
          formId={formId.current}
        />
      </Form>
    </AbstractModal>
  );
}
