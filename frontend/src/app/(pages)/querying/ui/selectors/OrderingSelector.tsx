import { Select } from "@gravity-ui/uikit";

export default function OrderingSelector({
  onUpdate,
}: {
  onUpdate: (value: string[]) => void;
}) {
  return (
    <Select className="select" multiple={false} onUpdate={onUpdate}>
      <option value="ASC">По возрастанию</option>
      <option value="DESC">По убыванию</option>
    </Select>
  );
}
