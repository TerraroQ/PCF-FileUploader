import { ISharePointRepository } from '../repositories/SharePointRepo';
import { AttachmentsModel, RelativeServerURL } from '../models/AttachmentsModel';

export interface IAppLogic {
    getRelativeURL(): Promise<any>;
    getAttachments(message): Promise<any>;
}

export class AppLogic implements IAppLogic {
    constructor(private _allocationsModel: ISharePointRepository) {}

    public async getRelativeURL(): Promise<any> {
        return this._allocationsModel.getRelativeURL();
    }
    public async getAttachments(message): Promise<any> {
        return this._allocationsModel.getAttachments(message);
    }
}
