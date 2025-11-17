import { Select } from "@gravity-ui/uikit";
import { Operator } from "@/types";

export default function OperatorSelector({
  onUpdate,
}: {
  onUpdate: (value: Operator[]) => void;
}) {
  return (
    <Select className="select-operator" multiple={false} onUpdate={onUpdate}>
      <option value="=">=</option>
      <option value=">">{">"}</option>
      <option value="<">{"<"}</option>
      <option value=">=">≥</option>
      <option value="<=">≤</option>
      <option value="!=">≠</option>
    </Select>
  );
}
