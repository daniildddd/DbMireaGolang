import { FilterType } from "@/shared/types/filtering";
import FilterRow from "../FilterRow/FIlterRow";
import FilterSectionCard from "../FilterSectionCard/FilterSectionCard";
import s from "./style.module.sass";

export default function FilterSelectionGrid({
  handleOpenModal,
}: {
  handleOpenModal: (modalId?: string) => void;
}) {
  return (
    <div className={s["filter-selection__grid"]}>
      <FilterSectionCard title="Фильтры (WHERE)">
        <FilterRow
          filterType={FilterType.where}
          buttonText="Добавить фильтр"
          modalId="whereModal"
          onOpenModal={handleOpenModal}
        />
        <FilterRow
          filterType={FilterType.subquery}
          buttonText="Добавить подзапрос"
          modalId="subqueryModal"
          onOpenModal={handleOpenModal}
        />
        <FilterRow
          filterType={FilterType.regex}
          buttonText="Регулярное выражение"
          modalId="regexModal"
          onOpenModal={handleOpenModal}
        />
      </FilterSectionCard>
      <FilterSectionCard title="Сортировка">
        <FilterRow
          filterType={FilterType.orderBy}
          buttonText="Добавить сортировку"
          modalId="orderByModal"
          onOpenModal={handleOpenModal}
        />
      </FilterSectionCard>
      <FilterSectionCard title="Группировка (GROUP BY)">
        <FilterRow
          filterType={FilterType.groupBy}
          buttonText="Добавить группировку"
          modalId="groupByModal"
          onOpenModal={handleOpenModal}
        />
      </FilterSectionCard>
      <FilterSectionCard title="Агрегатные функции">
        <FilterRow
          filterType={FilterType.aggregate}
          buttonText="Добавить агрегат"
          modalId="aggregateModal"
          onOpenModal={handleOpenModal}
        />
      </FilterSectionCard>
      <FilterSectionCard title="Фильтр групп (HAVING)">
        <FilterRow
          filterType={FilterType.having}
          buttonText="Добавить HAVING"
          modalId="havingModal"
          onOpenModal={handleOpenModal}
        />
      </FilterSectionCard>
      <FilterSectionCard title="Вычисляемые поля">
        <FilterRow
          filterType={FilterType.caseQuery}
          buttonText="CASE выражение"
          modalId="caseQueryModal"
          onOpenModal={handleOpenModal}
        />
        <FilterRow
          filterType={FilterType.nullHandlingRule}
          buttonText="Обработка NULL"
          modalId="nullHandlingRuleModal"
          onOpenModal={handleOpenModal}
        />
      </FilterSectionCard>
    </div>
  );
}
