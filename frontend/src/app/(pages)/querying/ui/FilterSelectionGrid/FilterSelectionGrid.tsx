import CardRow from "../CardRow/CardRow";
import JoinSectionCard from "../JoinSectionCard/JoinSectionCard";
import s from "./style.module.sass";

export default function FilterSelectionGrid({
  handleOpenModal,
}: {
  handleOpenModal: (arg0?: any) => void;
}) {
  return (
    <div className={s["join-section__grid"]}>
      <JoinSectionCard>
        <CardRow
          title="Фильтры (WHERE)"
          buttonText="Добавить фильтр"
          modalId="whereModal"
          onOpenModal={handleOpenModal}
        />
      </JoinSectionCard>
      <JoinSectionCard>
        <CardRow
          title="Сортировка"
          buttonText="Добавить сортировку"
          modalId="orderByModal"
          onOpenModal={handleOpenModal}
        />
        <CardRow
          title="Группировка (GROUP BY)"
          buttonText="Добавить группировку"
          modalId="groupByModal"
          onOpenModal={handleOpenModal}
        />
      </JoinSectionCard>
      <JoinSectionCard>
        <CardRow
          title="Агрегатные функции"
          buttonText="Добавить агрегат"
          modalId="aggregateModal"
          onOpenModal={handleOpenModal}
        />
        <CardRow
          title="Фильтр групп (HAVING)"
          buttonText="Добавить HAVING"
          modalId="havingModal"
          onOpenModal={handleOpenModal}
        />
      </JoinSectionCard>
    </div>
  );
}
