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
      required={required}
      name="operator"
      multiple={false}
      onChange={(e) => setOperator(e.target.value as Operator)}
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
