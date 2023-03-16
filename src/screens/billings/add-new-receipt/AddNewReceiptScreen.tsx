import "./AddNewReceiptScreen.scss";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import {APIConfig, ImageConfig, Misc, Patterns} from "../../../constants";
import {ITableColumn} from "../../../shared/models/table.model";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers, FormikProps} from "formik";
import * as Yup from "yup";
import {IAPIResponseType} from "../../../shared/models/api.model";
import TableComponent from "../../../shared/components/table/TableComponent";
import _ from "lodash";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormDebuggerComponent from "../../../shared/components/form-debugger/FormDebuggerComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormikAutoCompleteComponent
    from "../../../shared/components/form-controls/formik-auto-complete/FormikAutoCompleteComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import {RadioButtonComponent} from "../../../shared/components/form-controls/radio-button/RadioButtonComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {IRootReducerState} from "../../../store/reducers";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import SelectComponent from "../../../shared/components/form-controls/select/SelectComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import EditBillingAddressComponent from "../edit-billing-address/EditBillingAddressComponent";

interface AddNewReceiptScreenProps {

}

const ProductValidationSchema = Yup.object({
    product_id: Yup.mixed().required("Product is required"),
    quantity: Yup.mixed().required("Product is required"),
    units: Yup.number().min(1).required().when("quantity", {
        is: (value: number) => value > 0,
        then: Yup.number().min(1).max(Yup.ref('quantity'), 'Unit').required(""),
    }),
});

const AddNewReceiptFormValidationSchema = Yup.object({
    products: Yup.array().of(
        ProductValidationSchema
    ),
    total: Yup.number().min(1).required("Amount is required"),
    // discount: Yup.number().min(1).max(100).nullable(),
    discount: Yup.mixed().nullable().when("total", {
        is: (value: number) => value > 0,
        then: Yup.number().max(Yup.ref('total'), 'Invalid Discount Amount')
            .nullable(true)
            // checking self-equality works for NaN, transforming it to null
            .transform((_, val) => val ? Number(val) : null),
        otherwise: Yup.number()
            .nullable(true)
            // checking self-equality works for NaN, transforming it to null
            .transform((_, val) => val ? Number(val) : null),
    }),
    // discount_amount: Yup.mixed().nullable(),
    client_id: Yup.string().required("Client is required"),
    provider_id: Yup.string().required("Provider is required"),
    comments: Yup.string().nullable().max(200, "Comments cannot be more than 200 characters"),
});

const ProductRow = {
    key: undefined,
    product: undefined,
    product_id: undefined,
    amount: undefined,
    units: undefined,
    quantity: undefined
}

const AddNewReceiptFormInitialValues = {
    products: [
        {
            ...ProductRow,
            key: CommonService.getUUID(),
        }
    ]
}

const AddNewReceiptScreen = (props: AddNewReceiptScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const formRef = useRef<FormikProps<any>>(null);
    const [clientListSearch, setClientListSearch] = useState<string>("");
    const [clientList, setClientList] = useState<any>([]);
    const [isClientListLoading, setIsClientListLoading] = useState<any>(false);
    const [providerListSearch, setProviderListSearch] = useState<string>("");
    const [providerList, setProviderList] = useState<any>([]);
    const [isProviderListLoading, setIsProviderListLoading] = useState<any>(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [isClientBillingAddressLoading, setIsClientBillingAddressLoading] = useState<boolean>(false);
    const [selectedClientBillingAddress, setSelectedClientBillingAddress] = useState<any>(null);
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [isClientSelectionDrawerOpened, setIsClientSelectionDrawerOpened] = useState<boolean>(false);
    const [isProviderSelectionDrawerOpened, setIsProviderSelectionDrawerOpened] = useState<boolean>(false);
    const {name, address, city, state, zip, phone_number} = Misc.COMPANY_BILLING_ADDRESS;
    const [addNewReceiptFormInitialValues, setAddNewReceiptFormFormInitialValues] = useState<any>(_.cloneDeep(AddNewReceiptFormInitialValues));
    const [isClientBillingAddressDrawerOpened, setIsClientBillingAddressDrawerOpened] = useState<boolean>(false);
    const [selectedPaymentMode, setSelectedPaymentMode] = useState<string | undefined>(undefined);
    const [isPaymentModeModalOpen, setIsPaymentModeModalOpen] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);

    const {
        paymentModes
    } = useSelector((state: IRootReducerState) => state.staticData);

    useEffect(() => {
        dispatch(setCurrentNavParams("Add New Receipt", null, () => {
            navigate(CommonService._routeConfig.BillingList());
        }));
    }, [navigate, dispatch]);

    const productListTableColumns: ITableColumn[] = useMemo<ITableColumn[]>(() => [
        {
            title: "S.No",
            dataIndex: "sno",
            key: "sno",
            width: 80,
            align: 'center',
            render: (record: any, index: number) => {
                return index + 1;
            }
        },
        {
            title: "Item(s)",
            dataIndex: "item",
            key: "item",
            width: 550,
            render: (record: any, index: number) => <Field name={`products[${index}].product`}
                                                           className="t-form-control">
                {
                    (field: FieldProps) => {
                        const quantity = _.get(field.form?.values, `products[${index}].quantity`);
                        const units = _.get(field.form?.values, `products[${index}].units`);
                        const selectedProducts = _.get(field.form?.values, `products`).map((item: any) => item.product);
                        const showAvailableQuantity = (quantity !== undefined && (units === undefined || units === '' || units === null || units === 0 || isNaN(units)));
                        return <>
                            <FormikAutoCompleteComponent
                                required={true}
                                url={APIConfig.GET_INVENTORY_LIST_LITE.URL}
                                method={APIConfig.GET_INVENTORY_LIST_LITE.METHOD}
                                searchMode={"serverSide"}
                                formikField={field}
                                size={"small"}
                                // fullWidth={true}
                                filteredOptionKey={"_id"}
                                filteredOptions={selectedProducts}
                                displayWith={(item: any) => item?.name || ''}
                                onUpdate={(item: any) => {
                                    field.form.setFieldValue(`products[${index}].product_id`, item._id);
                                    field.form.setFieldValue(`products[${index}].rate`, item.price);
                                    field.form.setFieldValue(`products[${index}].quantity`, item.quantity);
                                    field.form.setFieldValue(`products[${index}].units`, 0);
                                }}
                            />
                            <span
                                className={`product-available-quantity
                                ${showAvailableQuantity ? "visibility-visible" : "visibility-hidden"}
                                ${quantity > 0 ? "text-primary" : "text-error"}`
                                }>Available Stock: {quantity > 0 ? quantity : 0} unit(s)
                            </span>
                        </>
                    }
                }
            </Field>
        },
        {
            title: "Units",
            dataIndex: "units",
            key: "units",
            width: 70,
            render: (record: any, index: number) => <Field name={`products[${index}].units`} className="t-form-control">
                {
                    (field: FieldProps) => (
                        <>
                            {
                                (field.form.values?.products?.[index]?.quantity !== undefined && field.form.values?.products?.[index]?.quantity !== null && field.form.values?.products?.[index]?.quantity > 0) ?
                                    <FormikInputComponent
                                        required={true}
                                        formikField={field}
                                        size={"small"}
                                        type={"number"}
                                        disabled={!field.form.values?.products?.[index]?.product_id}
                                        validationPattern={Patterns.POSITIVE_WHOLE_NUMBERS}
                                        onChange={(value: any) => {
                                                field.form.setFieldValue(`products[${index}].amount`, field.form.values?.products?.[index]?.rate * value);
                                        }
                                        }
                                    /> : "-"
                            }
                        </>
                    )
                }
            </Field>
        },
        {
            title: "Rate",
            dataIndex: "rate",
            key: "rate",
            width: 70,
            render: (record: any, index: number) => <Field name={`products[${index}].units`} className="t-form-control">
                {
                    (field: FieldProps) => (
                        <>
                            {field.form.values?.products?.[index]?.rate ? <> {Misc.CURRENCY_SYMBOL} {field.form.values?.products?.[index]?.rate || "-"} </> : "-"}
                        </>
                    )
                }
            </Field>
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            width: 70,
            render: (record: any, index: number) => <Field name={`products[${index}].units`} className="t-form-control">
                {
                    (field: FieldProps) => (
                        <>
                            <>{Misc.CURRENCY_SYMBOL} {(field.form.values?.products?.[index]?.amount || 0)}</>
                        </>
                    )
                }
            </Field>
        },
        {
            title: "",
            dataIndex: "actions",
            key: "actions",
            width: 70,
            render: (record: any, index: number) => <Field name={`products[${index}].units`} className="t-form-control">
                {
                    (field: FieldProps) => (
                        <IconButtonComponent
                            disabled={field.form.values?.products?.length === 1}
                            onClick={() => {
                                setAddNewReceiptFormFormInitialValues((prev: any) => ({
                                    ...prev,
                                    products: prev.products.filter((_: any, i: number) => i !== index)
                                }));
                            }
                            }>
                            <ImageConfig.CircleCancel/>
                        </IconButtonComponent>
                    )
                }
            </Field>
        }
    ], []);

    const getClientList = useCallback(() => {
        setIsClientListLoading(true);
        // setIsClientListLoaded(false);
        // setIsClientListLoadingFailed(false);
        CommonService._client.ClientListLiteAPICall({search: clientListSearch})
            .then((response: any) => {
                setClientList(response.data);
                setIsClientListLoading(false);
                // setIsClientListLoaded(true);
                // setIsClientListLoadingFailed(false);
            }).catch((error: any) => {
            setClientList(false);
            // setIsClientListLoaded(false);
            // setIsClientListLoadingFailed(true);
        })
    }, [clientListSearch]);

    const getProviderList = useCallback(() => {
        setIsProviderListLoading(true);
        // setIsProviderListLoaded(false);
        // setIsProviderListLoadingFailed(false);
        CommonService._user.getUserListLite({search: providerListSearch, role: 'provider'})
            .then((response: any) => {
                setProviderList(response.data);
                setIsProviderListLoading(false);
                // setIsProviderListLoaded(true);
                // setIsProviderListLoadingFailed(false);
            }).catch((error: any) => {
            setProviderList(false);
            // setIsProviderListLoaded(false);
            // setIsProviderListLoadingFailed(true);
        })
    }, [providerListSearch]);

    const clientListColumns: ITableColumn[] = useMemo<ITableColumn[]>(() => [
        {
            key: "name",
            dataIndex: "name",
            render: (item: any) => {
                return <RadioButtonComponent name={'selected-client'}
                                             value={item}
                                             label={CommonService.extractName(item)}
                                             checked={selectedClient?._id === item?._id}
                                             onChange={(value: any) => {
                                                 formRef?.current?.setFieldValue('client_id', value._id);
                                                 setSelectedClient(value);
                                             }}/>
            }
        }
    ], [selectedClient]);

    const providerListColumns: ITableColumn[] = useMemo<ITableColumn[]>(() => [
        {
            key: "name",
            dataIndex: "name",
            render: (item: any) => {
                return <RadioButtonComponent name={'selected-provider'}
                                             value={item}
                                             label={CommonService.extractName(item)}
                                             checked={selectedProvider?._id === item?._id}
                                             onChange={(value: any) => {
                                                 setSelectedProvider(value);
                                                 formRef?.current?.setFieldValue('provider_id', value._id);
                                             }}/>
            }
        }
    ], [selectedProvider]);

    const getClientBillingAddress = useCallback(() => {
        setIsClientBillingAddressLoading(true);
        let billingAddress: any = undefined;
        console.log(selectedClient);
        CommonService._client.GetClientBillingAddress(selectedClient?._id)
            .then((response: any) => {
                if (response?.data) {
                    billingAddress = response?.data;
                }
                setSelectedClientBillingAddress(billingAddress);
                setIsClientBillingAddressLoading(false);
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors || "Failed to fetch client billing address", "error");
                setSelectedClientBillingAddress(billingAddress);
                setIsClientBillingAddressLoading(false);
            });
    }, [selectedClient]);

    const openClientSelectionDrawer = useCallback(() => {
        setIsClientSelectionDrawerOpened(true);
    }, []);

    const closeClientSelectionDrawer = useCallback(() => {
        setIsClientSelectionDrawerOpened(false);
    }, []);

    const confirmClientSelection = useCallback(() => {
        closeClientSelectionDrawer();
        getClientBillingAddress();
    }, [getClientBillingAddress, closeClientSelectionDrawer]);

    const openProviderSelectionDrawer = useCallback(() => {
        setIsProviderSelectionDrawerOpened(true);
    }, []);

    const closeProviderSelectionDrawer = useCallback(() => {
        setIsProviderSelectionDrawerOpened(false);
    }, []);

    const openBillingAddressFormDrawer = useCallback(() => {
        setIsClientBillingAddressDrawerOpened(true);
    }, []);

    const closeBillingAddressFormDrawer = useCallback(() => {
        setIsClientBillingAddressDrawerOpened(false);
    }, []);

    const openPaymentModeModal = useCallback(() => {
        setIsPaymentModeModalOpen(true);
    }, []);

    const closePaymentModeModal = useCallback(() => {
        setIsPaymentModeModalOpen(false);
        setSelectedPaymentMode(undefined);
    }, []);

    const onSubmit = useCallback((values: any, {setSubmitting}: FormikHelpers<any>) => {
        setSubmitting(false);
        openPaymentModeModal()
    }, [openPaymentModeModal]);

    const handleAddReceiptConfirm = useCallback(() => {
        closePaymentModeModal();
        const values = formRef?.current?.values;
        const setSubmitting = formRef?.current?.setSubmitting;
        const setErrors = formRef?.current?.setErrors;
        setSubmitting && setSubmitting(true);
        const discount = isNaN(values?.discount) ? 0 : values.discount;
        const payload = {
            ...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['product', 'key']),
            discount,
            payable_amount: total - discount,
            payment_mode: selectedPaymentMode,
        }
        CommonService._billingsService.AddNewReceiptAPICall(payload)
            .then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setSubmitting && setSubmitting(false);
                navigate(CommonService._routeConfig.BillingList() + '?activeTab=completedPayments');
            })
            .catch((error: any) => {
                setErrors && CommonService.handleErrors(setErrors, error);
                setSubmitting && setSubmitting(false);
            })
    }, [closePaymentModeModal, total, navigate, selectedPaymentMode]);

    const handleAddReceiptCancel = useCallback(() => {
        CommonService.onConfirm(
            {
                confirmationTitle: "DISCARD RECEIPT",
                image: ImageConfig.RemoveImage,
                confirmationSubTitle: `Are you sure you do not wish to generate an receipt, as it will be deleted?"?`
            }
        )
            .then((result: any) => {
                navigate(CommonService._routeConfig.BillingList());
            });
    }, [navigate]);

    useEffect(() => {
        let totalAmount = 0;
        if (formRef.current?.values?.products){
            totalAmount = formRef.current?.values?.products?.reduce((acc: number, curr: any) => {
                return (curr.rate && curr.units) ? acc + (parseInt(curr?.rate) * parseInt(curr?.units)) : acc;
            }, 0);
        } else {
            totalAmount = 0;
        }
        formRef.current?.setFieldValue('total', totalAmount);
        formRef.current?.setFieldTouched('discount');
        setTotal(totalAmount);
    }, [formRef.current?.values?.products]);

    const handleEditBillingAddress = useCallback((values: any) => {
        setSelectedClientBillingAddress(values);
        closeBillingAddressFormDrawer();
    }, [closeBillingAddressFormDrawer]);

    return (
        <div className={'add-new-receipt-screen'}>
            <PageHeaderComponent title={'Add Receipt'}/>
            <Formik
                validationSchema={AddNewReceiptFormValidationSchema}
                initialValues={addNewReceiptFormInitialValues}
                validateOnChange={false}
                validateOnBlur={true}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={onSubmit}
                innerRef={formRef}
            >
                {(formik) => {
                    const {values, validateForm, isValid, isSubmitting} = formik;
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                        setAddNewReceiptFormFormInitialValues(values);
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            <FormDebuggerComponent
                                form={formik}
                                canShow={false}
                                showDebugger={false}/>
                            <div className="t-form-controls">
                                <div>
                                    <div
                                        className={"d-flex justify-content-space-between align-items-center mrg-bottom-20"}>
                                        <div>
                                            <img src={ImageConfig.BillingLogo} alt=""/>
                                        </div>
                                        <div>
                                            {CommonService.convertDateFormat2(new Date(), "DD MMM YYYY | hh:mm A")}
                                        </div>
                                    </div>
                                    <HorizontalLineComponent/>
                                    <div className={"billing-address-wrapper"}>
                                        <div className={"billing-address-block from"}>
                                            <div className={"billing-address-block__header"}>
                                                <div className={"billing-address-block__title"}>Billing From</div>
                                            </div>
                                            <div className={"billing-address-block__details"}>
                                                <div className={"billing-address-block__detail__row name"}>{name}</div>
                                                <div className={"billing-address-block__detail__row"}> {address} </div>
                                                <div className={"billing-address-block__detail__row"}>
                                                    <span> {city} </span>, <span>{state}</span>&nbsp;<span>{zip}</span>
                                                </div>
                                                <div
                                                    className={"billing-address-block__detail__row"}> {phone_number} </div>
                                            </div>
                                        </div>
                                        <div className={"billing-address-block to"}>
                                            <div className={"billing-address-block__header"}>
                                                <div className={"billing-address-block__title"}>Billing To</div>
                                                &nbsp;&nbsp;
                                                {selectedClientBillingAddress &&
                                                    <LinkComponent onClick={openBillingAddressFormDrawer}>
                                                        (Edit Billing To)
                                                    </LinkComponent>}
                                            </div>
                                            <div className={"billing-address-block__details"}>
                                                {
                                                    !selectedClientBillingAddress && <>
                                                        <div className={"billing-address-block__detail__row"}> -</div>
                                                        <div className={"billing-address-block__detail__row"}> -</div>
                                                    </>
                                                }
                                                {
                                                    (selectedClientBillingAddress && !isClientBillingAddressLoading) && <>
                                                        <div
                                                            className={"billing-address-block__detail__row name"}>
                                                            {selectedClientBillingAddress?.name}
                                                        </div>
                                                        <div
                                                            className={"billing-address-block__detail__row"}> {selectedClientBillingAddress.address_line} </div>
                                                        <div className={"billing-address-block__detail__row"}>
                                                            <span>  {selectedClientBillingAddress?.city} </span>, <span> {selectedClientBillingAddress?.state} </span>&nbsp;
                                                            <span>  {selectedClientBillingAddress?.zip_code} </span>
                                                        </div>
                                                        <div
                                                            className={"billing-address-block__detail__row"}>  {selectedClientBillingAddress?.phone || '-'} </div>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <CardComponent title={"Client Details"}
                                                   actions={<>
                                                       {
                                                           selectedClient && <ButtonComponent
                                                               prefixIcon={<ImageConfig.EditIcon/>}
                                                               onClick={openClientSelectionDrawer}
                                                           >
                                                               Edit
                                                           </ButtonComponent>
                                                       }
                                                   </>}>
                                        {
                                            !selectedClient && <div className="h-v-center">
                                                <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}
                                                                 onClick={openClientSelectionDrawer}
                                                >
                                                    Add Client
                                                </ButtonComponent>
                                            </div>
                                        }
                                        {
                                            selectedClient && <>
                                                <div className="ts-row">
                                                    <div className="ts-col-lg-3">
                                                        <DataLabelValueComponent label={"First Name"}>
                                                            {selectedClient?.first_name}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className="ts-col-lg-3">
                                                        <DataLabelValueComponent label={"Last Name"}>
                                                            {selectedClient?.last_name}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className="ts-col-lg-3">
                                                        <DataLabelValueComponent label={"Phone Number"}>
                                                            {selectedClient?.primary_contact_info?.phone || '-'}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className="ts-col-lg-3">
                                                        <DataLabelValueComponent label={"Email"}>
                                                            {selectedClient?.primary_email || '-'}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </CardComponent>
                                    <CardComponent title={"Provider Details"}
                                                   actions={<>
                                                       {
                                                           selectedProvider && <ButtonComponent
                                                               prefixIcon={<ImageConfig.EditIcon/>}
                                                               onClick={openProviderSelectionDrawer}
                                                           >
                                                               Edit
                                                           </ButtonComponent>
                                                       }
                                                   </>}
                                    >
                                        {
                                            !selectedProvider && <div className="h-v-center">
                                                <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}
                                                                 onClick={openProviderSelectionDrawer}
                                                >
                                                    Add Provider
                                                </ButtonComponent>
                                            </div>
                                        }
                                        {
                                            selectedProvider && <>
                                                <div className="ts-row">
                                                    <div className="ts-col-lg-3">
                                                        <DataLabelValueComponent label={"Provider Name"}>
                                                            {selectedProvider?.first_name} {selectedProvider?.last_name}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className="ts-col-lg-3">
                                                        <DataLabelValueComponent label={"NPI Number"}>
                                                            {selectedProvider?.npi_number || 'N/A'}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className="ts-col-lg-3">
                                                        <DataLabelValueComponent label={"License Number"}>
                                                            {selectedProvider?.license_number || 'N/A'}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </CardComponent>
                                    <div className="products-block">
                                        <div className="products-block-wrapper">
                                            <TableComponent columns={productListTableColumns}
                                                            data={addNewReceiptFormInitialValues.products}/>
                                            <div className={'products-block-add-more'}>
                                                <ButtonComponent
                                                    variant={"text"}
                                                    prefixIcon={<ImageConfig.AddIcon/>}
                                                    disabled={!ProductValidationSchema.isValidSync(values?.products[values.products.length - 1])}
                                                    onClick={() => {
                                                        setAddNewReceiptFormFormInitialValues((prev: any) => ({
                                                            ...prev,
                                                            products: [...prev.products, {
                                                                ..._.cloneDeep(ProductRow),
                                                                key: CommonService.getUUID(),
                                                            }]
                                                        }));
                                                    }}
                                                >
                                                    Add More
                                                </ButtonComponent>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="clear-fix"/>
                                    <div className={'add-new-receipt__comments__payment__block__wrapper'}>
                                        <div className="ts-row">
                                            <div className="ts-col-lg-6">
                                                <Field name={`comments`} className="t-form-control">
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikTextAreaComponent
                                                                label={"Comments"}
                                                                fullWidth={true}
                                                                formikField={field}
                                                                size={"small"}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                            <div className="ts-col-lg-6">
                                                <div className="add-new-receipt__payment__block">
                                                    <div className="add-new-receipt__payment__block__row">
                                                        <div
                                                            className="add-new-receipt__payment__block__row__title">Subtotal
                                                            (Inc. Tax)
                                                        </div>
                                                        <div
                                                            className="add-new-receipt__payment__block__row__value">
                                                            {Misc.CURRENCY_SYMBOL} {total}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Field name={`discount`} className="t-form-control">
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikInputComponent
                                                                        label="Discount"
                                                                        fullWidth={true}
                                                                        type={"number"}
                                                                        max={total}
                                                                        formikField={field}
                                                                        disabled={!(total > 0)}
                                                                        validationPattern={Patterns.POSITIVE_WHOLE_NUMBERS}
                                                                        prefix={Misc.CURRENCY_SYMBOL}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    </div>
                                                    <div className="add-new-receipt__payment__block__row grand">
                                                        <div className="add-new-receipt__payment__block__row__title">
                                                            Grand Total (Inc. Tax)
                                                        </div>
                                                        <div
                                                            className="add-new-receipt__payment__block__row__value">{Misc.CURRENCY_SYMBOL}
                                                            {
                                                                total - (addNewReceiptFormInitialValues.discount ? parseInt(addNewReceiptFormInitialValues.discount) : 0)
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="t-form-actions">
                                        <ButtonComponent variant={"outlined"}
                                                         onClick={handleAddReceiptCancel}
                                        >
                                            Cancel
                                        </ButtonComponent>&nbsp;&nbsp;
                                        <ButtonComponent
                                            type="submit"
                                            disabled={isSubmitting || !isValid}
                                            isLoading={isSubmitting}
                                        >
                                            Generate Receipt
                                        </ButtonComponent>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
            <DrawerComponent isOpen={isClientSelectionDrawerOpened}
                             closeOnBackDropClick={false}
                             closeOnEsc={false}
                             onClose={closeClientSelectionDrawer}
                             showClose={true}
            >
                <div className={'client-search-table-wrapper'}>
                    <PageHeaderComponent title={'Add Client'}/>
                    <SearchComponent label={'Search for Clients'}
                                     value={clientListSearch}
                                     placeholder={'Search for Clients'}
                                     onSearchChange={(value) => {
                                         setClientListSearch(value);
                                         getClientList();
                                     }}
                    />
                    {
                        clientListSearch &&
                        <>
                            <div className={'client-list-heading'}>Client List</div>
                            <TableComponent data={clientList} columns={clientListColumns}
                                            loading={isClientListLoading}
                                            hideHeader={true}/>
                            <ButtonComponent fullWidth={true}
                                             className={'mrg-top-30'}
                                             onClick={() => confirmClientSelection()}
                                             disabled={!selectedClient}>
                                Next
                            </ButtonComponent>
                        </>
                    }
                </div>
            </DrawerComponent>

            <DrawerComponent isOpen={isProviderSelectionDrawerOpened}
                             closeOnBackDropClick={false}
                             closeOnEsc={false}
                             onClose={closeProviderSelectionDrawer}
                             showClose={true}
            >
                <div className={'provider-search-table-wrapper'}>
                    <PageHeaderComponent title={'Add Provider'}/>
                    <SearchComponent label={'Search for Providers'}
                                     value={providerListSearch}
                                     placeholder={'Search for Providers'}
                                     onSearchChange={(value) => {
                                         setProviderListSearch(value);
                                         getProviderList();
                                     }}
                    />
                    {
                        providerListSearch &&
                        <>
                            <div className={'client-list-heading'}>Provider List</div>
                            <TableComponent data={providerList}
                                            columns={providerListColumns}
                                            loading={isProviderListLoading}
                                            hideHeader={true}/>
                            <ButtonComponent fullWidth={true}
                                             className={'mrg-top-30'}
                                             onClick={() => closeProviderSelectionDrawer()}
                                             disabled={!selectedProvider}>
                                Next
                            </ButtonComponent>
                        </>
                    }
                </div>
            </DrawerComponent>
            <DrawerComponent isOpen={isClientBillingAddressDrawerOpened}
                             onClose={closeBillingAddressFormDrawer}
                             showClose={true}
            >
                <EditBillingAddressComponent billing_address={selectedClientBillingAddress}
                                             clientId={selectedClient?._id}
                                             onCancel={closeBillingAddressFormDrawer}
                                             onSave={handleEditBillingAddress}/>
            </DrawerComponent>
            {/*Payment mode selection Modal start*/}
            <ModalComponent isOpen={isPaymentModeModalOpen}
                            className={'payment-mode-modal'}
                            modalFooter={<>
                                <ButtonComponent variant={'outlined'}
                                                 className={'mrg-right-10'}
                                                 onClick={() => {
                                                     setIsPaymentModeModalOpen(false);
                                                     setSelectedPaymentMode(undefined);
                                                 }}
                                >
                                    Cancel
                                </ButtonComponent>
                                <ButtonComponent variant={'contained'}
                                                 color={'primary'}
                                                 disabled={!selectedPaymentMode}
                                                 onClick={handleAddReceiptConfirm}
                                >
                                    Confirm Payment
                                </ButtonComponent>
                            </>
                            }
            >
                <ImageConfig.ConfirmIcon/>
                <FormControlLabelComponent label={"Select Mode Of Payment"}/>
                <SelectComponent
                    label={"Select Mode Of Payment"}
                    className={'t-form-control'}
                    options={paymentModes || []}
                    value={selectedPaymentMode}
                    fullWidth={true}
                    onUpdate={(value) => setSelectedPaymentMode(value)}
                />
            </ModalComponent>
            {/*Payment mode selection Modal end*/}
        </div>
    );
};

export default AddNewReceiptScreen;
