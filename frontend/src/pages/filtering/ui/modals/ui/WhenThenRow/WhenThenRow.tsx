import { FieldErrors, UseFormRegister } from "react-hook-form";
import clsx from "clsx";
import s from "./WhenThenRow.module.sass";
import Icons from "@/shared/ui/components/Icons/Icons";
import FieldNameSelector from "../FieldNameSelector";
import { Select } from "@/shared/ui/components/Inputs";
import { OperatorOptionSet } from "../../lib/predefinedOptionSets";
import getNestedInputName from "../../lib/getNestedInputName";
import { WhenThenCondition } from "@/types";
import TextInput from "@/shared/ui/components/Inputs/TextInput";

interface WhenThenRowProps<T> {
  i: number;
  register: UseFormRegister<T>;
  removeCondition: () => void;
  errors: FieldErrors<FormData>;
}

export default function WhenThenRow<T>({
  i,
  register,
  removeCondition,
  errors,
}: WhenThenRowProps<T>) {
  return (
    <div className={clsx(s["form-row"], s["when-then-row"])}>
      <div className={s["condition-fields"]}>
        <FieldNameSelector
          register={register}
          name={getNestedInputName<keyof WhenThenCondition>(
            "conditions",
            i,
            "fieldName"
          )}
          errors={errors}
        />

        <Select
          register={register}
          name={getNestedInputName<keyof WhenThenCondition>(
            "conditions",
            i,
            "operator"
          )}
          errors={errors}
        >
          <OperatorOptionSet />
        </Select>

        <TextInput
          register={register}
          options={{ required: true }}
          name={getNestedInputName<keyof WhenThenCondition>(
            "conditions",
            i,
            "value"
          )}
          errors={errors}
          placeholder="Значение"
        />

        <TextInput
          register={register}
          options={{ required: true }}
          name={getNestedInputName<keyof WhenThenCondition>(
            "conditions",
            i,
            "resultingValue"
          )}
          errors={errors}
          placeholder="Результат"
        />
        <button
          type="button"
          onClick={removeCondition}
          className={clsx("button", s["delete-condition-button"])}
          title="Удалить условие"
        >
          <Icons.Delete />
        </button>
      </div>
    </div>
  );
}
