import { runWithAdal } from 'react-adal';
// import { adalApiFetch, authContext } from '../adalConfig';
import { AttachmentsModel, RelativeServerURL } from '../models/AttachmentsModel';

const ENTITY_NAME = 'dp_dspmessage';

export interface ISharePointRepository {
  getRelativeURL(): Promise<RelativeServerURL[]>;
  getAttachments(message): Promise<AttachmentsModel[]>;
}

export class SharePointRepository implements ISharePointRepository {
  constructor(private _dataContext: ComponentFramework.WebApi, private readonly _recordId: string, private readonly _SPToken: string) { }

  public async getRelativeURL(): Promise<any> {

    const fetchDSPMessage = `<fetch>
    <entity name='dp_dspmessage' >
    <attribute name='statuscode' />
    <attribute name='dp_direction' />
    <attribute name='dp_attachments' />
    <attribute name='dp_dspmessagetype' />
      <filter>
        <condition attribute='dp_dspmessageid' operator='eq' value='${this._recordId}' />
      </filter>
      <link-entity name='opportunity' from='opportunityid' to='dp_opportunityid' link-type='outer' alias='opp' >
        <link-entity name='sharepointdocumentlocation' from='regardingobjectid' to='opportunityid' link-type='outer' alias='doclocopp' >
          <attribute name='relativeurl' />
          <link-entity name='sharepointdocumentlocation' from='sharepointdocumentlocationid' to='parentsiteorlocation' link-type='outer' alias='doclocaldos' >
            <attribute name='relativeurl' />
            <link-entity name='sharepointsite' from='sharepointsiteid' to='parentsiteorlocation' link-type='outer' alias='spsiteal' >
              <attribute name='relativeurl' />
              <link-entity name='sharepointsite' from='sharepointsiteid' to='parentsite' link-type='outer' alias='spsiteoas' >
                <attribute name='absoluteurl' />
              </link-entity>
            </link-entity>
          </link-entity>
        </link-entity>
      </link-entity>
    </entity>
  </fetch>
  `
    const x = await this._dataContext.retrieveMultipleRecords(ENTITY_NAME, `?fetchXml=${encodeURI(fetchDSPMessage)}`);

    console.log(x)

    return x.entities[0];
  }

  public async getAttachments(message): Promise<any> {
    let attachments;

    const tokenFromStorage = localStorage.getItem("adal.access.token.keyhttps://oasennl.sharepoint.com/");



    const reqBody = JSON.stringify({
      "SiteAddress": message['spsiteoas.absoluteurl'] + "/" + message['spsiteal.relativeurl'],
      "Uri": "_api/web/GetFolderByServerRelativeUrl('" + message['doclocaldos.relativeurl'] + "/" + message['doclocopp.relativeurl'] + "')/Files?$select=Name,UIVersion,UIVersionLabel,UniqueId,ServerRelativeUrl"
    })

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("accept", "application/json;odata=verbose");
    myHeaders.append("odata-version", "");
    myHeaders.append("Authorization", "Bearer " + tokenFromStorage);


    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
      // body: reqBody
    };


    const spWebUrl = message['spsiteoas.absoluteurl'] + "/" + message['spsiteal.relativeurl'];

    const url = spWebUrl + "/" + "_api/web/GetFolderByServerRelativeUrl('" + message['doclocaldos.relativeurl'] + "/" + message['doclocopp.relativeurl'] + "')/Files?$select=Name,UIVersion,UIVersionLabel,UniqueId,ServerRelativeUrl";


    // console.log(url);
    // await fetch("https://prod-34.westeurope.logic.azure.com:443/workflows/898ce4863dcb4e1cbb8935d3a91b2da6/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=X-GtmsZXezMzPoEJhV4gdsklJIvI4iack-sQUh5OYdQ", requestOptions)
    //   .then(response => response.text())
    //   .then(result => { attachments = JSON.parse(result) })
    //   .catch(error => console.log('error', error));

      await fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => { attachments = JSON.parse(result) })
        .catch(error => console.log('error', error));

        return attachments.d.results
    // }








    // if (cachedToken && cachedToken.length > 0) {
    // await fetch(message['spsiteoas.absoluteurl'] + "/" + message['spsiteal.relativeurl'] + "/_api/web/GetFolderByServerRelativeUrl('" + message['doclocaldos.relativeurl'] + "/" + message['doclocopp.relativeurl'] + "')/Files", requestOptions)
    //   .then(response => response.text())
    //   .then(result => { attachments = JSON.parse(result) })
    //   .catch(error => console.log('error', error));
    // }

    // const DO_NOT_LOGIN = false;

    // runWithAdal(authContext, () => {

    //   adalApiFetch(fetch, message['spsiteoas.absoluteurl'] + "/" + message['spsiteal.relativeurl'] + "/_api/web/GetFolderByServerRelativeUrl('" + message['doclocaldos.relativeurl'] + "/" + message['doclocopp.relativeurl'] + "')/Files", {})
    //     .then((response) => {

    //       // This is where you deal with your API response. In this case, we            
    //       // interpret the response as JSON, and then call `setState` with the
    //       // pretty-printed JSON-stringified object.
    //       response.json()
    //         .then((responseJson) => {
    //           attachments = responseJson;
    //         });
    //     })
    //     .catch((error) => {

    //       // Don't forget to handle errors!
    //       console.error(error);
    //     })
    // }, DO_NOT_LOGIN);







    //   const headers = {
    //     "accept": "application/json;odata=verbose"
    // };
    // const spWebUrl = message['spsiteoas.absoluteurl'] + "/" + message['spsiteal.relativeurl'];
    // const url = spWebUrl + "/" + "_api/web/GetFolderByServerRelativeUrl('" + message['doclocaldos.relativeurl'] + "/" + message['doclocopp.relativeurl'] + "')/Files?$select=Name,UIVersion,UIVersionLabel,UniqueId,ServerRelativeUrl";

    // adalApiFetch(url, {headers})
    //     .then(r => r.json())
    //     .then(r => {
    //         console.log(r);
    // });







    console.log(attachments);

    // return attachments.d.results
    
    // }

    // return ""

  }


}
