import React, { useContext, useState } from 'react'
import { ComboBox, IComboBoxOption } from '@fluentui/react/lib/ComboBox';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack'
import { stackTokens, stackItemTokens } from '../globals/stackTokens';
import { agreementLineControlSettings } from '../agreementLineControlSettings';
import { AgreementlineContext } from '../contexts/AgreementContext';
import { Formik, Form, Field } from 'formik';
import { useFilterContext } from '../contexts/FilterContext';
import { Dropdown } from '@fluentui/react/lib/Dropdown';

const Filters = () => {
    let prodDimOptions = [[]];
    let prodAccountsOptions: IComboBoxOption[] = [];
    let allProdAccountsOptions: IComboBoxOption[] = [];
    const { filters, update } = useFilterContext();
    const agreementline: any = useContext(AgreementlineContext);

    const getFromDate = (inputDate: Date | undefined | null) => {
        const tzoffset = (new Date()).getTimezoneOffset() * -60000; //offset in milliseconds
        const localISOTime = (new Date(new Date(inputDate as any - tzoffset))).toISOString().slice(0, -1);
        return localISOTime;
    }

    const getToDate = (inputDate: Date | undefined | null) => {
        const tzoffset = (new Date()).getTimezoneOffset() * -60000; //offset in milliseconds
        const addDay = 60 * 60 * 24 * 1000 - 1;
        const localISOTime = (new Date(new Date(inputDate as any - tzoffset + addDay))).toISOString().slice(0, -1);
        return localISOTime;
    }

    if (agreementline.dimensions) {
        agreementline.dimensions.forEach((dimension: any, i: number) => {
            prodDimOptions[i] = dimension.entities.map((dimension: any) => {
                return { key: dimension["_dpcore_productdimensionid_value"], value: dimension["_dpcore_productdimensionid_value"], text: dimension["_dpcore_productdimensionid_value@OData.Community.Display.V1.FormattedValue"] }
            })
            prodDimOptions[i].unshift({ key: "", value: "", text: "All" } as never)
        });
    }

    if (agreementline.prodAccounts) {
        allProdAccountsOptions = agreementline.prodAccounts.entities.filter((prodAccount: any) => {
            return prodAccount.dpcomm_direction !== agreementline.direction[0];
        }).map((prodAccount: any) => {
            return { key: prodAccount.dpcomm_productaccountcombinationid, value: prodAccount.dpcomm_productaccountcombinationid, text: prodAccount.dpcomm_name }
        })

        prodAccountsOptions = agreementline.prodAccounts.entities.filter((prodAccount: any) => prodAccount._dpcomm_accountid_value === agreementline._dpcomm_accountid_value && prodAccount.dpcomm_direction === agreementline.direction[0])
        .map((prodAccount: any) => {
            return { key: prodAccount.dpcomm_productaccountcombinationid, value: prodAccount.dpcomm_productaccountcombinationid, text: prodAccount.dpcomm_name }
        })
        allProdAccountsOptions.unshift({ key: "", value: "", text: "All" } as any);
        prodAccountsOptions.unshift({ key: "", value: "", text: "All" } as any);
    }

    const filterFieldsData = {
        productAccount: agreementline._dpcomm_productaccountcombinationid_value || "",
        dimension1: agreementline._dpcomm_proddim1id_value || "",
        dimension2: agreementline._dpcomm_proddim2id_value || "",
        dimension3: agreementline._dpcomm_proddim3id_value || "",
        dimension4: agreementline._dpcomm_proddim4id_value || "",
        // fromDate:getFromDate(new Date(agreemenine.dpcomm_fromdate)) || "",
        // toDate: agreementline.dpcomm_todate || "",
        fromDate: agreementline.dpcomm_fromdate || "",
        toDate: agreementline.dpcomm_todate || "",
        direction: agreementline.direction[0] || ""
    }

    type FilterData = typeof filterFieldsData;

    const [selectedKey, setSelectedKey] = useState(filterFieldsData);

    const buildFilterQuery = () => {
        const filterObject = {...selectedKey, direction: agreementline.direction[0]}
        update(filterObject);
    }

    return (
        <Stack tokens={stackTokens}>

            <h2>Filters</h2>
            <Formik
                initialValues={filterFieldsData}
                enableReinitialize={true}
                onSubmit={buildFilterQuery}
            >
                <Form>
                    <div className="ms-Grid" dir="ltr">
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                                <Field name="productAccount">
                                    {(fieldprops: any) => {
                                        return <ComboBox
                                            // {...fieldprops}
                                            label="Product account"
                                            placeholder="Select product account..."
                                            allowFreeform
                                            autoComplete="on"
                                            options={selectedKey.direction === agreementline.direction[0] ? prodAccountsOptions : allProdAccountsOptions}
                                            // onResolveOptions={getOptions}
                                            selectedKey={selectedKey.productAccount}
                                            onChange={(e, selectedOption: any) => {
                                                if (selectedOption && selectedOption.value.length > 0) {
                                                    try {
                                                        agreementline.prodAccounts.entities.filter((prodAccount: any) => {
                                                            if (selectedOption.value === prodAccount.dpcomm_productaccountcombinationid) {
                                                                setSelectedKey({
                                                                    ...selectedKey,
                                                                    productAccount: selectedOption.value,
                                                                    dimension1: prodAccount._dpcomm_proddim1id_value || "",
                                                                    dimension2: prodAccount._dpcomm_proddim2id_value || "",
                                                                    dimension3: prodAccount._dpcomm_proddim3id_value || "",
                                                                    dimension4: prodAccount._dpcomm_proddim4id_value || ""
                                                                })
                                                            }
                                                        })
                                                    } catch (e) {
                                                        console.log(e);
                                                    }

                                                } else {
                                                    setSelectedKey({ ...selectedKey, productAccount: "" })
                                                }
                                            }}
                                        />
                                    }}
                                </Field>
                            </div>
                            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                                <Field name="direction">
                                    {(fieldprops: any) => {
                                        return <Dropdown
                                            label="Product account direction"
                                            placeholder="Select product account direction..."
                                            options={[{ key: 1, text: 'Buy' }, { key: 2, text: 'Sell' }]}
                                            selectedKey={selectedKey.direction}
                                            onChange={(e, selectedOption: any) => {
                                                console.log(selectedOption);
                                                if (selectedOption) {
                                                    setSelectedKey({ ...selectedKey, direction: selectedOption.key })
                                                    console.log(selectedKey);
                                                }
                                            }}
                                        />
                                    }}
                                </Field>

                            </div>
                        </div>
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                                <Field name="dim1">
                                    {(fieldprops: any) => {
                                        return <ComboBox
                                            label={agreementLineControlSettings.dim_1_label !== "" ? agreementLineControlSettings.dim_1_label : "Dimension 1"}
                                            placeholder={`Select ${agreementLineControlSettings.dim_1_label !== "" ? agreementLineControlSettings.dim_1_label : "Dimension 1"}...`}
                                            allowFreeform
                                            autoComplete="on"
                                            options={prodDimOptions[0]}
                                            selectedKey={selectedKey.dimension1}
                                            onChange={(e, selectedOption: any) => {
                                                if (selectedOption && selectedOption.value.length > 0) {
                                                    setSelectedKey({ ...selectedKey, dimension1: selectedOption.value })
                                                } else {
                                                    setSelectedKey({ ...selectedKey, dimension1: "" })
                                                }
                                            }}
                                        />
                                    }}
                                </Field>
                            </div>
                            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                                <Field name="dim3">
                                    {(fieldprops: any) => {
                                        return <ComboBox
                                            label={agreementLineControlSettings.dim_3_label !== "" ? agreementLineControlSettings.dim_3_label : "Dimension 3"}
                                            placeholder={`Select ${agreementLineControlSettings.dim_3_label !== "" ? agreementLineControlSettings.dim_3_label : "Dimension 3"}...`}
                                            allowFreeform
                                            autoComplete="on"
                                            options={prodDimOptions[2]}
                                            selectedKey={selectedKey.dimension3}
                                            onChange={(e, selectedOption: any) => {
                                                if (selectedOption && selectedOption.value.length > 0) {
                                                    setSelectedKey({ ...selectedKey, dimension3: selectedOption.value })
                                                } else {
                                                    setSelectedKey({ ...selectedKey, dimension3: "" })
                                                }
                                            }}
                                        />
                                    }}
                                </Field>
                            </div>
                        </div>
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                                <Field name="dim2">
                                    {(fieldprops: any) => {
                                        return <ComboBox
                                            label={agreementLineControlSettings.dim_2_label !== "" ? agreementLineControlSettings.dim_2_label : "Dimension 2"}
                                            placeholder={`Select ${agreementLineControlSettings.dim_2_label !== "" ? agreementLineControlSettings.dim_2_label : "Dimension 2"}...`}
                                            allowFreeform
                                            autoComplete="on"
                                            options={prodDimOptions[1]}
                                            selectedKey={selectedKey.dimension2}
                                            onChange={(e, selectedOption: any) => {
                                                if (selectedOption && selectedOption.value.length > 0) {
                                                    setSelectedKey({ ...selectedKey, dimension2: selectedOption.value })
                                                } else {
                                                    setSelectedKey({ ...selectedKey, dimension2: "" })
                                                }
                                            }}
                                        />
                                    }}
                                </Field>
                            </div>
                            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                                <Field name="dim4">
                                    {(fieldprops: any) => {
                                        return <ComboBox
                                            label={agreementLineControlSettings.dim_4_label !== "" ? agreementLineControlSettings.dim_4_label : "Dimension 4"}
                                            placeholder={`Select ${agreementLineControlSettings.dim_4_label !== "" ? agreementLineControlSettings.dim_4_label : "Dimension 4"}...`}
                                            allowFreeform
                                            autoComplete="on"
                                            options={prodDimOptions[3]}
                                            selectedKey={selectedKey.dimension4}
                                            onChange={(e, selectedOption: any) => {
                                                if (selectedOption && selectedOption.value.length > 0) {
                                                    setSelectedKey({ ...selectedKey, dimension4: selectedOption.value })
                                                } else {
                                                    setSelectedKey({ ...selectedKey, dimension4: "" })
                                                }
                                            }}
                                        />
                                    }}
                                </Field>
                            </div>
                        </div>
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                                <Field name="fromDate">
                                    {(fieldprops: any) => {
                                        return <DatePicker
                                            placeholder="Select a date..."
                                            ariaLabel="Select a date"
                                            label="From date"
                                            value={filters.fromDate !== "" ? new Date(filters.fromDate) : new Date(filterFieldsData.fromDate)}
                                            onSelectDate={(e) => {
                                                // const selectedDate = (new Date(new Date(e as any - ((new Date()).getTimezoneOffset() * 60000)))).toISOString().slice(0, -1);
                                                // setSelectedKey({ ...selectedKey, fromDate: selectedDate })
                                                console.log(new Date(e as any));
                                                console.log(new Date(e as any).toUTCString());
                                                console.log(new Date(e as any).toISOString());
                                                console.log(new Date(e as any).toDateString());
                                                console.log(new Date(e as any).toLocaleDateString());
                                                setSelectedKey({ ...selectedKey, fromDate: new Date(e as any).toDateString() })
                                            }}
                                        />
                                    }}
                                </Field>
                            </div>
                            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                                <Field name="toDate">
                                    {(fieldprops: any) => {
                                        return <DatePicker
                                            placeholder="Select a date..."
                                            ariaLabel="Select a date"
                                            label="To date"
                                            minDate={new Date(selectedKey.fromDate)}
                                            value={filters.toDate ? new Date(filters.toDate) : new Date(filterFieldsData.toDate)}
                                            onSelectDate={(e) => {
                                                // const selectedDate = (new Date(new Date(e as any - ((new Date()).getTimezoneOffset() * -60000 - (60 * 60 * 24 * 1000 - 1))))).toISOString().slice(0, -1)
                                                console.log(new Date(e as any));
                                                console.log(new Date(e as any).toUTCString());
                                                console.log(new Date(e as any).toISOString());
                                                console.log(new Date(e as any).toDateString());
                                                console.log(new Date(e as any).toLocaleDateString());
                                                setSelectedKey({ ...selectedKey, toDate: new Date(e as any).toDateString() })
                                            }}
                                        />
                                    }}
                                </Field>
                            </div>
                        </div>
                    </div>

                    <Stack tokens={stackTokens} horizontalAlign="center">
                        <PrimaryButton text="Filter results" type="submit" />
                    </Stack>
                </Form>
            </Formik>
        </Stack>

    )
}

export default Filters
