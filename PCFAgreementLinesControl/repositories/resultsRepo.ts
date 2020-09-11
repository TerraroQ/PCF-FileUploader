import { FilterModel } from '../models/FilterModel';

const ENTITY_NAME = 'dpcomm_agreementline';

export interface IResultsRepository {
  getAgreementlines(filters: any): Promise<FilterModel[]>;
}

export class ResultsRepository implements IResultsRepository {
  constructor(private _dataContext: ComponentFramework.WebApi, private readonly _recordId: string) { }

  public async getAgreementlines(filters: any): Promise<FilterModel[]> {

    const fetchResults = `<fetch>
    <entity name='dpcomm_agreementline'>
      <filter type='and'><condition attribute='dpcomm_allocationquantityavailable' operator='gt' value='0'/><condition attribute='dpcomm_agreementlinetype' operator='eq' value='1'/><condition attribute='dpcomm_agreementlineid' operator='ne' value='${this._recordId}'/>${filters.dimension1 !== '' ? `<condition attribute='dpcomm_proddim1id' operator='eq' value='${filters.dimension1}'/>`: ``}${filters.dimension2 !== '' ? `<condition attribute='dpcomm_proddim2id' operator='eq' value='${filters.dimension2}'/>`: ``}${filters.dimension3 !== '' ? `<condition attribute='dpcomm_proddim3id' operator='eq' value='${filters.dimension3}'/>` : ``}${filters.dimension4 !== '' ? `<condition attribute='dpcomm_proddim4id' operator='eq' value='${filters.dimension4}'/>` : ``}${filters.fromDate !== '' && `<condition attribute='dpcomm_fromdate' operator='ge' value='${filters.fromDate}'/>`}${filters.toDate !== '' && `<condition attribute='dpcomm_todate' operator='le' value='${filters.toDate}'/>`}${filters.toDate !== '' && `<condition attribute='dpcomm_fromdate' operator='le' value='${filters.toDate}'/>`}
      </filter>
      <link-entity name='dpcomm_agreement' from='dpcomm_agreementid' to='dpcomm_agreementid'>
        <filter type='and'>
          <condition attribute='dpcomm_direction' operator='ne' value='${filters.direction}'/>
        </filter>
      </link-entity>
    </entity>
  </fetch>`

    fetchResults.replace(/\s+/g, '').replace(/(\r\n|\n|\r)/gm, '').replace(/$\n^\s*/gm, ' ');


    var req = new XMLHttpRequest();
    req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v9.0/$batch", false);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "multipart/mixed;boundary=batch_contactfetch");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");

    var body = '--batch_contactfetch\n'
    body += 'Content-Type: application/http\n'
    body += 'Content-Transfer-Encoding: binary\n'
    body += '\n'
    body += 'GET ' + Xrm.Page.context.getClientUrl() + '/api/data/v9.0/dpcomm_agreementlines?fetchXml=' + encodeURI(fetchResults) + ' HTTP/1.1\n'
    body += 'Content-Type: application/json\n'
    body += 'OData-Version: 4.0\n'
    body += 'OData-MaxVersion: 4.0\n'
    body += 'Prefer: odata.include-annotations=*\n'
    body += '\n'
    body += '--batch_contactfetch--'

    req.send(body);

    if (req.status == 200) {
      var response = JSON.parse(req.response.substring(req.response.indexOf('{'), req.response.lastIndexOf('}') + 1));
    }

    return response.value as unknown as FilterModel[];




  }
}
