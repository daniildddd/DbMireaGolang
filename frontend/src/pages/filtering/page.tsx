"use client";

import { useEffect, useState } from "react";
import s from "./page.module.sass";
import clsx from "clsx";
import FilterSelectionGrid from "./ui/FilterSelectionGrid/FilterSelectionGrid";
import FilterContext from "../../shared/context/FilterContext";
import GeneratedSQL from "@/features/sqlQueryGenerator/ui/GeneratedSQL/GeneratedSQL";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import { generateSqlQuery } from "@/features/sqlQueryGenerator/lib/generateSqlQuery";
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

export default function FilteringPage() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useGlobalContext();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const query = generateSqlQuery("*", globalContext.currentTable, filters);
  const notifier = useNotifications();

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
        </section>
      </ContentWrapper>
    </FilterContext.Provider>
  );
}
