import Select from "@/shared/ui/components/Select/Select";
import { Operator } from "@/types";
import { Dispatch, SetStateAction } from "react";

export default function OperatorSelector({
  setOperator,
  required,
}: {
  setOperator: Dispatch<SetStateAction<Operator>>;
  required: boolean;
}) {
  return (
    <Select
      name="operator"
      onChange={(e) => setOperator(e.target.value as Operator)}
      required={required}
    >
      <option value="=">=</option>
      <option value=">">{">"}</option>
      <option value="<">{"<"}</option>
      <option value=">=">≥</option>
      <option value="<=">≤</option>
      <option value="!=">≠</option>
    </Select>
  );
}
