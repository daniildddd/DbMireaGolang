import { Label } from "@gravity-ui/uikit";
import { useContext, useRef } from "react";
import FieldNameSelector from "./ui/FieldNameSelector";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import { useForm } from "react-hook-form";
import Select from "@/shared/ui/components/Inputs/Select/Select";
import {
  OperatorOptionSet,
  SubqueryOptionSet,
} from "./ui/predefinedOptionSets";
import { Operator } from "@/types";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { FilterType } from "@/shared/types/filtering";
import FormRow from "../FormRow/FormRow";
import ModalActionButtons from "./ui/ModalActionButtons";

interface SubqueryModalParams {
  handleCloseModal: (arg0: boolean) => void;
}

type SubqueryType = "IN" | "NOT IN" | "EXISTS" | "NOT EXISTS" | "ANY" | "ALL";

interface FormData {
  isCorrelated: boolean;
  alias: string;
  subqueryType: SubqueryType;
  subqueryTableName: string;
  subqueryFieldName: string;
  subqueryOperator: Operator;
  addWhere: boolean;
  whereFieldName: string;
  whereOperator: Operator;
  whereValue: string;
}

export default function SubqueryModal({
  handleCloseModal,
}: SubqueryModalParams) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const formId = useRef("subquery-form");
  const tableNames = useTableNames();
  const watchSubqueryTableName = watch("subqueryTableName");
  const watchIsCorellated = watch("isCorrelated");
  const watchAddWhere = watch("addWhere");
  const { filters, setFilters } = useContext(FilterContext);

  const onSubmit = (values: FormData) => {
    console.log(values);
    const filter = "";
    updateFilterValueByType(filters, setFilters, FilterType.subquery, filter);
    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h1 className="h1 filter-modal__title">
        Добавить фильтр (<code className="code">WHERE</code>)
      </h1>
      <form
        id={formId.current}
        className="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormRow>
          <Label>
            Коррелированный подзапрос (добавить в <code>SELECT</code>)
          </Label>
          <input
            type="checkbox"
            {...register("isCorrelated", { required: false })}
          />
        </FormRow>
        {watchIsCorellated && (
          <FormRow>
            <Label>
              Имя поля (<code>alias</code>)
            </Label>
            <input type="text" {...register("alias")} />
          </FormRow>
        )}
        {!watchIsCorellated && (
          <>
            <FormRow>
              <Label>Тип подзапроса</Label>
              <Select name="subqueryType" register={register}>
                <SubqueryOptionSet />
              </Select>
            </FormRow>
            <FormRow>
              <Label>Поле для сравнения</Label>
              <FieldNameSelector register={register} />
            </FormRow>
            <FormRow>
              <Label>Оператор</Label>
              <Select register={register} name="operator">
                <OperatorOptionSet />
              </Select>
            </FormRow>
          </>
        )}
        <FormRow>
          <Label>Таблица подзапроса</Label>
          <Select register={register} name="subqueryTableName">
            {tableNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </FormRow>
        <FormRow>
          <Label>Поле для выборки</Label>
          <Select register={register} name="subqueryFieldName">
            {/*            
            {useTableSchema(watchSubqueryTableName).map((field) => (
              <option
                key={`${field.name}-${field.type}`}
                value={`${field.name}-${field.type}`}
              >
                {field.name} ({field.type})
              </option>
            ))} */}
          </Select>
        </FormRow>
        <FormRow>
          <Label>
            Добавить условие <code>WHERE</code>
          </Label>
          <input
            type="checkbox"
            {...register("addWhere", { required: false })}
          />
        </FormRow>
        {watchAddWhere && (
          <>
            <FormRow>
              <Label>Поле</Label>
              <Select register={register} name="whereFieldName">
                {/*             
            {useTableSchema().map((field) => (
                <option
                  key={`${field.name}-${field.type}`}
                  value={`${field.name}-${field.type}`}
                >
                  {field.name} ({field.type})
                </option>
              ))} */}
              </Select>
            </FormRow>
            <FormRow>
              <Label>Оператор</Label>
              <Select register={register} name="whereOperator">
                <OperatorOptionSet />
              </Select>
            </FormRow>
            <FormRow>
              <Label>Значение</Label>
              <input type="text" {...register("whereValue")} />
            </FormRow>
          </>
        )}
        <ModalActionButtons
          handleCloseModal={handleCloseModal}
          formId={formId.current}
        />
      </form>
    </AbstractModal>
  );
}
