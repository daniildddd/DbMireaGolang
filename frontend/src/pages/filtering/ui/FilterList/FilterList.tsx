import { PropsWithChildren, useState } from "react";
import FilterCard from "../FilterCard/FilterCard";

export default function FilterList({ children }: PropsWithChildren) {
  return <div className="filter-list">{children}</div>;
}
