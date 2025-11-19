import { UseFormRegister } from "react-hook-form";
import clsx from "clsx";
import s from "./style.module.sass";
import Icons from "@/shared/ui/components/Icons/Icons";
import FieldNameSelector from "./FieldNameSelector";
import { Select } from "@/shared/ui/components/Inputs";
import { OperatorOptionSet } from "../lib/predefinedOptionSets";
import getNestedInputName from "../lib/getNestedInputName";
import { WhenThenCondition } from "@/types";

interface WhenThenRowProps {
  i: number;
  register: UseFormRegister<any>;
  removeCondition: () => void;
  errors?: Record<string, any>;
}

export default function WhenThenRow({
  i,
  register,
  removeCondition,
  errors,
}: WhenThenRowProps) {
  return (
    <div className={clsx(s["form-row"], s["when-then-row"])}>
      <div className={s["condition-fields"]}>
        <FieldNameSelector
          register={register}
          options={{
            required: "Выберите поле",
          }}
          name={getNestedInputName<keyof WhenThenCondition>(
            "conditions",
            i,
            "fieldName"
          )}
        />

        {errors?.fieldName && (
          <span className="error-message">{errors.fieldName.message}</span>
        )}

        <Select
          register={register}
          options={{
            required: true,
          }}
          name={getNestedInputName<keyof WhenThenCondition>(
            "conditions",
            i,
            "operator"
          )}
        >
          <OperatorOptionSet />
        </Select>

        {errors?.operator && (
          <span className="error-message">Выберите оператор</span>
        )}

        <input
          type="text"
          {...register(
            getNestedInputName<keyof WhenThenCondition>(
              "conditions",
              i,
              "value"
            ),
            {
              required: "Укажите значение",
            }
          )}
          placeholder="Значение"
          className={clsx("input", { error: errors?.value })}
        />

        {errors?.value && (
          <span className="error-message">{errors.value.message}</span>
        )}

        <input
          type="text"
          {...register(
            getNestedInputName<keyof WhenThenCondition>(
              "conditions",
              i,
              "resultingValue"
            ),
            {
              required: "Укажите результат",
            }
          )}
          placeholder="Результат"
          className={errors?.resultingValue ? "input error" : "input"}
        />

        {errors?.resultingValue && (
          <span className="error-message">{errors.resultingValue.message}</span>
        )}
      </div>

      <button
        type="button"
        onClick={removeCondition}
        className={clsx("button", s["delete-condition-button"])}
        title="Удалить условие"
      >
        <Icons.Delete />
      </button>
    </div>
  );
}
