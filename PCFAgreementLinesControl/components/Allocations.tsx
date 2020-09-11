import React, { useContext } from 'react'
import { AllocationContext } from '../contexts/AllocationContext';
import { Icon } from '@fluentui/react/lib/Icon';
import { DetailsList, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';
import { Stack } from '@fluentui/react/lib/Stack';
import { stackTokens } from '../globals/stackTokens';
import { IAppLogic } from '../interfaces/app-logic';
import { UpdateData } from '../App';


const DeleteIcon = () => <Icon iconName="Delete" className="ms-IconExample" />;

const Allocations = (props: { appLogic: IAppLogic }) => {
    const { appLogic } = props;
    const allocations: any = useContext(AllocationContext);
    const { status, statusSetter } = useContext(UpdateData);

    const columns = [
        { key: 'dpcomm_allocatedquantity', name: 'Allocated quantity', fieldName: 'dpcomm_allocatedquantity', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'dpcomm_type@OData.Community.Display.V1.FormattedValue', name: 'Type', fieldName: 'dpcomm_type@OData.Community.Display.V1.FormattedValue', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: '_dpcomm_purchaseagreementlineid_value@OData.Community.Display.V1.FormattedValue', name: 'Purchase agreementline ID', fieldName: '_dpcomm_purchaseagreementlineid_value@OData.Community.Display.V1.FormattedValue', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'PurchaseAgreementLine.dpcomm_accountid@OData.Community.Display.V1.FormattedValue', name: 'Purchase account', fieldName: 'PurchaseAgreementLine.dpcomm_accountid@OData.Community.Display.V1.FormattedValue', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'PurchaseAgreementLine.dpcomm_fromdate@OData.Community.Display.V1.FormattedValue', name: 'Purchase from date', fieldName: 'PurchaseAgreementLine.dpcomm_fromdate@OData.Community.Display.V1.FormattedValue', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'PurchaseAgreementLine.dpcomm_todate@OData.Community.Display.V1.FormattedValue', name: 'Purchase to date', fieldName: 'PurchaseAgreementLine.dpcomm_todate@OData.Community.Display.V1.FormattedValue', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: '_dpcomm_salesagreementlineid_value@OData.Community.Display.V1.FormattedValue', name: 'Sales agreementline ID', fieldName: '_dpcomm_salesagreementlineid_value@OData.Community.Display.V1.FormattedValue', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'SalesAgreementLine.dpcomm_accountid@OData.Community.Display.V1.FormattedValue', name: 'Sales account', fieldName: 'SalesAgreementLine.dpcomm_accountid@OData.Community.Display.V1.FormattedValue', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'SalesAgreementLine.dpcomm_fromdate@OData.Community.Display.V1.FormattedValue', name: 'Sales from date', fieldName: 'SalesAgreementLine.dpcomm_fromdate@OData.Community.Display.V1.FormattedValue', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'SalesAgreementLine.dpcomm_todate@OData.Community.Display.V1.FormattedValue', name: 'Sales to date', fieldName: 'SalesAgreementLine.dpcomm_todate@OData.Community.Display.V1.FormattedValue', minWidth: 100, maxWidth: 100, isResizable: true },
        {
            key: 'remove',
            name: '',
            minWidth: 20,
            maxWidth: 20,
            isCollapsable: false,
            onRender: (item) => (
                <a onClick={async (event: any) => {
                    if (confirm('Are you sure you want to delete the allocation?')) {
                        await appLogic.removeAllocation(item);
                        statusSetter();
                    }
                }}><DeleteIcon /></a>
            )
        }
    ]

    return (
        <Stack tokens={stackTokens}>
            <h2>Allocations</h2>
            <DetailsList
                items={allocations}
                setKey="set"
                checkButtonAriaLabel="Row"
                checkboxVisibility={2}
                compact={true}
                layoutMode={DetailsListLayoutMode.fixedColumns}
                columns={columns}
            />
        </Stack>
    )
}

export default Allocations
