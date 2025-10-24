export namespace main {
	
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

