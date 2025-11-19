export function OperatorOptionSet() {
  return (
    <>
      <option value="=">=</option>
      <option value=">">{">"}</option>
      <option value="<">{"<"}</option>
      <option value=">=">≥</option>
      <option value="<=">≤</option>
      <option value="!=">≠</option>
    </>
  );
}

export function OrderingOptionSet() {
  return (
    <>
      <option value="ASC">По возрастанию</option>
      <option value="DESC">По убыванию</option>
    </>
  );
}

export function AggregateOptionSet() {
  return (
    <>
      <option value="SUM">SUM</option>
      <option value="COUNT">COUNT</option>
      <option value="AVG">AVG</option>
      <option value="MAX">MAX</option>
      <option value="MIN">MIN</option>
    </>
  );
}
