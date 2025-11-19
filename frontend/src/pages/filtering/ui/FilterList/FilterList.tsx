import { PropsWithChildren } from "react";

export default function FilterList({ children }: PropsWithChildren) {
  return <div className="filter-list">{children}</div>;
}
