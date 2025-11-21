"use client";

import { useCallback, useMemo, useState } from "react";
import s from "./page.module.sass";
import clsx from "clsx";
import FilterSelectionGrid from "./ui/FilterSelectionGrid/FilterSelectionGrid";
import FilterContext from "@/shared/context/FilterContext";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import { generateSqlQuery } from "@/features/sqlQueryGenerator/lib/generateSqlQuery";
import useTableNames from "@/shared/hooks/useTableNames";
import useGlobalContext from "@/shared/hooks/useGlobalContext";
import { EMPTY_FILTERS } from "@/shared/const";
import { Filters } from "@/shared/types/filtering";
import {
  WhereModal,
  OrderByModal,
  SubqueryModal,
  GroupByModal,
  AggregateModal,
  HavingModal,
  RegexModal,
  NullHandlingRuleModal,
  CaseQueryModal,
} from "./ui/modals";
import Loading from "@/shared/ui/components/Loading/Loading";
import notifyAndReturn from "@/shared/lib/utils/notifyAndReturn";
import useNotifications from "@/shared/hooks/useNotifications";
import GeneratedSQL from "@/features/sqlQueryGenerator/ui/GeneratedSQL";
import useApiMiddleware from "@/shared/hooks/useApiMiddleware";
import { TableData } from "@/types";
import { DataTable } from "@/shared/ui/components/Tables";

function noDataWasFound(tableData: TableData) {
  return tableData.rows.length === 0 || tableData.columns.length === 0;
}

export default function FilteringPage() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useGlobalContext();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { apiMiddleware } = useApiMiddleware();
  const notifier = useNotifications();
  const [tableData, setTableData] = useState<TableData>();

  const query = useMemo(
    () => generateSqlQuery("*", globalContext.currentTable, filters),
    [filters, globalContext.currentTable]
  );

  const getTableData = useCallback(async () => {
    try {
      const response = await apiMiddleware.getDataByCustomQuery({
        query: query,
      });

      console.log(query, response);

      if (response.error) {
        throw response.error;
      } else if (noDataWasFound(response)) {
        notifier.notify(
          "По Вашему запросу не найдено данных. Попробуйте изменить фильтры."
        );
      } else {
        setTableData({ ...response });
        notifier.success(
          `Данные успешно найдены, найдено ${response.rows.length} результатов`
        );
      }
    } catch (error) {
      notifier.error(error);
    }
  }, [query]);

  const handleOpenModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  if (tableNames.isPending) return <Loading />;
  if (tableNames.error) return notifyAndReturn(notifier, tableNames.error);
  if (tableNames.data.length === 0) return <div>В базе данных нет таблиц</div>;

  // Устанавливаем первую таблицу при загрузке
  if (!globalContext.currentTable) {
    setGlobalContext({ ...globalContext, currentTable: tableNames.data[0] });
  }

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      <ContentWrapper>
        <section className={clsx("section", s["query-section"])}>
          <FilterSelectionGrid handleOpenModal={handleOpenModal} />

          {/* Рендерим только активную модалку */}
          {activeModal === "whereModal" && (
            <WhereModal handleCloseModal={handleCloseModal} />
          )}
          {activeModal === "regexModal" && (
            <RegexModal handleCloseModal={handleCloseModal} />
          )}
          {activeModal === "nullHandlingRuleModal" && (
            <NullHandlingRuleModal handleCloseModal={handleCloseModal} />
          )}
          {activeModal === "caseQueryModal" && (
            <CaseQueryModal handleCloseModal={handleCloseModal} />
          )}
          {activeModal === "orderByModal" && (
            <OrderByModal handleCloseModal={handleCloseModal} />
          )}
          {activeModal === "subqueryModal" && (
            <SubqueryModal handleCloseModal={handleCloseModal} />
          )}
          {activeModal === "groupByModal" && (
            <GroupByModal handleCloseModal={handleCloseModal} />
          )}
          {activeModal === "aggregateModal" && (
            <AggregateModal handleCloseModal={handleCloseModal} />
          )}
          {activeModal === "havingModal" && (
            <HavingModal handleCloseModal={handleCloseModal} />
          )}
          <GeneratedSQL query={query} />
          <div className={s["generated-sql__actions"]}>
            <button
              className={clsx("button", s["actions__execute-button"])}
              onClick={getTableData}
            >
              Выполнить
            </button>
          </div>
          {tableData &&
            tableData.columns.length > 0 &&
            tableData.rows.length > 0 && <DataTable data={tableData} />}
        </section>
      </ContentWrapper>
    </FilterContext.Provider>
  );
}
