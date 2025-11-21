"use client";

import { useEffect, useState } from "react";
import s from "./page.module.sass";
import clsx from "clsx";
import FilterSelectionGrid from "./ui/FilterSelectionGrid/FilterSelectionGrid";
import FilterContext from "../../shared/context/FilterContext";
import GeneratedSQL from "@/shared/ui/components/GeneratedSQL/GeneratedSQL";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import { generateSqlQuery } from "@/features/sqlQueryGenerator/generateSqlQuery";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";
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
import useNotifications from "@/shared/lib/hooks/useNotifications";
import ApiMiddleware from "@/shared/lib/api/ApiMiddleware";
import QueryResults from "@/shared/ui/components/QueryResults/QueryResults";

export default function FilteringPage() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useGlobalContext();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [queryResults, setQueryResults] = useState<any>(null);
  const query = generateSqlQuery("*", globalContext.currentTable, filters);
  const notifier = useNotifications();

  // Очищаем фильтры при размонтировании компонента (когда пользователь уходит со страницы)
  useEffect(() => {
    return () => {
      setFilters(EMPTY_FILTERS);
      setQueryResults(null);
      setActiveModal(null);
    };
  }, []);

  const handleOpenModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleExecuteQuery = async (sqlQuery: string) => {
    try {
      const result = await ApiMiddleware.executeCustomQuery(sqlQuery);
      setQueryResults(result);
      notifier.success("Запрос выполнен успешно!");
    } catch (error) {
      notifier.error(`Ошибка: ${error}`);
      console.error("Ошибка выполнения запроса:", error);
    }
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
          <GeneratedSQL query={query} onExecute={handleExecuteQuery} />

          {/* Результаты запроса */}
          {queryResults && (
            <div className={clsx("section", s["results-section"])}>
              <h2 className="h2">Результаты запроса</h2>
              <QueryResults
                columns={queryResults.columns}
                rows={queryResults.rows}
                error={queryResults.error}
              />
            </div>
          )}
        </section>
      </ContentWrapper>
    </FilterContext.Provider>
  );
}
