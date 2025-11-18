import Select from "@/shared/ui/components/Select/Select";
import { Dispatch, SetStateAction } from "react";

export default function OrderingSelector({
  setOrdering,
  required,
}: {
  setOrdering: Dispatch<SetStateAction<string>>;
  required: boolean;
}) {
  return (
    <Select
      required={required}
      name="operator"
      multiple={false}
      onChange={(e) => setOrdering(e.target.value)}
    >
      <option value="ASC">По возрастанию</option>
      <option value="DESC">По убыванию</option>
    </Select>
  );
}
