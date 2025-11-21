import { useContext, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import FilterContext from "@/shared/context/FilterContext";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FormRow from "../FormRow/FormRow";
import Form from "@/shared/ui/components/Form/Form";
import ModalActionButtons from "./ui/ModalActionButtons/ModalActionButtons";
import { WhenThenCondition } from "@/types";
import WhenThenRow from "./ui/WhenThenRow/WhenThenRow";
import { FilterType } from "@/shared/types/filtering";
import s from "./style.module.sass";
import TextInput from "@/shared/ui/components/Inputs/TextInput";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import useNotifications from "@/shared/lib/hooks/useNotifications";

interface ModalParams {
  handleCloseModal: (arg0: boolean) => void;
}

interface FormData {
  resultingFieldName: string;
  conditions: WhenThenCondition[];
  elseValue: string;
}

export default function CaseQueryModal({ handleCloseModal }: ModalParams) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      resultingFieldName: "",
      conditions: [],
      elseValue: "NULL",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "conditions",
  });

  const formId = useRef("case-query-form");
  const { filters, setFilters } = useContext(FilterContext);
  const notifier = useNotifications();

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);

    // Здесь можно обработать данные и добавить фильтр
    const caseExpression = `CASE ${data.conditions
      .map(
        (cond) =>
          `WHEN ${cond.fieldName} ${cond.operator} ${cond.value} THEN ${cond.resultingValue}`
      )
      .join(" ")} ELSE ${data.elseValue} END AS ${data.resultingFieldName}`;

    // Пример обновления фильтров
    const error = updateFilterValueByType(
      filters,
      setFilters,
      FilterType.caseQuery,
      caseExpression
    );

    if (error) {
      notifier.error(error);
      return;
    }

    handleCloseModal(false);
    reset();
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <Form onSubmit={handleSubmit(onSubmit)} formId={formId.current}>
        <h2 className="h2 filter-modal__title">
          Добавить <code>CASE</code> выражение
        </h2>

        <FormRow label="Имя результирующего поля">
          <TextInput
            register={register}
            options={{
              required: true,
            }}
            className={errors.resultingFieldName ? "input error" : "input"}
            errors={errors}
            name={"resultingFieldName"}
          />
        </FormRow>

        <div className={s["when-then-condition-set"]}>
          <h3 className="h3">Условия</h3>

          <div className={s.conditions}>
            {fields.map((field, index) => (
              <WhenThenRow
                key={field.id}
                i={index}
                register={register}
                removeCondition={() => remove(index)}
                errors={errors}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              append({
                fieldName: "",
                operator: "=",
                value: "",
                resultingValue: "",
              })
            }
            className="button add-condition"
          >
            + Добавить условие <code>WHEN-THEN</code>
          </button>
        </div>

        <FormRow label="ELSE (значение поля по умолчанию)">
          <TextInput
            name="elseValue"
            placeholder="NULL"
            className={errors.elseValue ? "input error" : "input"}
            register={register}
            options={{
              required: true,
            }}
            errors={errors}
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
