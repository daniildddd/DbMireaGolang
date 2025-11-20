import s from "./style.module.sass";
import { useContext } from "react";
import FilterList from "../FilterList/FilterList";
import FilterCard from "../FilterCard/FilterCard";
import FilterContext from "@/shared/context/FilterContext";
import { FilterType } from "@/shared/types/filtering";
import clsx from "clsx";

export default function FilterRow({
  buttonText,
  modalId,
  filterType,
  onOpenModal,
}: {
  buttonText: string;
  modalId: string;
  filterType: FilterType;
  onOpenModal?: (modalId: string) => void;
}) {
  const { filters } = useContext(FilterContext);

  return (
    <div className={s["grid-item__row"]}>
      <button
        className={clsx("button", "text-button", s["grid-item__button"])}
        onClick={() => onOpenModal(modalId)}
      >
        {buttonText}
      </button>
      <FilterList>
        {filters[filterType].map((filter) => (
          <FilterCard filterType={filterType} filter={filter} key={filter} />
        ))}
      </FilterList>
    </div>
  );
}
