export interface CustomTypeField {
  name: string;
  type: string;
}

export interface CustomTypeInfo {
  typeName: string;
  typeKind: "ENUM" | "COMPOSITE";
  definition: string;
  fields?: CustomTypeField[];
  enumValues?: string[];
}

export interface CreateCustomTypeRequest {
  typeName: string;
  typeKind: "ENUM" | "COMPOSITE";
  enumValues?: string[];
  fields?: CustomTypeField[];
}

export interface UpdateCustomTypeRequest {
  currentTypeName: string;
  newTypeName?: string;
  typeKind: "ENUM" | "COMPOSITE";
  newEnumValues?: string[];
  newFields?: CustomTypeField[];
}

export interface DropCustomTypeRequest {
  typeName: string;
}

export interface CustomTypesListResponse {
  types: CustomTypeInfo[];
  error?: string;
}
