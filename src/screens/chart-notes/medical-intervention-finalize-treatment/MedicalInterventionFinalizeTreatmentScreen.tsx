import "./MedicalInterventionFinalizeTreatmentScreen.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {APIConfig, ImageConfig, Patterns} from "../../../constants";
import _ from "lodash";
import React, {useCallback, useEffect, useState} from "react";
import Client8MinutesRuleChartComponent from "../client-8-minutes-rule-chart/Client8MinutesRuleChartComponent";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import {CommonService} from "../../../shared/services";
import {useNavigate, useParams} from "react-router-dom";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import MedicalRecordBasicDetailsCardComponent
    from "../medical-record-basic-details-card/MedicalRecordBasicDetailsCardComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import {AddIcon} from "../../../constants/ImageConfig";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import TableV2Component from "../../../shared/components/table-v2/TableV2Component";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import {DeleteOutline} from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";

interface MedicalInterventionFinalizeTreatmentScreenProps {

}

const CPTCodesInitialValues = {};

const MedicalInterventionFinalizeTreatmentScreen = (props: MedicalInterventionFinalizeTreatmentScreenProps) => {

    const {medicalRecordId, medicalInterventionId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cptCodesFormInitialValues, setCptCodesFormInitialValues] = useState<any>(_.cloneDeep(CPTCodesInitialValues));
    const [isInterventionCheckingOut, setIsInterventionCheckingOut] = useState<boolean>(false);
    const [isEightMinuteRuleChartDrawerOpen, setEightMinuteRuleChartDrawerOpen] = useState<boolean>(false);
    const [selectCPTCodeDrawerOpen, setSelectCPTCodeDrawerOpen] = useState<boolean>(false);
    const [selectedCptCodes, setSelectedCptCodes] = useState<any[]>([]);

    const {
        medicalInterventionDetails,
        isMedicalInterventionDetailsLoaded,
    } = useSelector((state: IRootReducerState) => state.chartNotes);
    // const [linkedCPTCodes, setLinkedCPTCodes] = useState<any[]>([]);
    const [totalMinutes, setTotalMinutes] = useState<number>(0);
    const [isCPTCodesLoading, setIsCPTCodesLoading] = useState<boolean>(false);

    const [extraPayload, setExtraPayload] = useState<any>({
        search: '',
        medical_record_id: medicalRecordId,
    });

    const getCptCodes = useCallback((medicalInterventionId: string) => {
        setIsCPTCodesLoading(true);
        const payload = {};
        CommonService._chartNotes.GetCPTCodesAPICall(medicalInterventionId, payload)
            .then((response: any) => {
                setSelectedCptCodes(response?.data?.cpt_codes || []);
                const totalMinutes = response?.data?.cpt_codes?.reduce((acc: number, cptCode: any) => {
                    return acc + cptCode?.minutes;
                }, 0) || 0;
                setTotalMinutes(totalMinutes);
                setIsCPTCodesLoading(false);
            })
            .catch((error: any) => {
                setIsCPTCodesLoading(false);
            });
    }, [])

    useEffect(() => {
        if (medicalInterventionId) {
            getCptCodes(medicalInterventionId);
        }
    }, [medicalInterventionId, getCptCodes]);

    const SelectCPTCodesColumns: ITableColumn[] = [
        {
            key: 'select',
            title: 'CPT Code',
            dataIndex: 'select',
            width: 490,
            fixed: 'left',
            render: (_: any, record: any) => (
                <CheckBoxComponent
                    label={record?.cpt_code}
                    size={'small'}
                    checked={selectedCptCodes?.some((cptCode) => cptCode.cpt_code_id === record._id)}
                    // disabled={record.is_selected}
                    onChange={(isChecked) => {
                        if (isChecked) {
                            const tempCptCode = record?.linked_cpt_code_details ? {
                                cpt_code_id: record._id,
                                cpt_code: record.cpt_code,
                                units_of_care: "",
                                minutes: "",
                                notes: ""
                            } : {
                                cpt_code_id: record._id,
                                cpt_code: record.cpt_code,
                                units_of_care: record?.linked_cpt_code_details?.units_of_care,
                                minutes: record?.linked_cpt_code_details?.minutes,
                                notes: record?.linked_cpt_code_details?.notes
                            }
                            setSelectedCptCodes((prevSelectedCptCodes) => [...prevSelectedCptCodes, {
                                ...tempCptCode,
                            }]);
                        } else {
                            setSelectedCptCodes((prevSelectedCptCodes) => prevSelectedCptCodes.filter((cptCode) => cptCode.cpt_code_id !== record._id));
                        }
                    }}
                />
            )
        },

    ];

    const CPTCodesColumns: ITableColumn[] = [
        // {
        //     key: 'select',
        //     title: 'CPT Codes',
        //     dataIndex: 'select',
        //     width: 390,
        //     fixed: 'left',
        //     render: (_: any, record: any) => (
        //         <Field name={`${record._id}.is_selected`}>
        //             {(field: FieldProps) => {
        //                 return (
        //                     <FormikCheckBoxComponent
        //                         formikField={field}
        //                         label={record?.cpt_code}
        //                         size={'small'}
        //                         // disabled={record.is_selected}
        //                         onChange={(isChecked) => {
        //                             field.form.setFieldValue(`${record?._id}.units_of_care`, "");
        //                             field.form.setFieldValue(`${record?._id}.minutes`, "");
        //                             field.form.setFieldValue(`${record?._id}.notes`, "");
        //
        //                             const minutes = parseInt(field.form.values[record._id]?.minutes || "0");
        //                             if (!isChecked) {
        //                                 setTotalMinutes((prevTotalMinutes) => prevTotalMinutes - minutes);
        //                             }
        //                         }}
        //                     />
        //                 );
        //             }}
        //         </Field>
        //     )
        // },
        {
            key: 'cpt_code',
            title: 'CPT Code',
            dataIndex: 'cpt_code',
            width: 380,
        },
        {
            key: 'units_of_care',
            title: 'Units of Care',
            dataIndex: 'units_of_care',
            width: 130,
            align: "center",
            render: (_: any, record: any) => renderUnitsOfCareInput(record)
        },
        {
            key: 'minutes',
            title: 'Minutes',
            dataIndex: 'minutes',
            width: 120,
            align: "center",
            render: (_: any, record: any) => renderMinutesInput(record)
        },
        {
            key: 'notes',
            title: 'Notes',
            dataIndex: 'notes',
            width: 300,
            align: "center",
            render: (_: any, record: any) => renderNotesInput(record)
        },
        {
            key: 'actions',
            title: 'Action',
            dataIndex: 'actions',
            align: "center",
            width: 100,
            fixed: 'right',
            render: (_: any, record: any) => (
                <IconButtonComponent
                    size={"large"}
                    type={"button"}
                    onClick={() => {
                        const tempCptCodes = selectedCptCodes.filter((cptCode) => cptCode.cpt_code_id !== record.cpt_code_id);
                        setTotalMinutes((prevTotalMinutes) => prevTotalMinutes - record.minutes);
                        setSelectedCptCodes(tempCptCodes);
                    }}
                >
                    <DeleteOutline color={"error"} fontSize={"inherit"}/>
                </IconButtonComponent>
            )
        }
    ];


    const renderUnitsOfCareInput = useCallback((record: any) => {
        return <Field name={`${record.cpt_code_id}.units_of_care`}>
            {
                (field: FieldProps) => (
                    <FormikSelectComponent
                        label={'Units'}
                        fullWidth={true}
                        options={CommonService._staticData.unitsOfCare}
                        onUpdate={(value) => {
                            setSelectedCptCodes((prevSelectedCptCodes) => {
                                return prevSelectedCptCodes.map((cptCode) => {
                                    if (cptCode.cpt_code_id === record.cpt_code_id) {
                                        cptCode.units_of_care = value;
                                    }
                                    return cptCode;
                                });
                            });
                        }}
                        displayWith={(option: any) => option}
                        valueExtractor={(option: any) => option}
                        size={'small'}
                        formikField={field}
                    />
                )
            }
        </Field>
    }, []);

    const renderMinutesInput = useCallback((record: any) => {

        return (
            <Field name={`${record.cpt_code_id}.minutes`}>
                {(field: FieldProps) => (
                    <FormikInputComponent
                        size={'small'}
                        validationPattern={Patterns.THREE_DIGITS_ONLY}
                        formikField={field}
                        // onBlur={() => {
                        //     const minutes = parseInt(field.form.values[record._id]?.minutes || "0");
                        //     setTotalMinutes((prevTotalMinutes) => prevTotalMinutes + minutes);
                        // }}
                        onChange={(value) => {
                            const minutes = parseInt(value || "0");
                            setTotalMinutes((prevTotalMinutes) => prevTotalMinutes - parseInt(field.form.values[record.cpt_code_id]?.minutes || "0") + minutes);
                            setSelectedCptCodes((prevSelectedCptCodes) => {
                                return prevSelectedCptCodes.map((cptCode) => {
                                    if (cptCode.cpt_code_id === record.cpt_code_id) {
                                        cptCode.minutes = minutes;
                                    }
                                    return cptCode;
                                });
                            });
                            field.form.setFieldValue(`${record.cpt_code_id}.minutes`, minutes);
                        }}
                    />
                )}
            </Field>
        );
    }, []);


    const renderNotesInput = useCallback((record: any) => {
        return <Field name={`${record.cpt_code_id}.notes`}>
            {
                (field: FieldProps) => (
                    <FormikInputComponent
                        size={'small'}
                        fullWidth={true}
                        onChange={(value) => {
                            setSelectedCptCodes((prevSelectedCptCodes) => {
                                return prevSelectedCptCodes.map((cptCode) => {
                                    if (cptCode.cpt_code_id === record.cpt_code_id) {
                                        cptCode.notes = value;
                                    }
                                    return cptCode;
                                })
                            });
                        }
                        }
                        formikField={field}
                    />
                )
            }
        </Field>
    }, []);

    useEffect(() => {
        if (medicalRecordId && medicalInterventionId) {
            dispatch(setCurrentNavParams("Finalize Treatment", null, () => {
                if (medicalInterventionDetails?.status === 'completed') {
                    navigate(CommonService._routeConfig.ViewMedicalIntervention(medicalRecordId, medicalInterventionId));

                } else {
                    navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId));
                }
            }));
        }
    }, [dispatch, navigate, medicalInterventionDetails, medicalRecordId, medicalInterventionId]);

    useEffect(() => {
        if (medicalInterventionId && !medicalInterventionDetails) {
            dispatch(getMedicalInterventionDetails(medicalInterventionId));
        }
    }, [medicalInterventionId, medicalInterventionDetails, dispatch]);

    const handleInterventionCheckout = useCallback(() => {
        if (medicalInterventionId && medicalRecordId) {
            setIsInterventionCheckingOut(true);
            CommonService._chartNotes.CheckoutAMedicalInterventionAPICall(medicalInterventionId)
                .then((response: any) => {
                    CommonService._alert.showToast(response.message, 'success');
                    navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
                    setIsInterventionCheckingOut(false);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error.error || error.errors || 'Error checking out an intervention', 'error');
                    setIsInterventionCheckingOut(false);
                });
        }
    }, [navigate, medicalInterventionId, medicalRecordId]);

    const handleCPTCodesSubmit = useCallback((values: any, {setSubmitting}: FormikHelpers<any>) => {
        const mode = (medicalInterventionDetails?.linked_cpt_codes?.length > 0) ? "edit" : "add";
        if (medicalInterventionId) {
            const payload: any = {
                cpt_codes: [],
                mode: mode
            };
            Object.keys(values).forEach((key) => {
                payload.cpt_codes.push({
                    cpt_code_id: key,
                    units_of_care: isNaN(+values[key].units_of_care) ? 0 : +values[key].units_of_care,
                    minutes: isNaN(+values[key].minutes) ? 0 : +values[key].minutes,
                    notes: values[key].notes
                });
            });
            setSubmitting(true);
            CommonService._chartNotes.SaveMedicalInterventionCPTCodesAPICall(medicalInterventionId, payload)
                .then((response: any) => {
                    // CommonService._alert.showToast(response.message, 'success');
                    setSubmitting(false);
                    // setLinkedCPTCodes(payload.cpt_codes);
                    handleInterventionCheckout();
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error.error || error.errors || 'Error saving CPT Codes', 'error');
                    setSubmitting(false);
                });
        }
    }, [medicalInterventionId, handleInterventionCheckout, medicalInterventionDetails]);

    useEffect(() => {
        if (selectedCptCodes?.length) {
            const linkedCPTCodesConfig: any = {};
            const linked_cpt_codes = selectedCptCodes
            if (linked_cpt_codes?.length) {
                linked_cpt_codes.forEach((cptCode: any) => {
                    linkedCPTCodesConfig[cptCode?.cpt_code_id] = {
                        units_of_care: cptCode?.units_of_care,
                        minutes: cptCode?.minutes,
                        notes: cptCode?.notes
                    };
                });
            }
            // setLinkedCPTCodes(linked_cpt_codes);
            setCptCodesFormInitialValues(linkedCPTCodesConfig);
        }
    }, [selectedCptCodes]);


    return (
        <div className={'medical-intervention-finalize-treatment-screen'}>
            {
                isCPTCodesLoading ?
                    <LoaderComponent/>
                    :
                    <>
                        <PageHeaderComponent title={'Finalize Treatment'}/>
                        <MedicalRecordBasicDetailsCardComponent/>
                        {/*{*/}
                        {/*    isMedicalInterventionDetailsLoading && <>*/}
                        {/*        <LoaderComponent/>*/}
                        {/*    </>*/}
                        {/*}*/}
                        {
                            isMedicalInterventionDetailsLoaded && <>
                                <Formik initialValues={cptCodesFormInitialValues}
                                        enableReinitialize={true}
                                        onSubmit={handleCPTCodesSubmit}>
                                    {({values, validateForm, isSubmitting, isValid, errors}) => {
                                        // eslint-disable-next-line react-hooks/rules-of-hooks
                                        useEffect(() => {
                                            validateForm()
                                        }, [validateForm, values]);
                                        return (
                                            <Form className="t-form" noValidate={true}>
                                                <CardComponent className={'finalize-treatment-wrapper'}>
                                                    <div className="cpt-codes-viw-list-header">

                                                        <div>

                                                            <div className='cpt-code-list-footer'>
                                                                <div className="total-heading">Total number
                                                                    of minutes
                                                                </div>
                                                                <div
                                                                    className="total-minutes-wrapper">{totalMinutes}</div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <ButtonComponent
                                                                className={'white-space-nowrap mrg-right-10'}
                                                                type={"button"}
                                                                prefixIcon={<ImageConfig.EyeIcon/>}
                                                                onClick={() => setEightMinuteRuleChartDrawerOpen(true)}
                                                            >
                                                                View 8-Minute Rule
                                                            </ButtonComponent>
                                                            <ButtonComponent
                                                                className={'white-space-nowrap mrg-right-10'}
                                                                type={"button"}
                                                                color={"error"}
                                                                variant={'outlined'}
                                                                disabled={isSubmitting || isInterventionCheckingOut || selectedCptCodes?.length === 0}
                                                                prefixIcon={<ClearIcon/>}
                                                                onClick={() => {
                                                                    setSelectedCptCodes([])
                                                                    setTotalMinutes(0);
                                                                }
                                                                }
                                                            >
                                                                Clear All Code(s)
                                                            </ButtonComponent>
                                                            <ButtonComponent
                                                                className={'white-space-nowrap'}
                                                                type={"button"}
                                                                disabled={isSubmitting || isInterventionCheckingOut}
                                                                prefixIcon={<AddIcon/>}
                                                                onClick={() => setSelectCPTCodeDrawerOpen(true)}
                                                            >
                                                                Add CPT Code
                                                            </ButtonComponent>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <TableV2Component
                                                            data={selectedCptCodes}
                                                            showFooter={true}
                                                            noDataText={"No CPT code has been added yet."}
                                                            columns={CPTCodesColumns}/>
                                                    </div>
                                                </CardComponent>
                                                <div className="t-form-actions mrg-bottom-0">
                                                    <>
                                                        {
                                                            medicalRecordId && <>
                                                                <ButtonComponent variant={"outlined"}
                                                                                 size={'large'}
                                                                                 className={isSubmitting ? 'mrg-right-15' : ''}
                                                                                 disabled={isSubmitting || isInterventionCheckingOut}
                                                                                 onClick={() => navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId))}
                                                                >
                                                                    Home
                                                                </ButtonComponent>&nbsp;&nbsp;
                                                            </>
                                                        }
                                                    </>
                                                    <ButtonComponent
                                                        type={"submit"}
                                                        className={'mrg-left-15'}
                                                        size={'large'}
                                                        isLoading={isSubmitting}
                                                        disabled={
                                                            isSubmitting ||
                                                            isInterventionCheckingOut ||
                                                            totalMinutes === 0 ||
                                                            !Object.keys(values).some((cptCodeId) => {
                                                                const cptDetails = values[cptCodeId];
                                                                return !!(cptDetails?.units_of_care && cptDetails?.minutes);
                                                            }) || !Object.keys(values).every((cptCodeId) => {
                                                                const cptDetails = values[cptCodeId];
                                                                return !!(cptDetails?.units_of_care && cptDetails?.minutes);
                                                            })
                                                        }
                                                    >
                                                        Checkout
                                                    </ButtonComponent>
                                                </div>
                                            </Form>
                                        );
                                    }}
                                </Formik>
                            </>
                        }
                        <DrawerComponent isOpen={isEightMinuteRuleChartDrawerOpen}
                                         showClose={true}
                                         closeOnEsc={false}
                                         closeOnBackDropClick={true}
                                         onClose={() => setEightMinuteRuleChartDrawerOpen(false)}>
                            <Client8MinutesRuleChartComponent/>
                        </DrawerComponent>
                        <DrawerComponent isOpen={selectCPTCodeDrawerOpen}
                                         showClose={true}
                                         closeOnEsc={false}
                                         closeOnBackDropClick={true}
                                         onClose={() => setSelectCPTCodeDrawerOpen(false)}>
                            <FormControlLabelComponent size={'lg'} label={'Add CPT Code'}/>
                            <SearchComponent label={'Search'}
                                             placeholder={'Search CPT Code'}
                                             value={extraPayload.search}
                                             onSearchChange={(value) => {
                                                 setExtraPayload((ov: any) => ({
                                                     ...ov,
                                                     search: value
                                                 }))
                                             }}
                            />
                            <div className={'cpt-codes-select-list'}>
                                <TableWrapperComponent url={APIConfig.CPT_CODES_LIST.URL}
                                                       method={APIConfig.CPT_CODES_LIST.METHOD}
                                                       isPaginated={true}
                                                       extraPayload={extraPayload}
                                                       noDataText={'Searched CPT code was not found.'}
                                                       type={"ant"}
                                                       columns={SelectCPTCodesColumns}/>
                            </div>
                        </DrawerComponent>
                    </>
            }
        </div>
    );

};

export default MedicalInterventionFinalizeTreatmentScreen;
