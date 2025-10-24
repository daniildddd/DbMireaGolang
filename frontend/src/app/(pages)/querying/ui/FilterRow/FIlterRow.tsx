import { Button, Text } from "@gravity-ui/uikit";
import s from "./style.module.sass";
import clsx from "clsx";
import { useContext } from "react";
import FilterList from "../FilterList/FilterList";
import FilterCard from "../FilterCard/FilterCard";
import FilterContext from "../../context/FilterContext";
import { FilterType } from "@/app/(pages)/types";

export default function FilterRow({
  title,
  buttonText,
  modalId,
  filterType,
  onOpenModal,
}: {
  title: string;
  buttonText: string;
  modalId: string;
  filterType: FilterType;
  onOpenModal?: (modalId: string) => void;
}) {
  const { filters, setFilters } = useContext(FilterContext);

  return (
    <>
      <div className={s["grid-item__row"]}>
        <Text className={clsx(s["row__title"])} as="h3">
          {title}
        </Text>
        <Button
          className={clsx(s["row__button"], "button")}
          onClick={() => onOpenModal(modalId)}
        >
          + {buttonText}
        </Button>
        <FilterList>
          {filters[filterType].map((filter) => (
            <FilterCard
              filterType={filterType}
              filter={filter}
              key={filter}
              filters={filters}
              setFilters={setFilters}
            />
          ))}
        </FilterList>
      </div>
    </>
  );
}
