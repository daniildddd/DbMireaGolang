import s from "./style.module.sass";
import clsx from "clsx";
import { useContext } from "react";
import FilterList from "../FilterList/FilterList";
import FilterCard from "../FilterCard/FilterCard";
import FilterContext from "@/shared/context/FilterContext";
import { FilterType } from "@/shared/types/filtering";

export default function FilterRow({
  title,
  buttonText,
  modalId,
  filterType,
  onOpenModal,
}: {
  title?: string;
  buttonText: string;
  modalId: string;
  filterType: FilterType;
  onOpenModal?: (modalId: string) => void;
}) {
  const { filters } = useContext(FilterContext);

  return (
    <div className={s["grid-item__row"]}>
      {title && <h3 className={clsx(s["row__title"])}>{title}</h3>}
      <button
        className={clsx("button", s["row__button"])}
        onClick={() => onOpenModal(modalId)}
      >
        + {buttonText}
      </button>
      <FilterList>
        {filters[filterType].map((filter) => (
          <FilterCard filterType={filterType} filter={filter} key={filter} />
        ))}
      </FilterList>
    </div>
  );
}
