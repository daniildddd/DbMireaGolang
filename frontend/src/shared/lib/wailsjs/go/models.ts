export namespace main {
	
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
	
	    static createFrom(source: any = {}) {
	        return new FieldSchema(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.type = source["type"];
	        this.constraints = source["constraints"];
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

}

