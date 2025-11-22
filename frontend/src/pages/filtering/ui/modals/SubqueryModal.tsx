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
import useTableSchema, {
  useCurrentTableSchema,
} from "@/shared/lib/hooks/useTableSchema";
import Loading from "@/shared/ui/components/Loading/Loading";
import { main } from "@/shared/lib/wailsjs/go/models";
import notifyAndReturn from "@/shared/lib/utils/notifyAndReturn";
import useNotifications from "@/shared/lib/hooks/useNotifications";

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
  const watchSubqueryTableName = watch("subqueryTableName");
  const watchIsCorellated = watch("isCorrelated");
  const watchAddWhere = watch("addWhere");
  const tableNames = useTableNames();
  const currentTableSchema = useCurrentTableSchema();
  const subqueryTableSchema = useTableSchema(watchSubqueryTableName, [
    watchSubqueryTableName,
  ]);
  const { filters, setFilters } = useContext(FilterContext);
  const notifier = useNotifications();

  const onSubmit = (d: FormData) => {
    const sanitizedAlias = sanitizeSqlInput(d.alias);
    const sanitizedWhereValue = sanitizeSqlInput(d.whereValue);
    let filter = `${d.subqueryOperator} `;

    if (!d.addWhere) {
      filter = `(SELECT ${d.subqueryFieldName} FROM ${d.subqueryTableName})`;
    } else {
      filter = `(SELECT ${d.subqueryFieldName} FROM ${d.subqueryTableName} WHERE ${d.whereFieldName} ${d.whereOperator} ${sanitizedWhereValue})`;
    }

    if (d.isCorrelated) {
      filter += ` AS ${sanitizedAlias}`;
    }
    
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
            <input type="text" {...register("alias", { maxLength: 20 })} maxLength={20} />
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
            {tableNames.isPending ? (
              <Loading />
            ) : tableNames.error ? (
              notifyAndReturn(notifier, tableNames.error)
            ) : (
              tableNames.data.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))
            )}
          </Select>
        </FormRow>
        <FormRow label="Поле для выборки">
          {subqueryTableSchema.isPending ? (
            <Loading />
          ) : subqueryTableSchema.error ? (
            notifyAndReturn(notifier, subqueryTableSchema.error)
          ) : (
            <Select
              register={register}
              name="subqueryFieldName"
              errors={errors}
            >
              {subqueryTableSchema.data.map((field) => (
                <option
                  key={`${field.name}-${field.type}`}
                  value={`${field.name}-${field.type}`}
                >
                  {field.name} ({field.type})
                </option>
              ))}
            </Select>
          )}
        </FormRow>
        <FormRow label="Добавить условие WHERE">
          <CheckboxInput name="addWhere" register={register} errors={errors} />
        </FormRow>
        {watchAddWhere && (
          <>
            <FormRow label="Поле">
              <Select register={register} name="whereFieldName" errors={errors}>
                {currentTableSchema.isPending ? (
                  <Loading />
                ) : currentTableSchema.error ? (
                  notifyAndReturn(notifier, currentTableSchema.error)
                ) : (
                  currentTableSchema.data.map((field: main.FieldSchema) => (
                    <option
                      key={`${field.name}-${field.type}`}
                      value={`${field.name}-${field.type}`}
                    >
                      {field.name} ({field.type})
                    </option>
                  ))
                )}
              </Select>
            </FormRow>
            <FormRow label="Оператор">
              <Select register={register} name="whereOperator" errors={errors}>
                <OperatorOptionSet />
              </Select>
            </FormRow>
            <FormRow label="Значение">
              <input type="text" {...register("whereValue", { maxLength: 20 })} maxLength={20} />
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
