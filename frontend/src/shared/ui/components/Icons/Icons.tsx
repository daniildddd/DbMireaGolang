import {
  Xmark,
  Check,
  AbbrSql,
  ArrowsRotateRight,
  ChevronsExpandUpRight,
  ChevronsCollapseUpRight,
  Database,
  BranchesRight,
  Magnifier,
  Layers,
  TrashBin,
  Pencil,
} from "@gravity-ui/icons";

import clsx from "clsx";
import s from "./style.module.sass";

type IconComponent = typeof Xmark;

function addClasses(IconComponent: IconComponent, iconClassName: string) {
  return () => (
    <IconComponent
      className={clsx(s.icon, s[`${iconClassName}-icon`])}
      preserveAspectRatio="true"
    />
  );
}

const Icons: { [key: string]: IconComponent } = {
  Delete: addClasses(Xmark, "delete"),
  Success: addClasses(Check, "success"),
  AbbrSql: addClasses(AbbrSql, "abbr-sql"),
  Refresh: addClasses(ArrowsRotateRight, "refresh"),
  Expand: addClasses(ChevronsExpandUpRight, "expand"),
  Shrink: addClasses(ChevronsCollapseUpRight, "shrink"),
  Database: addClasses(Database, "database"),
  BranchesRight: addClasses(BranchesRight, "branches-right"),
  Magnifier: addClasses(Magnifier, "magnifier"),
  Stack: addClasses(Layers, "layers"),
  TrashBin: addClasses(TrashBin, "trash-bin"),
  Pencil: addClasses(Pencil, "pencil"),
};

export default Icons;
