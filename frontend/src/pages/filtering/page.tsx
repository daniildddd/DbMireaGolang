"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import s from "./page.module.sass";
import clsx from "clsx";
import AggregateModal from "./ui/modals/AggregateModal";
import WhereModal from "./ui/modals/WhereModal";
import HavingModal from "./ui/modals/HavingModal";
import GroupByModal from "./ui/modals/GroupByModal";
import OrderByModal from "./ui/modals/OrderByModal";
import FilterSelectionGrid from "./ui/FilterSelectionGrid/FilterSelectionGrid";
import FilterContext from "@/shared/context/FilterContext";
import GeneratedSQL from "@/shared/ui/components/GeneratedSQL/GeneratedSQL";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";
import { generateSqlQuery } from "@/features/sqlQueryGenerator/generateSqlQuery";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import { TableContext } from "@/shared/context/TableContext";
import { Filters, FilterType } from "./types";

export default function FilteringPage() {
  const tableNames = useTableNames();
  const [currentTable, setCurrentTable] = useState("");
  const [filters, setFilters] = useState<Filters>({
    [FilterType.aggregate]: [],
    [FilterType.where]: [],
    [FilterType.having]: [],
    [FilterType.groupBy]: [],
    [FilterType.orderBy]: [],
  });

  const query = useMemo(
    () => generateSqlQuery("*", currentTable, filters),
    [currentTable, [...Object.values(filters)]]
  );
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOpenModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  // Устанавливаем первую таблицу при загрузке
  useEffect(() => {
    if (tableNames.length > 0 && !currentTable) {
      setCurrentTable(tableNames[0]);
    }
  }, [tableNames, currentTable]);

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      <TableContext.Provider value={{ currentTable, setCurrentTable }}>
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
      </TableContext.Provider>
    </FilterContext.Provider>
  );
}
