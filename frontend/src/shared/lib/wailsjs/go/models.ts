export namespace main {
	
	export class ForeignKeyConstraint {
	    refTable: string;
	    refColumns: string[];
	    onDelete?: string;
	    onUpdate?: string;
	
	    static createFrom(source: any = {}) {
	        return new ForeignKeyConstraint(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.refTable = source["refTable"];
	        this.refColumns = source["refColumns"];
	        this.onDelete = source["onDelete"];
	        this.onUpdate = source["onUpdate"];
	    }
	}
	export class FieldConstraints {
	    notNull: boolean;
	    unique: boolean;
	    check?: string;
	    foreignKey?: ForeignKeyConstraint;
	
	    static createFrom(source: any = {}) {
	        return new FieldConstraints(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.notNull = source["notNull"];
	        this.unique = source["unique"];
	        this.check = source["check"];
	        this.foreignKey = this.convertValues(source["foreignKey"], ForeignKeyConstraint);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class AddFieldRequest {
	    tableName: string;
	    fieldName: string;
	    type: string;
	    constraints: FieldConstraints;
	
	    static createFrom(source: any = {}) {
	        return new AddFieldRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tableName = source["tableName"];
	        this.fieldName = source["fieldName"];
	        this.type = source["type"];
	        this.constraints = this.convertValues(source["constraints"], FieldConstraints);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class CustomTypeField {
	    fieldName: string;
	    fieldType: string;
	
	    static createFrom(source: any = {}) {
	        return new CustomTypeField(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fieldName = source["fieldName"];
	        this.fieldType = source["fieldType"];
	    }
	}
	export class CreateCustomTypeRequest {
	    typeName: string;
	    typeKind: string;
	    values?: string[];
	    fields?: CustomTypeField[];
	
	    static createFrom(source: any = {}) {
	        return new CreateCustomTypeRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.typeName = source["typeName"];
	        this.typeKind = source["typeKind"];
	        this.values = source["values"];
	        this.fields = this.convertValues(source["fields"], CustomTypeField);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class CustomQueryRequest {
	    query: string;
	
	    static createFrom(source: any = {}) {
	        return new CustomQueryRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.query = source["query"];
	    }
	}
	export class CustomType {
	    name: string;
	    kind: string;
	    values?: string[];
	    fields?: CustomTypeField[];
	
	    static createFrom(source: any = {}) {
	        return new CustomType(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.kind = source["kind"];
	        this.values = source["values"];
	        this.fields = this.convertValues(source["fields"], CustomTypeField);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class CustomTypesListResponse {
	    types: CustomType[];
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new CustomTypesListResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.types = this.convertValues(source["types"], CustomType);
	        this.error = source["error"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DeleteFieldRequest {
	    tableName: string;
	    fieldName: string;
	
	    static createFrom(source: any = {}) {
	        return new DeleteFieldRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tableName = source["tableName"];
	        this.fieldName = source["fieldName"];
	    }
	}
	export class DropCustomTypeRequest {
	    typeName: string;
	
	    static createFrom(source: any = {}) {
	        return new DropCustomTypeRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.typeName = source["typeName"];
	    }
	}
	
	export class FieldInfo {
	    name: string;
	    type: string;
	    isNullable: boolean;
	    isAutoIncrement: boolean;
	    enumValues?: string[];
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new FieldInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.type = source["type"];
	        this.isNullable = source["isNullable"];
	        this.isAutoIncrement = source["isAutoIncrement"];
	        this.enumValues = source["enumValues"];
	        this.error = source["error"];
	    }
	}
	export class FieldSchema {
	    name: string;
	    type: string;
	    constraints: string;
	    enumValues?: string[];
	
	    static createFrom(source: any = {}) {
	        return new FieldSchema(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.type = source["type"];
	        this.constraints = source["constraints"];
	        this.enumValues = source["enumValues"];
	    }
	}
	
	export class InsertRecordRequest {
	    tableName: string;
	    data: Record<string, any>;
	
	    static createFrom(source: any = {}) {
	        return new InsertRecordRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tableName = source["tableName"];
	        this.data = source["data"];
	    }
	}
	export class InsertRequest {
	    tableName: string;
	
	    static createFrom(source: any = {}) {
	        return new InsertRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tableName = source["tableName"];
	    }
	}
	export class JoinConfig {
	    table: string;
	    type: string;
	    field: string;
	
	    static createFrom(source: any = {}) {
	        return new JoinConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.table = source["table"];
	        this.type = source["type"];
	        this.field = source["field"];
	    }
	}
	export class JoinRequest {
	    mainTable: string;
	    mainField: string;
	    joins: JoinConfig[];
	
	    static createFrom(source: any = {}) {
	        return new JoinRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mainTable = source["mainTable"];
	        this.mainField = source["mainField"];
	        this.joins = this.convertValues(source["joins"], JoinConfig);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class RecreateTablesResult {
	    success: boolean;
	    message: string;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new RecreateTablesResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.message = source["message"];
	        this.error = source["error"];
	    }
	}
	export class RenameTableRequest {
	    oldName: string;
	    newName: string;
	
	    static createFrom(source: any = {}) {
	        return new RenameTableRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.oldName = source["oldName"];
	        this.newName = source["newName"];
	    }
	}
	export class SearchFilter {
	    fieldName: string;
	    operator: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new SearchFilter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fieldName = source["fieldName"];
	        this.operator = source["operator"];
	        this.value = source["value"];
	    }
	}
	export class SearchRequest {
	    tableName: string;
	    filters: SearchFilter;
	
	    static createFrom(source: any = {}) {
	        return new SearchRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tableName = source["tableName"];
	        this.filters = this.convertValues(source["filters"], SearchFilter);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TableDataResponse {
	    columns: string[];
	    rows: any[];
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new TableDataResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.columns = source["columns"];
	        this.rows = source["rows"];
	        this.error = source["error"];
	    }
	}
	export class TableMetadata {
	    name: string;
	    fields: FieldInfo[];
	
	    static createFrom(source: any = {}) {
	        return new TableMetadata(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.fields = this.convertValues(source["fields"], FieldInfo);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TablesListResponse {
	    tableName: string[];
	
	    static createFrom(source: any = {}) {
	        return new TablesListResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tableName = source["tableName"];
	    }
	}
	export class UpdateCustomTypeRequest {
	    typeName: string;
	    newValues?: string[];
	    newFields?: CustomTypeField[];
	
	    static createFrom(source: any = {}) {
	        return new UpdateCustomTypeRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.typeName = source["typeName"];
	        this.newValues = source["newValues"];
	        this.newFields = this.convertValues(source["newFields"], CustomTypeField);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class UpdateFieldRequest {
	    tableName: string;
	    oldName: string;
	    newName: string;
	    type: string;
	    constraints: FieldConstraints;
	
	    static createFrom(source: any = {}) {
	        return new UpdateFieldRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tableName = source["tableName"];
	        this.oldName = source["oldName"];
	        this.newName = source["newName"];
	        this.type = source["type"];
	        this.constraints = this.convertValues(source["constraints"], FieldConstraints);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

