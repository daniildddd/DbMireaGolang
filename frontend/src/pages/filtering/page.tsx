"use client";

import { useEffect, useMemo, useState } from "react";
import s from "./page.module.sass";
import clsx from "clsx";
import WhereModal from "./ui/modals/WhereModal";
import HavingModal from "./ui/modals/HavingModal";
import AggregateModal from "./ui/modals/AggregateModal";
import GroupByModal from "./ui/modals/GroupByModal";
import OrderByModal from "./ui/modals/OrderByModal";
import FilterSelectionGrid from "./ui/FilterSelectionGrid/FilterSelectionGrid";
import FilterContext from "../../shared/context/FilterContext";
import GeneratedSQL from "@/shared/ui/components/GeneratedSQL/GeneratedSQL";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import { generateSqlQuery } from "@/features/sqlQueryGenerator/generateSqlQuery";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import useGlobalContext from "@/shared/lib/hooks/useGlobalContext";
import { EMPTY_FILTERS } from "@/shared/const";
import { Filters } from "@/shared/types/filtering";

export default function FilteringPage() {
  const tableNames = useTableNames();
  const { globalContext, setGlobalContext } = useGlobalContext();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const query = generateSqlQuery("*", globalContext.currentTable, filters);

  const handleOpenModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  // Устанавливаем первую таблицу при загрузке
  useEffect(() => {
    if (tableNames.length > 0 && !globalContext.currentTable) {
      setGlobalContext({ ...globalContext, currentTable: tableNames[0] });
    }
  }, [tableNames, globalContext]);

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      <ContentWrapper>
        <section className={clsx("section", s["query-section"])}>
          <FilterSelectionGrid handleOpenModal={handleOpenModal} />

          {/* Рендерим только активную модалку */}
          {activeModal === "whereModal" && (
            <WhereModal handleCloseModal={handleCloseModal} />
          )}
          {activeModal === "orderByModal" && (
            <OrderByModal handleCloseModal={handleCloseModal} />
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
