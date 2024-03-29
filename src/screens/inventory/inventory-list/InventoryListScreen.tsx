import "./InventoryListScreen.scss";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig, ImageConfig, Misc, Patterns} from "../../../constants";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch, useSelector} from "react-redux";
import {CommonService} from "../../../shared/services";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import * as Yup from "yup";
import {IRootReducerState} from "../../../store/reducers";
import {getInventoryProductList} from "../../../store/actions/inventory.action";
import _ from "lodash";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";

interface InventoryListScreenProps {

}

const UpdateQuantityInitialValues: any = {
    product: '',
    quantity: ''
}

const updateQuantityValidationSchema = Yup.object({
    product: Yup.mixed().required('Product is required'),
    quantity: Yup.mixed().required('Quantity is required'),
});

const InventoryListScreen = (props: InventoryListScreenProps) => {

    const dispatch = useDispatch();
    const [inventoryListFilterState, setInventoryListFilterState] = useState<any>({
        search: "",
        sort: {}
    });
    const [isUpdateStockModalOpen, setIsUpdateStockModalOpen] = useState<boolean>(false);
    const [updateQuantityFormInitialValues, setUpdateQuantityFormInitialValues] = useState<any>(_.cloneDeep(UpdateQuantityInitialValues));
    const {inventoryProductList} = useSelector((state: IRootReducerState) => state.inventory);
    const [isQuantityUpdateLoading, setIsQuantityUpdateLoading] = useState<boolean>(false);
    const [refreshToken, setRefreshToken] = useState<string>('');

    const InventoryListTableColumns = useMemo<any>(() => [
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
            width: 183,
            fixed: 'left',
            render: (item: any) => {
                return <LinkComponent route={CommonService._routeConfig.InventoryProductViewDetails(item?._id)}>
                    {
                        (item?.name?.length) > 18 ?
                            <ToolTipComponent
                                tooltip={item?.name}
                                position={"top"}
                                showArrow={true}>
                                <div> {item?.name?.substring(0, 18) + '...'}</div>
                            </ToolTipComponent> : item?.name
                    }
                </LinkComponent>
            }
        },
        {
            title: 'Product Code',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            width: 148
        },
        {
            title: 'Quantity Available',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 181,
            align: 'center',
            sortable: true,
            render: (item: any) => {
                return <>
                    {item?.quantity <= 0 ?
                        <ChipComponent className={'out-of-stock-chip'} label={'Out of stock'}/> : item.quantity}
                </>
            }
        },
        {
            title: 'Retail Price (Incl. tax)',
            dataIndex: 'retail_price',
            key: 'price',
            align: 'center',
            width: 186,
            render: (item: any) => {
                return <> {Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(item?.retail_price)} </>
            }
        },
        {
            title: 'Sale Price (Incl. tax)',
            dataIndex: 'sale_price',
            key: 'sale_price',
            align: 'center',
            width: 186,
            render: (item: any) => {
                return <> {Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(item?.sale_price) || '0.00'} </>
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 159,
            align: 'center',
            fixed: 'right',
            render: (item: any) => {
                return <LinkComponent route={CommonService._routeConfig.InventoryProductViewDetails(item?._id)}>
                    View Details</LinkComponent>
            }
        }
    ], []);

    const handleInventorySort = useCallback((key: string, order: string) => {
        setInventoryListFilterState((oldState: any) => {
            const newState = {...oldState};
            newState["sort"] = {
                key,
                order
            }
            return newState;
        });
    }, []);

    useEffect(() => {
        dispatch(getInventoryProductList())
    }, [dispatch])

    useEffect(() => {
        dispatch(setCurrentNavParams("Inventory"));
    }, [dispatch]);

    const handleUpdateQuantityModalOpen = useCallback(() => {
        setIsUpdateStockModalOpen(true);
        setUpdateQuantityFormInitialValues(_.cloneDeep({
            UpdateQuantityInitialValues
        }));
    }, []);

    const handleUpdateQuantityModalClose = useCallback(() => {
        setIsUpdateStockModalOpen(false);
        setUpdateQuantityFormInitialValues(_.cloneDeep(UpdateQuantityInitialValues));
    }, []);

    const updateQuantity = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {
            quantity: values.quantity,
        };
        setIsQuantityUpdateLoading(true);
        CommonService._inventory.InventoryQuantityUpdateAPICall(values?.product, payload)
            .then((response: any) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Quantity Update successfully", "success");
                setIsQuantityUpdateLoading(false);
                setRefreshToken(CommonService.getRandomID(10));
                handleUpdateQuantityModalClose();
            }).catch((error: any) => {
            CommonService.handleErrors(setErrors, error, true);
            setIsQuantityUpdateLoading(false);
            setIsUpdateStockModalOpen(false)
        })
    }, [handleUpdateQuantityModalClose]);

    return (
        <div className={'inventory-list-screen list-screen'}>
            <div className={'list-screen-header'}>
                <div className={'list-search-filters'}>
                    <div className="ts-row">
                        <div className="ts-col-md-8 ts-col-lg-4">
                            <SearchComponent label={'Search'}
                                             placeholder={'Search using Product Name or Code'}
                                             value={inventoryListFilterState.search}
                                             onSearchChange={(value) => {
                                                 setInventoryListFilterState({
                                                     ...inventoryListFilterState,
                                                     search: value
                                                 })
                                             }}
                            />
                        </div>
                    </div>
                </div>
                <div className="list-options">
                    <ButtonComponent prefixIcon={<ImageConfig.UpdateQuantityIcon/>} id={"update_product_btn"}
                                     variant={'outlined'} onClick={handleUpdateQuantityModalOpen}
                                     className={'update_product_btn'}>
                        Update Quantity
                    </ButtonComponent>
                    <LinkComponent route={CommonService._routeConfig.AddInventoryProduct()}>
                        <ButtonComponent id={'add_product_btn'} prefixIcon={<ImageConfig.AddIcon/>}>
                            Add Product
                        </ButtonComponent>
                    </LinkComponent>

                </div>
            </div>
            <div className="list-content-wrapper">
                <TableWrapperComponent url={APIConfig.GET_INVENTORY_LIST.URL}
                                       method={APIConfig.GET_INVENTORY_LIST.METHOD}
                                       columns={InventoryListTableColumns}
                                       extraPayload={inventoryListFilterState}
                                       noDataText={(<div className={'no-product-text-wrapper'}>
                                           {/*<div>{inventoryListFilterState.search ?*/}
                                           {/*    <img src={ImageConfig.Search} alt="client-search"/> : ''}</div>*/}
                                           {/*<div*/}
                                           {/*    className={'no-client-heading mrg-bottom-15'}>{inventoryListFilterState.search ? '' : ''}</div>*/}
                                           <div className={'no-product-description'}>
                                               {inventoryListFilterState.search ? 'Sorry, no results found!.' : 'No product added yet.'}
                                           </div>
                                       </div>)}
                                       refreshToken={refreshToken}
                                       onSort={handleInventorySort}
                />
            </div>
            <ModalComponent isOpen={isUpdateStockModalOpen} closeOnBackDropClick={true}
                            className={'update-stock-modal'}>
                <FormControlLabelComponent label={'UPDATE PRODUCT QUANTITY'}
                                           className={'display-flex ts-justify-content-center'}/>
                <Formik initialValues={updateQuantityFormInitialValues}
                        onSubmit={updateQuantity}
                        validationSchema={updateQuantityValidationSchema}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}>
                    {({values, isValid, touched, errors, setFieldValue, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [values, validateForm]);
                        return (
                            <Form className={'t-form'} noValidate={true}>
                                <div className={'ts-row ts-justify-content-center'}>
                                    <div className={'ts-col-lg-12'}>
                                        <Field name={'product'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent formikField={field}
                                                                           label={'Select Product'}
                                                                           required={true}
                                                                           fullWidth={true}
                                                                           displayWith={(item: any) => item?.name}
                                                                           options={inventoryProductList}
                                                                           valueExtractor={(item: any) => item?._id}

                                                    />
                                                )}
                                        </Field>
                                    </div>
                                </div>
                                <div className={'ts-row ts-justify-content-center'}>
                                    <div className={'ts-col-lg-12'}>
                                        <Field name={'quantity'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent formikField={field}
                                                                          label={'Quantity'}
                                                                          required={true}
                                                                          fullWidth={true}
                                                                          validationPattern={Patterns.NEGATIVE_WHOLE_NUMBERS}
                                                                          placeholder={'Enter Quantity'}/>
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className={'ts-action display-flex ts-justify-content-center'}>
                                    <ButtonComponent id={"cancel_btn"} variant={'outlined'}
                                                     onClick={handleUpdateQuantityModalClose}>
                                        Cancel
                                    </ButtonComponent>
                                    &nbsp;
                                    <ButtonComponent id={"save_btn"} variant={'contained'} color={'primary'}
                                                     isLoading={isQuantityUpdateLoading}
                                                     disabled={!isValid || isQuantityUpdateLoading} type={'submit'}>
                                        Add Quantity
                                    </ButtonComponent>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </ModalComponent>
        </div>
    );

}

export default InventoryListScreen;
