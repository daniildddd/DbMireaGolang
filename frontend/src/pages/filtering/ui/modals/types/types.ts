import { ModalParams } from "@/shared/ui/components/AbstractModal/types";

export interface OrderByModalParams extends ModalParams {}

export interface WhereModalParams extends ModalParams {
  step?: number;
  min?: number;
  max?: number;
}

export interface HavingModalParams extends ModalParams {
  step?: number;
  min?: number;
  max?: number;
}

export interface AggregateModalParams extends ModalParams {}

export interface GroupByModalParams extends ModalParams {}

export enum Actions {
  "SET_FIELD_NAME",
  "SET_AGGREGATE",
  "SET_OPERATOR",
  "SET_INPUT_NUMBER",
}
