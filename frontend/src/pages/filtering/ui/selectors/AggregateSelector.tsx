import { Select } from "@gravity-ui/uikit";

export default function AggregateSelector({
  onUpdate,
}: {
  onUpdate: (value: string[]) => void;
}) {
  return (
    <Select className="select" multiple={false} onUpdate={onUpdate}>
      <option value="SUM">SUM</option>
      <option value="COUNT">COUNT</option>
      <option value="AVG">AVG</option>
      <option value="MAX">MAX</option>
      <option value="MIN">MIN</option>
    </Select>
  );
}
