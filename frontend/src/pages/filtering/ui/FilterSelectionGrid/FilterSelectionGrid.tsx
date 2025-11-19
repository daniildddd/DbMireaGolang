import { FilterType } from "@/shared/types/filtering";
import FilterRow from "../FilterRow/FIlterRow";
import JoinSectionCard from "../JoinSectionCard/JoinSectionCard";
import s from "./style.module.sass";

export default function FilterSelectionGrid({
  handleOpenModal,
}: {
  handleOpenModal: (modalId?: string) => void;
}) {
  return (
    <div className={s["join-section__grid"]}>
      <JoinSectionCard>
        <FilterRow
          filterType={FilterType.where}
          title="Фильтры (WHERE)"
          buttonText="Добавить фильтр"
          modalId="whereModal"
          onOpenModal={handleOpenModal}
        />
      </JoinSectionCard>
      <JoinSectionCard>
        <FilterRow
          filterType={FilterType.orderBy}
          title="Сортировка"
          buttonText="Добавить сортировку"
          modalId="orderByModal"
          onOpenModal={handleOpenModal}
        />
        <FilterRow
          filterType={FilterType.groupBy}
          title="Группировка (GROUP BY)"
          buttonText="Добавить группировку"
          modalId="groupByModal"
          onOpenModal={handleOpenModal}
        />
      </JoinSectionCard>
      <JoinSectionCard>
        <FilterRow
          filterType={FilterType.aggregate}
          title="Агрегатные функции"
          buttonText="Добавить агрегат"
          modalId="aggregateModal"
          onOpenModal={handleOpenModal}
        />
        <FilterRow
          filterType={FilterType.having}
          title="Фильтр групп (HAVING)"
          buttonText="Добавить HAVING"
          modalId="havingModal"
          onOpenModal={handleOpenModal}
        />
      </JoinSectionCard>
    </div>
  );
}
