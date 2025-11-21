import clsx from "clsx";
import s from "./style.module.sass";

interface QueryResultsProps {
  columns?: string[];
  rows?: any[];
  error?: string;
}

export default function QueryResults({
  columns,
  rows,
  error,
}: QueryResultsProps) {
  if (error) {
    return (
      <div className={clsx(s["results-container"], s["error"])}>
        <div className={s["error-icon"]}>⚠️</div>
        <div className={s["error-message"]}>Ошибка запроса:</div>
        <div className={s["error-details"]}>{error}</div>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className={clsx(s["results-container"], s["empty"])}>
        <div className={s["empty-icon"]}>📭</div>
        <div className={s["empty-message"]}>Результатов не найдено</div>
      </div>
    );
  }

  return (
    <div className={s["results-container"]}>
      <div className={s["results-info"]}>
        Найдено записей: <strong>{rows.length}</strong>
      </div>
      <div className={s["results-table"]}>
        <table>
          <thead>
            <tr>
              <th className={s["row-number"]}>#</th>
              {columns?.map((col) => (
                <th key={col} title={col}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className={s["row-number"]}>{idx + 1}</td>
                {columns?.map((col) => (
                  <td key={`${idx}-${col}`}>{renderCellValue(row[col])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderCellValue(value: any): string {
  if (value === null || value === undefined) {
    return "NULL";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
