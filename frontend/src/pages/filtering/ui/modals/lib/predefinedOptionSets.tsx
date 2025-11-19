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

export function SubqueryOptionSet() {
  return (
    <>
      <option value="IN">IN</option>
      <option value="NOT IN">NOT IN</option>
      <option value="EXISTS">EXISTS</option>
      <option value="NOT EXISTS">NOT EXISTS</option>
      <option value="ANY">ANY</option>
      <option value="ALL">ALL</option>
    </>
  );
}


export function RegexOperatorOptionSet() {
  return (
    <>
      <option value="SIMILAR TO">SIMILAR TO</option>
      <option value="NOT SIMILAR TO">NOT SIMILAR TO</option>
    </>
  );
}