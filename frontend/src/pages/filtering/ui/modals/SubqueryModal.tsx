import { useContext, useRef } from "react";
import FieldNameSelector from "./ui/FieldNameSelector";
import AbstractModal from "@/shared/ui/components/AbstractModal/AbstractModal";
import FilterContext from "@/shared/context/FilterContext";
import { useForm } from "react-hook-form";
import { Select } from "@/shared/ui/components/Inputs";
import {
  OperatorOptionSet,
  SubqueryOptionSet,
} from "./lib/predefinedOptionSets";
import { Operator } from "@/types";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import updateFilterValueByType from "./lib/updateFilterValueByType";
import { FilterType } from "@/shared/types/filtering";
import FormRow from "../FormRow/FormRow";
import ModalActionButtons from "./ui/ModalActionButtons/ModalActionButtons";
import Form from "@/shared/ui/components/Form/Form";
import CheckboxInput from "@/shared/ui/components/Inputs/CheckboxInput";

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

function getSubquerySqlExpression(d: FormData): string {
  let query = `${d.subqueryOperator} `;

  if (!d.addWhere) {
    query = `(SELECT ${d.subqueryFieldName} FROM ${d.subqueryTableName})`;
  } else {
    query = `(SELECT ${d.subqueryFieldName} FROM ${d.subqueryTableName} WHERE ${d.whereFieldName} ${d.whereOperator} ${d.whereValue})`;
  }

  if (d.isCorrelated) {
    query += ` AS ${d.alias}`;
  }
  return query;
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

  const onSubmit = (d: FormData) => {
    const filter = getSubquerySqlExpression(d);
    updateFilterValueByType(filters, setFilters, FilterType.subquery, filter);
    handleCloseModal(false);
  };

  return (
    <AbstractModal handleCloseModal={handleCloseModal}>
      <h2 className="h1 filter-modal__title">
        Добавить фильтр (<code className="code">WHERE</code>)
      </h2>
      <Form formId={formId.current} onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="Коррелированный подзапрос (добавить в SELECT)">
          <CheckboxInput
            register={register}
            name="isCorrelated"
            errors={errors}
          />
        </FormRow>
        {watchIsCorellated && (
          <FormRow label="Имя поля (alias)">
            <input type="text" {...register("alias")} />
          </FormRow>
        )}
        {!watchIsCorellated && (
          <>
            <FormRow label="Тип подзапроса">
              <Select name="subqueryType" register={register} errors={errors}>
                <SubqueryOptionSet />
              </Select>
            </FormRow>
            <FormRow label="Поле для сравнения">
              <FieldNameSelector register={register} errors={errors} />
            </FormRow>
            <FormRow label="Оператор">
              <Select register={register} name="operator" errors={errors}>
                <OperatorOptionSet />
              </Select>
            </FormRow>
          </>
        )}
        <FormRow label="Таблица подзапроса">
          <Select register={register} name="subqueryTableName" errors={errors}>
            {tableNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </FormRow>
        <FormRow label="Поле для выборки">
          <Select register={register} name="subqueryFieldName" errors={errors}>
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
        <FormRow label="Добавить условие WHERE">
          <CheckboxInput name="addWhere" register={register} errors={errors} />
        </FormRow>
        {watchAddWhere && (
          <>
            <FormRow label="Поле">
              <Select register={register} name="whereFieldName" errors={errors}>
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
            <FormRow label="Оператор">
              <Select register={register} name="whereOperator" errors={errors}>
                <OperatorOptionSet />
              </Select>
            </FormRow>
            <FormRow label="Значение">
              <input type="text" {...register("whereValue")} />
            </FormRow>
          </>
        )}
        <ModalActionButtons
          handleCloseModal={handleCloseModal}
          formId={formId.current}
        />
      </Form>
    </AbstractModal>
  );
}
