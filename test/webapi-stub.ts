import WebApiClient from 'xrm-webapi-client';

export class WebApiStub implements ComponentFramework.WebApi {
    public async createRecord(entityType: string, data: ComponentFramework.WebApi.Entity): Promise<ComponentFramework.EntityReference> {
        return WebApiClient.Create({ entity: data, entityName: entityType, async: true });
    }

    public async deleteRecord(entityType: string, id: string): Promise<ComponentFramework.EntityReference> {
        const result = await WebApiClient.Delete({ entityName: entityType, entityId: id, async: true });
        if (typeof result === 'string') {
            return {
                id: { guid: id },
                etn: result,
                name: result
            };
        } else {
            throw `${result} is not of type 'string'`;
        }
    }

    public async updateRecord(
        entityType: string,
        id: string,
        data: ComponentFramework.WebApi.Entity
    ): Promise<ComponentFramework.EntityReference> {
        return WebApiClient.Update({
            entity: data,
            entityId: id,
            async: true,
            entityName: entityType,
            headers: [
                // adding this header will make the api return the updated entity
                { key: 'Prefer', value: 'return=representation' }
            ]
        });
    }

    public async retrieveMultipleRecords(
        entityType: string,
        options?: string | undefined,
        maxPageSize?: number | undefined
    ): Promise<ComponentFramework.WebApi.RetrieveMultipleResponse> {
        let params: WebApiClient.RetrieveParameters = {
            returnAllPages: true,
            entityName: entityType,
            async: true,
            headers: [{ key: 'Prefer', value: 'odata.include-annotations="*"' }]
        };
        if (options !== undefined) {
            if (WebApiStub.isFetchQuery(options)) {
                params = { ...params, fetchXml: WebApiStub.rewriteFetchString(options) };
            } else {
                params = { ...params, queryParams: options };
            }
        }
        const response: any = await WebApiClient.Retrieve(params);
        response.entities = response.value
        // TODO: check if the odata request is the same format
        return (
            response
         ) as ComponentFramework.WebApi.RetrieveMultipleResponse;
    }

    public async retrieveRecord(entityType: string, id: string, options?: string | undefined): Promise<ComponentFramework.WebApi.Entity> {
        let params: WebApiClient.RetrieveParameters = {
            returnAllPages: true,
            entityName: entityType,
            entityId: id,
            async: true,
            headers: [{ key: 'Prefer', value: 'odata.include-annotations="*"' }]
        };
        if (options !== undefined) {
            if (WebApiStub.isFetchQuery(options)) {
                params = { ...params, fetchXml: WebApiStub.rewriteFetchString(options) };
            } else {
                params = { ...params, queryParams: options };
            }
        }

        const response: any = await WebApiClient.Retrieve(params);
        
        // TODO: check if the odata request is the same format
        return (
            response
         ) as ComponentFramework.WebApi.Entity;

        // throw new Error('Method not implemented.');
    }

    private static isFetchQuery(options: string | undefined): boolean {
        return typeof options === 'string' && options.startsWith('?fetchXml=');
    }

    private static rewriteFetchString(fetchString: string): string {
        if (typeof fetchString !== 'string') {
            throw `${fetchString} is not a string!`;
        }
        if (!fetchString.startsWith('?fetchXml=')) {
            throw `${fetchString} is not a valid fetch string, a fetchstring should always start with: '?fetchXml='`;
        }
        return fetchString.substring('?fetchXml='.length);
    }
}
