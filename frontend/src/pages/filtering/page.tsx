"use client";

import { useContext, useState } from "react";
import AsideTableSelector from "@/shared/ui/components/AsideTableSelector/AsideTableSelector";
import useTableNames from "@/shared/lib/hooks/useTableNames";
import s from "./page.module.sass";
import clsx from "clsx";
import WhereModal from "./ui/modals/WhereModal";
import HavingModal from "./ui/modals/HavingModal";
import AggregateModal from "./ui/modals/AggregateModal";
import GroupByModal from "./ui/modals/GroupByModal";
import OrderByModal from "./ui/modals/OrderByModal";
import FilterSelectionGrid from "./ui/FilterSelectionGrid/FilterSelectionGrid";
import FilterContext from "../../shared/context/FilterContext";
import { CurrentTableContext } from "../../shared/context/CurrentTableContext";
import GeneratedSQL from "@/shared/ui/components/GeneratedSQL/GeneratedSQL";
import Header from "@/shared/ui/components/Header/Header";
import Main from "@/shared/ui/components/Main/Main";
import ContentWrapper from "@/shared/ui/components/ContentWrapper/ContentWrapper";

export default function FilteringPage() {
  const tableNames: string[] = useTableNames();
  const [currentTable, setCurrentTable] = useState<string>(tableNames[0]);
  const { filters, setFilters } = useContext(FilterContext);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOpenModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      <CurrentTableContext.Provider value={currentTable}>
        <ContentWrapper>
          <Header />
          <AsideTableSelector setCurrentTable={setCurrentTable} />
          <Main>
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
              <GeneratedSQL currentTable={currentTable} />
            </section>
          </Main>
        </ContentWrapper>
      </CurrentTableContext.Provider>
    </FilterContext.Provider>
  );
}
