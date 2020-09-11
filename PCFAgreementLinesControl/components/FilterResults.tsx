import React, { useState, useContext } from 'react'
import { DetailsList, DetailsListLayoutMode } from "@fluentui/react/lib/DetailsList";
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { stackTokens, stackItemTokens } from '../globals/stackTokens';
import { agreementLineControlSettings } from '../agreementLineControlSettings';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { IAppLogic } from '../interfaces/app-logic';
import { useResultContext } from '../contexts/ResultsContext';
import { AgreementlineContext } from '../contexts/AgreementContext';
import { UpdateData } from '../App';

interface Messages {
    success?: string;
    error?: string;
}

const FilterResults = (props: { appLogic: IAppLogic }) => {
    const { results, updateResults } = useResultContext();
    const agreementline: any = useContext(AgreementlineContext);
    const { appLogic } = props;
    const [selectedType, setSelectedType] = useState();
    const [total, setTotal] = useState<number>(0);
    const [messages, setMessage] = useState<Messages>({ success: "", error: "" });
    const { status, statusSetter } = useContext(UpdateData);

    const getColumns = () => {
        const columns = JSON.parse(agreementLineControlSettings.columns);
        for (const column of columns) {
            column.minWidth = parseInt(column.minWidth);
            column.maxWidth = parseInt(column.maxWidth);
            if (column.key === "allocateQuantity") {
                column.onRender = (agreementline: any, i: number) => (
                    <>
                        <TextField
                            placeholder="Fill wanted amount..."
                            type="number"
                            max={agreementline.dpcomm_allocationquantityavailable}
                            name={column.fieldName}
                            onChange={(e: any) => { column.value = e.target.value; getTotalQuantity(); validateAllocation(e); }}
                            data-agreementid={agreementline._dpcomm_agreementid_value}
                            data-agreementlineid={agreementline.dpcomm_agreementlineid}
                            tabIndex={i}
                        />
                    </>
                )
            }
        }
        return columns;
    }

    const getTotalQuantity = () => {
        const inputFields = document.querySelectorAll('input[name="allocateQuantity"]');
        let totalQuantity: number[] = [];

        Array.from(inputFields).forEach((el: any) => {
            const value = parseInt(el.value, 10);
            if (value && !isNaN(value) && value !== undefined && value !== null && value > 0) {
                totalQuantity.push(value);
            }
        });

        const sum = totalQuantity.reduce((a, b) => {
            return a + b;
        }, 0);

        setTotal(sum);
    }

    const validateAllocation = (e: React.SyntheticEvent<HTMLButtonElement>) => {
        const el = e.target as any;
        if (parseFloat(el.value) > parseFloat(el.max)) {
            el.setAttribute("style", "color:red; border: 1px solid red;");
            // const error = document.createElement("small").innerText("You want to allocate more than the availability");
            // el.append(error);
            // inputError = "You have allocated more than the availability";
        } else {
            el.setAttribute("style", "color:black; border: none;");
        }

    }

    const retrieveAllocations = async (e: any) => {
        e.preventDefault();
        const inputFields = document.querySelectorAll('input[name="allocateQuantity"]');
        let allocations: Object[] = [];
        if (selectedType !== "" && selectedType !== undefined) {
            Array.from(inputFields).forEach((el: any) => {
                if (el.value !== "") {
                    const value = el.value;
                    const agreementlineId = el.getAttribute("data-agreementlineid");
                    const agreementId = el.getAttribute("data-agreementid");
                    const allocation = {
                        agreementlineId: agreementlineId,
                        agreementId: agreementId,
                        value: value
                    }
                    allocations = [...allocations, allocation]
                    setTotal(0);
                }
                el.value = "";
            });
            await appLogic.setAllocations(allocations, selectedType!);
            statusSetter();
            setMessage({ success: "Allocation successful!" })
            updateResults([]);
        } else {
            throw ("Type not selected")
        }
    }

    return (
        <Stack tokens={stackTokens}>
            <h2>Results</h2>
            <div style={{ 'maxHeight': '1000px' }}>
                <DetailsList
                    items={results}
                    setKey="set"
                    checkButtonAriaLabel="Row"
                    checkboxVisibility={2}
                    compact={true}
                    layoutMode={DetailsListLayoutMode.fixedColumns}
                    columns={getColumns()}
                />
            </div>
            <Stack horizontal tokens={stackItemTokens} wrap={true}>
                <Stack.Item grow={1}>
                    <div>Total quantity remaining: {(agreementline.dpcomm_allocationquantityavailable - total).toString()}</div>
                    {total > agreementline.dpcomm_allocationquantityavailable && <div className="allocation-error" style={{ "color": "red" }}>You have allocated too much!</div>}
                    <form onSubmit={retrieveAllocations}>
                        <Dropdown
                            options={[
                                { text: 'Direct', key: '222860000' },
                                { text: 'Inventory', key: '222860001' }
                            ]}
                            required={true}
                            label="Allocation type"
                            placeholder="Select allocation type..."
                            onChange={(e, selectedOption: any) => {
                                setSelectedType(selectedOption?.key)
                            }}
                        />
                        <PrimaryButton
                            text="Submit"
                            type="submit"
                            disabled={total > agreementline.dpcomm_allocationquantityavailable || selectedType === "" || selectedType === undefined && true}
                        />
                        {messages!.success!.length > 0 && <div>{messages.success}</div>}
                    </form>
                </Stack.Item>
            </Stack>
        </Stack>

    )
}

export default FilterResults
