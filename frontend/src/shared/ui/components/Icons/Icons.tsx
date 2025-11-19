import { Xmark } from "@gravity-ui/icons";
import { Check } from "@gravity-ui/icons";
import { AbbrSql } from "@gravity-ui/icons";
import { ArrowsRotateRight } from "@gravity-ui/icons";
import { ChevronsExpandUpRight } from "@gravity-ui/icons";
import { ChevronsCollapseUpRight } from "@gravity-ui/icons";
import clsx from "clsx";
import s from "./style.module.sass";

type IconComponent = typeof Xmark;

function addClasses(IconComponent: IconComponent, className: string) {
  return () => <IconComponent className={clsx(s.icon, s[className])} />;
}

const Icons: { [key: string]: IconComponent } = {
  Delete: addClasses(Xmark, "delete-icon"),
  Success: addClasses(Check, "success-icon"),
  AbbrSql: addClasses(AbbrSql, "abbr-sql-icon"),
  Refresh: addClasses(ArrowsRotateRight, "refresh-icon"),
  Expand: addClasses(ChevronsExpandUpRight, "expand-icon"),
  Shrink: addClasses(ChevronsCollapseUpRight, "shrink-icon"),
};

export default Icons;
