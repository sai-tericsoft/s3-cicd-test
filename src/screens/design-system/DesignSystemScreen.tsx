import "./DesignSystemScreen.scss";
import React from 'react';
interface FormScreenProps {

}
//
// const formValidation = Yup.object({
//     // name: Yup.string().required('Name is required.'),
//     email: Yup.string().email().required('Email is required.'),
//     // gender: Yup.mixed().required('Gender is required.'),
//     // zipCode: Yup.mixed().required('ZipCode is required.'),
//     // tnc: Yup.mixed().required('TnC is required.'),
//     date: Yup.string().required('date is required.').nullable(),
//     zipcode: Yup.mixed().required("Required"),
//     state: Yup.mixed().required("Required"),
//     city: Yup.mixed().required("Required"),
//     newZipCode: Yup.string().when('zipcode', {
//         is: (zipcode: any) => (zipcode?.zipcode && zipcode?.zipcode?.toLowerCase() === "other"),
//         then: Yup.string().required('Required')
//     }),
// });
//
// interface FormType {
//     // name: string;
//     email: string;
//     // gender: any;
//     // zipCode: any;
//     // phoneNumber: string;
//     date: any;
//     zipcode: any;
//     state: any;
//     city: any;
// }
//
// const InitialValues: FormType = {
//     // name: "",
//     email: "",
//     // gender: "",
//     // zipCode: null,
//     // phoneNumber: "",
//     date: "",
//     zipcode: "",
//     state: "",
//     city: "",
// }



const DesignSystemScreen = (props: FormScreenProps) => {
    // const [search, setSearch] = useState("");
    // const [list, setList] = React.useState<TsDataListState | null>(null);
    // const columns: ITableColumn[] = [
    //     {id: 'facilityName', label: 'Facility name', minWidth: 170, isDefaultColumn: true, sortable: true},
    //     {
    //         id: 'onBoardedBy', label: 'Onboarded by', minWidth: 170, isDefaultColumn: true,
    //         content: (item: IFacility) => (
    //             <React.Fragment>
    //                 <div
    //                     className="under-line-cell">{item?.onBoardedByData?.firstName} {item?.onBoardedByData?.lastName}</div>
    //             </React.Fragment>
    //         )
    //     },
    //     {id: 'facilityTypeObj.title', label: 'Facility Type', sortable: true, isDefaultColumn: true, minWidth: 170},
    //     {
    //         id: 'statusObj.title', label: 'Status', minWidth: 170, isDefaultColumn: true,
    //         content: (item: IFacility, index: any) => (
    //             <React.Fragment>
    //                 <div>
    //                     {item?.statusObj?.title === 'Completed' ?
    //                         <div className={'status-cell'}>{item?.statusObj?.title}</div> :
    //                         <div>{item?.statusObj?.title}</div>}
    //                 </div>
    //             </React.Fragment>
    //         )
    //     },
    // ];
    // const [isCSVDownloading, setIsCSVDownloading] = useState(false);

    // const [state, setState] = useState<string>("");
    // const [isZipCodeNotFound, setIsZipCodeNotFound] = useState<boolean>(false);

    // const [facilityTypesList, setFacilityTypesList] = useState<any>([]);
    // const [isFacilityTypesListLoading, setIsFacilityTypesListLoading] = useState<any>([]);
    // const [isFacilityTypesListLoaded, setIsFacilityTypesListLoaded] = useState<any>([]);
    // const [isFacilityTypesListLoadingFailed, setIsFacilityTypesListLoadingFailed] = useState<any>([]);

    // const onSubmit = (values: any, {setSubmitting, setErrors}: FormikHelpers<any>) => {
    //     console.log(values);
    // };

    // const downloadCSV = useCallback(() => {
    //     const payload = {'search': search};
    //     setIsCSVDownloading(true);
    //     CommonService._user.downloadCsv(payload)
    //         .then((response: IAPIResponseType<any>) => {
    //             setIsCSVDownloading(false);
    //             if (response && response?.data && response?.data?.url) {
    //                 CommonService.downloadFile(response?.data?.url, response?.data?.fileName || 'patients.csv', 'csv');
    //             }
    //         })
    //         .catch((error: any) => {
    //             setIsCSVDownloading(false);
    //         });
    // }, [search]);
    //
    // const getFacilityListInit = useCallback(() => {
    //     const options = new TsDataListOptions(
    //         {
    //             extraPayload: {},
    //         },
    //         APIConfig.FACILITY_LIST.URL,
    //         setList,
    //         ApiService,
    //         APIConfig.FACILITY_LIST.METHOD
    //     );
    //     let tableWrapperObj = new TsDataListWrapperClass(options);
    //     setList({table: tableWrapperObj});
    //     // eslint-disable-next-line
    // }, [search]);
    //
    // const handleZipCodeValueChange = useCallback((zipCodeObject: any, setFieldValue: any) => {
    //     if (zipCodeObject?.zipcode?.toLowerCase() === "other") {
    //         setIsZipCodeNotFound(true);
    //         setFieldValue("state", "");
    //         setFieldValue("city", "");
    //     } else {
    //         setIsZipCodeNotFound(false);
    //         setFieldValue("state", zipCodeObject.state);
    //         setFieldValue("city", zipCodeObject.city);
    //     }
    //     setFieldValue("newZipCode", "");
    // }, []);
    //
    // const getFacilityList = useCallback(() => {
    //     if (!list) {
    //         getFacilityListInit();
    //         return;
    //     }
    // }, [list, getFacilityListInit]);
    //
    // const getFacilityTypesList = useCallback(() => {
    //     const payload = {};
    //     setIsFacilityTypesListLoading(true);
    //     setIsFacilityTypesListLoaded(false);
    //     setIsFacilityTypesListLoadingFailed(false);
    //     let facilityTypesList: any = [];
    //     CommonService._facility.getFacilityTypesList(payload)
    //         .then((response: IAPIResponseType<any>) => {
    //             if (response?.data) {
    //                 facilityTypesList = response.data;
    //             }
    //             setFacilityTypesList(facilityTypesList);
    //             setIsFacilityTypesListLoading(false);
    //             setIsFacilityTypesListLoaded(true);
    //             setIsFacilityTypesListLoadingFailed(false);
    //         })
    //         .catch((error: any) => {
    //             setFacilityTypesList(facilityTypesList);
    //             setIsFacilityTypesListLoading(false);
    //             setIsFacilityTypesListLoaded(false);
    //             setIsFacilityTypesListLoadingFailed(true);
    //         });
    // }, []);
    //
    //
    // useEffect(() => {
    //     getFacilityList();
    //     // getFacilityTypesList();
    // }, [getFacilityList]);


    return (
        <div className="design-system-screen screen"> design system
            {/*<div className="form width-50">*/}
            {/*    <Formik*/}
            {/*        validationSchema={formValidation}*/}
            {/*        initialValues={InitialValues}*/}
            {/*        validateOnChange={false}*/}
            {/*        validateOnBlur={true}*/}
            {/*        enableReinitialize={true}*/}
            {/*        validateOnMount={true}*/}
            {/*        onSubmit={onSubmit}*/}
            {/*    >*/}
            {/*        {({isSubmitting, values, isValid, validateForm}) => {*/}
            {/*            // eslint-disable-next-line react-hooks/rules-of-hooks*/}
            {/*            useEffect(() => {*/}
            {/*                validateForm();*/}
            {/*            }, [validateForm, values]);*/}
            {/*            return (*/}
            {/*                <Form className={"login-holder"}>*/}
            {/*                    <Field name={'email'} className="t-form-control">*/}
            {/*                        {*/}
            {/*                            (field: FieldProps) => (*/}
            {/*                                <FormikInputComponent*/}
            {/*                                    label={'Email'}*/}
            {/*                                    placeholder={'Enter Email'}*/}
            {/*                                    type={"email"}*/}
            {/*                                    required={true}*/}
            {/*                                    formikField={field}*/}
            {/*                                />*/}
            {/*                            )*/}
            {/*                        }*/}
            {/*                    </Field>*/}

            {/*                    <Field name={'facilityTypes'}>*/}
            {/*                        {*/}
            {/*                            (field: FieldProps) => (*/}
            {/*                                <FormikAutoCompleteDropdown*/}
            {/*                                    formikField={field}*/}
            {/*                                    fullWidth={true}*/}
            {/*                                    label={"type"}*/}
            {/*                                    required={true}*/}
            {/*                                    multiple={false}*/}
            {/*                                    data={top100Films}*/}
            {/*                                    placeholder={"Search movie"}*/}
            {/*                                    valueKey={'year'}*/}
            {/*                                    getOptionLabel={(option => (option.label) || '')}*/}
            {/*                                />*/}
            {/*                            )*/}
            {/*                        }*/}
            {/*                    </Field>*/}

            {/*                    <Field name={'date'}>*/}
            {/*                        {*/}
            {/*                            (field: FieldProps) => (*/}
            {/*                                <FormikDatePickerComponent*/}
            {/*                                    label={'select date'}*/}
            {/*                                    required={true}*/}
            {/*                                    formikField={field}*/}
            {/*                                    onUpdate={(value: any) => console.log(value)}*/}
            {/*                                />*/}
            {/*                            )*/}
            {/*                        }*/}
            {/*                    </Field>*/}

            {/*                    <Field name={'zipcode'}>*/}
            {/*                        {*/}
            {/*                            (field: FieldProps) => (*/}
            {/*                                <FormikAutoCompleteDropdown*/}
            {/*                                    formikField={field}*/}
            {/*                                    fullWidth={true}*/}
            {/*                                    label={"ZIP Code"}*/}
            {/*                                    required={true}*/}
            {/*                                    searchMode={"serverSide"}*/}
            {/*                                    method={APIConfig.ZIPCODE_LIST.METHOD}*/}
            {/*                                    multiple={false}*/}
            {/*                                    dataListKey={"data.docs"}*/}
            {/*                                    url={APIConfig.ZIPCODE_LIST.URL}*/}
            {/*                                    placeholder={"Search ZIP Code"}*/}
            {/*                                    getOptionLabel={(option => (option.zipcode) || '')}*/}
            {/*                                    onUpdate={(value: any) => {*/}
            {/*                                        handleZipCodeValueChange(value, field.form.setFieldValue)*/}
            {/*                                    }}*/}
            {/*                                    data={[]}*/}
            {/*                                    valueKey={'id'}*/}
            {/*                                    defaultData={[*/}
            {/*                                        {*/}
            {/*                                            zipcode: "Other"*/}
            {/*                                        }*/}
            {/*                                    ]}*/}
            {/*                                />*/}
            {/*                            )*/}
            {/*                        }*/}
            {/*                    </Field>*/}
            {/*                    {isZipCodeNotFound ?*/}
            {/*                        <>*/}
            {/*                            <Field name={'newZipCode'}>*/}
            {/*                                {*/}
            {/*                                    (field: FieldProps) => (*/}
            {/*                                        <FormikInputComponent*/}
            {/*                                            placeholder={"Enter New Zip Code"}*/}
            {/*                                            label={'New Zip Code'}*/}
            {/*                                            required={true}*/}
            {/*                                            type={"text"}*/}
            {/*                                            formikField={field}*/}
            {/*                                        />*/}
            {/*                                    )*/}
            {/*                                }*/}
            {/*                            </Field>*/}

            {/*                            <Field name={'state'}>*/}
            {/*                                {*/}
            {/*                                    (field: FieldProps) => (*/}
            {/*                                        <FormikAutoCompleteDropdown*/}
            {/*                                            formikField={field}*/}
            {/*                                            fullWidth={true}*/}
            {/*                                            label={"State"}*/}
            {/*                                            required={true}*/}
            {/*                                            searchMode={"serverSide"}*/}
            {/*                                            method={APIConfig.STATE_LIST.METHOD}*/}
            {/*                                            multiple={false}*/}
            {/*                                            dataListKey={"data.docs"}*/}
            {/*                                            url={APIConfig.STATE_LIST.URL}*/}
            {/*                                            placeholder={"Search State"}*/}
            {/*                                            getOptionLabel={(option => (option.state) || '')}*/}
            {/*                                            onUpdate={(value: any) => {*/}
            {/*                                                setState(value?.state);*/}
            {/*                                                field.form.setFieldValue("city", '');*/}
            {/*                                            }}*/}
            {/*                                            data={[]}*/}
            {/*                                            valueKey={'id'}*/}
            {/*                                        />*/}
            {/*                                    )*/}
            {/*                                }*/}
            {/*                            </Field>*/}
            {/*                        </>*/}
            {/*                        :*/}
            {/*                        <>*/}
            {/*                            <Field name={'state'}>*/}
            {/*                                {*/}
            {/*                                    (field: FieldProps) => (*/}
            {/*                                        <FormikInputComponent*/}
            {/*                                            placeholder={"Enter state"}*/}
            {/*                                            label={'State'}*/}
            {/*                                            required={true}*/}
            {/*                                            type={"text"}*/}
            {/*                                            formikField={field}*/}
            {/*                                        />*/}
            {/*                                    )*/}
            {/*                                }*/}
            {/*                            </Field>*/}

            {/*                            <Field name={'city'}>*/}
            {/*                                {*/}
            {/*                                    (field: FieldProps) => (*/}
            {/*                                        <FormikInputComponent*/}
            {/*                                            placeholder={"Enter city"}*/}
            {/*                                            label={'City'}*/}
            {/*                                            required={true}*/}
            {/*                                            type={"text"}*/}
            {/*                                            formikField={field}*/}
            {/*                                        />*/}
            {/*                                    )*/}
            {/*                                }*/}
            {/*                            </Field>*/}
            {/*                        </>*/}
            {/*                    }*/}

            {/*                    /!*<Field name={'gender'}>*!/*/}
            {/*                    /!*    {*!/*/}
            {/*                    /!*        (field: FieldProps) => (*!/*/}
            {/*                    /!*            <FormikSelectDropdownComponent*!/*/}
            {/*                    /!*                label={'select gender'}*!/*/}
            {/*                    /!*                required={true}*!/*/}
            {/*                    /!*                formikField={field}*!/*/}
            {/*                    /!*                options={genderOptions}*!/*/}
            {/*                    /!*                valueKey={"code"}*!/*/}
            {/*                    /!*                onUpdate={(value: any) => console.log(value)}*!/*/}
            {/*                    /!*            />*!/*/}
            {/*                    /!*        )*!/*/}
            {/*                    /!*    }*!/*/}
            {/*                    /!*</Field>*!/*/}

            {/*                    /!*<Field name={'tnc'}>*!/*/}
            {/*                    /!*    {*!/*/}
            {/*                    /!*        (field: FieldProps) => (*!/*/}
            {/*                    /!*            <FormikCheckboxComponent*!/*/}
            {/*                    /!*                label={'Accept terms and conditions'}*!/*/}
            {/*                    /!*                required={true}*!/*/}
            {/*                    /!*                formikField={field}*!/*/}
            {/*                    /!*            />*!/*/}
            {/*                    /!*        )*!/*/}
            {/*                    /!*    }*!/*/}
            {/*                    /!*</Field>*!/*/}

            {/*                    <ButtonComponent*/}
            {/*                        type="submit"*/}
            {/*                        color={"primary"}*/}
            {/*                        variant={"contained"}*/}
            {/*                        fullWidth={true}*/}
            {/*                        buttonProps={{*/}
            {/*                            id: "login_btn"*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                        save*/}
            {/*                    </ButtonComponent>*/}
            {/*                </Form>*/}
            {/*            )*/}
            {/*        }}*/}
            {/*    </Formik>*/}
            {/*</div>*/}

            {/*<div>*/}
            {/*    <h1>Table</h1>*/}
            {/*    <div className="page-options">*/}
            {/*        <div className="page-search">*/}
            {/*            <InputComponent type={"text"}*/}
            {/*                            label={"Search"}*/}
            {/*                            name={"Search"}*/}
            {/*                            id="search_input"*/}
            {/*                            size={"small"}*/}
            {/*                            placeholder={"Search Facility Name"}*/}
            {/*                            value={list?.table?.filter?.search}*/}
            {/*                            onChange={(value: string) => {*/}
            {/*                                setSearch(value);*/}
            {/*                                if (list && list.table) {*/}
            {/*                                    list.table.filter.search = value;*/}
            {/*                                    list.table.reload();*/}
            {/*                                }*/}
            {/*                            }}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*        <div className="page-extra-options">*/}
            {/*            <ButtonComponent*/}
            {/*                type="button"*/}
            {/*                id="csv_btn"*/}
            {/*                color={"secondary"}*/}
            {/*                variant={"contained"}*/}
            {/*                fullWidth={true}*/}
            {/*                handleClick={downloadCSV}*/}
            {/*                disabled={isCSVDownloading}*/}
            {/*                startIcon={<Download/>}*/}
            {/*            >*/}
            {/*                CSV*/}
            {/*            </ButtonComponent>&nbsp;*/}

            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="page-data-wrapper">*/}
            {/*        {list && <TableWrapperComponent*/}
            {/*            isPaginated={true}*/}
            {/*            columns={columns}*/}
            {/*            list={list}*/}
            {/*            isHoverable={true}*/}
            {/*            isStickyHeader={true}*/}
            {/*            isColumnFilterVisible={true}*/}
            {/*        />}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
};

export default DesignSystemScreen;
