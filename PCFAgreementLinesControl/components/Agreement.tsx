import React, { useContext } from 'react'
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack } from '@fluentui/react/lib/Stack';
import { stackTokens, stackItemTokens } from '../globals/stackTokens';
import { AgreementlineContext } from '../contexts/AgreementContext';


const Agreement: React.FC = () => {
    
    const agreementline:any = useContext(AgreementlineContext);

    console.log(agreementline);
    
    return (
        <Stack tokens={stackTokens}>
            <h2>General</h2>
            <form action="">
                <Stack horizontal tokens={stackItemTokens}>
                    <Stack.Item grow={1}>
                        <TextField value={agreementline["_dpcomm_accountid_value@OData.Community.Display.V1.FormattedValue"] || ''} disabled readOnly label="Account" />
                        <TextField value={agreementline.dpcomm_name || ''} disabled readOnly label="Agreement line" />
                        <TextField value={agreementline.direction[1] || ''} disabled readOnly label="Direction" />
                    </Stack.Item>
                    <Stack.Item grow={1}>
                        <TextField value={agreementline["_dpcomm_productid_value@OData.Community.Display.V1.FormattedValue"] || ''} disabled readOnly label="Product" />
                        <TextField value={agreementline.dpcomm_netamountacccur || ''} disabled readOnly label="Net amount in ACC" />
                        <TextField value={agreementline.dpcomm_allocationquantityavailable || ''} disabled readOnly label="Available for allocation" />
                    </Stack.Item>
                </Stack>
            </form>
        </Stack>
    )
}

export default Agreement
