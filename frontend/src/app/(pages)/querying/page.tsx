// Page.tsx
"use client";

import { useState } from "react";
import TableSelectorSidebar from "@shared/ui/components/TableSelectorSidebar/TableSelectorSidebar";
import useTableNames from "@shared/lib/hooks/useTableNames";
import s from "./page.module.sass";
import clsx from "clsx";
import WhereModal from "./ui/modals/WhereModal";
import HavingModal from "./ui/modals/HavingModal";
import AggregateModal from "./ui/modals/AggregateModal";
import GroupByModal from "./ui/modals/GroupByModal";
import OrderByModal from "./ui/modals/OrderByModal";
import FilterSelectionGrid from "./ui/FilterSelectionGrid/FilterSelectionGrid";
import GeneratedSQL from "./ui/GeneratedSQL/GeneratedSQL";

const mockFields = [{ name: "test", type: "UInt32" }];

export default function Page() {
  const tableNames = useTableNames();
  const [currentTable, setCurrentTable] = useState<string>(tableNames[0]);
  const [returnValues, setReturnValues] = useState<object>({});
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOpenModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <TableSelectorSidebar
        tableNames={tableNames}
        setCurrentTable={setCurrentTable}
      />
      <section className={clsx("section", s["join-section"])}>
        <FilterSelectionGrid handleOpenModal={handleOpenModal} />

        {/* Рендерим только активную модалку */}
        {activeModal === "whereModal" && (
          <WhereModal
            open={true}
            handleCloseModal={handleCloseModal} // передаём функцию закрытия
            setReturnValues={(newValues) => {
              setReturnValues({ ...returnValues, ...newValues });
            }}
            fields={mockFields}
          />
        )}
        {activeModal === "orderByModal" && (
          <OrderByModal
            open={true}
            handleCloseModal={handleCloseModal}
            setReturnValues={(newValues) => {
              setReturnValues({ ...returnValues, ...newValues });
            }}
            fields={mockFields}
          />
        )}
        {activeModal === "groupByModal" && (
          <GroupByModal
            open={true}
            handleCloseModal={handleCloseModal}
            setReturnValues={(newValues) => {
              setReturnValues({ ...returnValues, ...newValues });
            }}
            fields={mockFields}
          />
        )}
        {activeModal === "aggregateModal" && (
          <AggregateModal
            open={true}
            handleCloseModal={handleCloseModal}
            setReturnValues={(newValues) => {
              setReturnValues({ ...returnValues, ...newValues });
            }}
            fields={mockFields}
          />
        )}
        {activeModal === "havingModal" && (
          <HavingModal
            open={true}
            handleCloseModal={handleCloseModal}
            setReturnValues={(newValues) => {
              setReturnValues({ ...returnValues, ...newValues });
            }}
            fields={mockFields}
          />
        )}
        <GeneratedSQL currentTable={currentTable} />
      </section>
    </>
  );
}
