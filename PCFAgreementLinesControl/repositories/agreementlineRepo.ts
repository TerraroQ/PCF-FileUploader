import { AgreementlineModel } from '../models/AgreementlineModel';

const ENTITY_NAME = 'dpcomm_agreementline';

export interface IAgreementlineRepository {
    getAgreementline(): Promise<AgreementlineModel[]>;
}

export class AgreementlineRepository implements IAgreementlineRepository {
    constructor(private _dataContext: ComponentFramework.WebApi, private readonly _recordId: string) { }

    public async getAgreementline(): Promise<AgreementlineModel[]> {
        const x = await this._dataContext.retrieveRecord(ENTITY_NAME, this._recordId);
        const y = await this._dataContext.retrieveRecord('dpcomm_agreement', x._dpcomm_agreementid_value);

        const fetchProdDim = (i: number) => {
            return `<fetch >
                <entity name="dpcore_productdimensioncombination" >
                    <attribute name="dpcore_productdimensionid" />
                    <filter>
                        <condition attribute="dpcore_productid" operator="eq" value='${x._dpcomm_productid_value}' />
                    </filter>
                    <filter type="or" >
                        <condition attribute="dpcore_legalentityid" operator="eq" value="${x._dpcomm_legalentityid_value}" />
                        <condition attribute="dpcore_legalentityid" operator="null" />
                    </filter>
                    <link-entity name="dpcore_productdimension" from="dpcore_productdimensionid" to="dpcore_productdimensionid" >
                        <link-entity name="dpcore_productdimensiontype" from="dpcore_productdimensiontypeid" to="dpcore_productdimensiontypeid" >
                            <filter>
                                <condition attribute="dpcore_productdimensionnumber" operator="eq" value="${i}" />
                            </filter>
                        </link-entity>
                    </link-entity>
                </entity>
            </fetch>`
        }
        let dimensions:any = [];
        for (let i = 0; i < 4; i++) {
            dimensions[i] = await this._dataContext.retrieveMultipleRecords('dpcore_productdimensioncombination', `?fetchXml=${encodeURI(fetchProdDim(i + 1))}`);
        }

        const fetchProdAccounts = `<fetch>
        <entity name="dpcomm_productaccountcombination">
          <attribute name="dpcomm_name" />
          <attribute name="dpcomm_productaccountcombinationid" />
          <attribute name="dpcomm_proddim1id" />
          <attribute name="dpcomm_proddim2id" />
          <attribute name="dpcomm_proddim3id" />
          <attribute name="dpcomm_proddim4id" />
          <attribute name="dpcomm_accountid" />
          <attribute name="dpcomm_productaccountcombinationid" />
          <attribute name="dpcomm_direction" />
          <order attribute="dpcomm_name" descending="false" />
          <filter type="and">
            <condition attribute="statecode" operator="eq" value="0" />
            <condition attribute="dpcomm_productid" operator="eq" value="${x._dpcomm_productid_value}"/>
            <condition attribute="dpcomm_name" operator="not-null" />
          </filter>
        <filter type="or" >
            <condition attribute="dpcomm_legalentityid" operator="eq" value="${x._dpcomm_legalentityid_value}" />
            <condition attribute="dpcomm_legalentityid" operator="null" />
        </filter>
        </entity>
      </fetch>`

        const prodAccounts = await this._dataContext.retrieveMultipleRecords('dpcomm_productaccountcombination', `?fetchXml=${encodeURI(fetchProdAccounts)}`);
        const direction = [y["dpcomm_direction"], y["dpcomm_direction@OData.Community.Display.V1.FormattedValue"]];

        return { ...x, direction, dimensions, prodAccounts } as unknown as AgreementlineModel[];
    }
}
