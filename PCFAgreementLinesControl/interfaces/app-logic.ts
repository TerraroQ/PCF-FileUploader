import { IAgreementlineRepository } from '../repositories/agreementlineRepo';
import { AgreementlineModel } from '../models/AgreementlineModel';
import { FilterModel } from '../models/FilterModel';
import { IResultsRepository } from '../repositories/resultsRepo';
import { IAllocationsRepository } from '../repositories/allocationsRepo';
import { AllocationModel } from '../models/AllocationModel';

export interface IAppLogic {
    getAgreementline(): Promise<AgreementlineModel[]>;
    getAgreementlines(filters:any): Promise<FilterModel[]>;
    setAllocations(allocations:any, type:string): Promise<AllocationModel[]>;
    getAllocations(): Promise<AllocationModel[]>;
    removeAllocation(allocation:any): Promise<AllocationModel[]>;
}

export class AppLogic implements IAppLogic {
    constructor(private _agreementlineModel: IAgreementlineRepository, private _filterModel: IResultsRepository, private _allocationsModel: IAllocationsRepository) {}

    public async getAgreementline(): Promise<AgreementlineModel[]> {
        return this._agreementlineModel.getAgreementline();
    }
    public async getAgreementlines(filters:any): Promise<FilterModel[]> {
        return this._filterModel.getAgreementlines(filters);
    }
    public async setAllocations(allocations:any, type:string): Promise<AllocationModel[]> {
        return this._allocationsModel.setAllocations(allocations, type);
    }
    public async getAllocations(): Promise<AllocationModel[]> {
        return this._allocationsModel.getAllocations();
    }
    public async removeAllocation(allocation:any): Promise<AllocationModel[]> {
        return this._allocationsModel.removeAllocation(allocation);
    }

}
