import { AllocationModel } from '../models/AllocationModel';

const ENTITY_NAME = 'dpcomm_agreementline';

export interface IAllocationsRepository {
  setAllocations(allocations: any, type: string): Promise<AllocationModel[]>;
  getAllocations(): Promise<AllocationModel[]>;
  removeAllocation(allocation: any): Promise<AllocationModel[]>;
}

export class AllocationsRepository implements IAllocationsRepository {
  constructor(private _dataContext: ComponentFramework.WebApi, private readonly _recordId: string) { }

  public async setAllocations(allocations: any, type: string): Promise<AllocationModel[]> {
    const x = allocations;
    const y = await this._dataContext.retrieveRecord(ENTITY_NAME, this._recordId);

    for (const allocation of allocations) {
      const formattedAllocation = {
        "dpcomm_allocatedquantity": parseInt(allocation.value, 10),
        "dpcomm_purchaseagreementid@odata.bind": `/dpcomm_agreements(${allocation.agreementId})`,
        "dpcomm_purchaseagreementlineid@odata.bind": `/dpcomm_agreementlines(${allocation.agreementlineId})`,
        "dpcomm_salesagreementid@odata.bind": `/dpcomm_agreements(${y._dpcomm_agreementid_value})`,
        "dpcomm_salesagreementlineid@odata.bind": `/dpcomm_agreementlines(${this._recordId})`,
        "dpcomm_type": parseInt(type, 10),
        "statuscode": 1
      }
      console.log(allocation);
      await this._dataContext.createRecord('dpcomm_allocation', formattedAllocation).then(
        function success(result) {
          console.log(result.id);
        },
        function (error) {
          console.log(error.message);
        }
      );
    }
    return x;
  }

  public async getAllocations(): Promise<any> {
    const fetchAllocations = `<fetch top="50" >
    <entity name="dpcomm_allocation" >
      <attribute name="dpcomm_type" />
      <attribute name="dpcomm_allocatedquantity" />
      <attribute name="dpcomm_purchaseagreementlineid" />
      <attribute name="dpcomm_salesagreementlineid" />
      <filter type="or" >
        <condition attribute="dpcomm_salesagreementlineid" operator="eq" value='${this._recordId}' />
        <condition attribute="dpcomm_purchaseagreementlineid" operator="eq" value='${this._recordId}' />
      </filter>
      <filter>
        <condition attribute="statuscode" operator="eq" value="1" />
      </filter>
      <link-entity name="dpcomm_agreementline" from="dpcomm_agreementlineid" to="dpcomm_purchaseagreementlineid" link-type="inner" alias="PurchaseAgreementLine" >
        <attribute name="dpcomm_name" />
        <attribute name="dpcomm_accountid" />
        <attribute name="dpcomm_fromdate" />
        <attribute name="dpcomm_todate" />
      </link-entity>
      <link-entity name="dpcomm_agreementline" from="dpcomm_agreementlineid" to="dpcomm_salesagreementlineid" link-type="inner" alias="SalesAgreementLine" >
        <attribute name="dpcomm_name" />
        <attribute name="dpcomm_accountid" />
        <attribute name="dpcomm_fromdate" />
        <attribute name="dpcomm_todate" />
      </link-entity>
    </entity>
  </fetch>`

    const allocations = await this._dataContext.retrieveMultipleRecords('dpcomm_allocation', `?fetchXml=${encodeURI(fetchAllocations)}`);

    console.log(allocations);


    return allocations.entities;
  }

  public async removeAllocation(allocation:any): Promise<any> {
    const updatedAllocation = {"statuscode": 222860000, "statecode": 0} ;
    console.log(allocation);
    console.log(updatedAllocation);
    await this._dataContext.updateRecord("dpcomm_allocation", allocation.dpcomm_allocationid, updatedAllocation).then(
      function success(result) {
          console.log("Updated");
      },
      function (error) {
          console.log(error.message);
      }
    )

    return updatedAllocation;
  }
}
