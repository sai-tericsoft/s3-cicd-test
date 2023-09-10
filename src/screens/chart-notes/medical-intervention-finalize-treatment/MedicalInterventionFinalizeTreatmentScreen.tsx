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
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import {CommonService} from "../../../shared/services";
import {useNavigate, useParams} from "react-router-dom";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import MedicalRecordBasicDetailsCardComponent
    from "../medical-record-basic-details-card/MedicalRecordBasicDetailsCardComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import FormDebuggerComponent from "../../../shared/components/form-debugger/FormDebuggerComponent";

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
    const {
        medicalInterventionDetails,
        isMedicalInterventionDetailsLoaded,
    } = useSelector((state: IRootReducerState) => state.chartNotes);
    const [linkedCPTCodes, setLinkedCPTCodes] = useState<any[]>([]);
    const [totalMinutes, setTotalMinutes] = useState<number>(0);
    const [CPTCodes, setCPTCodes] = useState<any[]>([]);
    const [extraPayload, setExtraPayload] = useState<any>({
        search: '',
        medical_record_id: medicalRecordId,
    });

    const CPTCodesColumns: ITableColumn[] = [
        {
            key: 'select',
            title: 'CPT Codes',
            dataIndex: 'select',
            width: 390,
            fixed: 'left',
            render: (_: any, record: any) => (
                <Field name={`${record._id}.is_selected`}>
                    {(field: FieldProps) => {
                        return (
                            <FormikCheckBoxComponent
                                formikField={field}
                                label={record?.cpt_code}
                                size={'small'}
                                // disabled={record.is_selected}
                                onChange={(isChecked) => {
                                    field.form.setFieldValue(`${record?._id}.units_of_care`, "");
                                    field.form.setFieldValue(`${record?._id}.minutes`, "");
                                    field.form.setFieldValue(`${record?._id}.notes`, "");

                                    const minutes = parseInt(field.form.values[record._id]?.minutes || "0");
                                    if (!isChecked) {
                                        setTotalMinutes((prevTotalMinutes) => prevTotalMinutes - minutes);
                                    }
                                }}
                            />
                        );
                    }}
                </Field>
            )
        },
        // {
        //     key: 'cpt_code',
        //     title: 'CPT Codes',
        //     dataIndex: 'cpt_code',
        //     width: 380,
        // },
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
        }
    ];


    const renderUnitsOfCareInput = useCallback((record: any) => {

        return <Field name={`${record._id}.units_of_care`}>
            {
                (field: FieldProps) => (
                    <FormikSelectComponent
                        label={'Units'}
                        fullWidth={true}
                        options={CommonService._staticData.unitsOfCare}
                        displayWith={(option: any) => option}
                        valueExtractor={(option: any) => option}
                        size={'small'}
                        className={!field.form.values[record._id]?.is_selected ? 'display-none' : ''}
                        disabled={!field.form.values[record._id]?.is_selected}
                        formikField={field}
                    />
                )
            }
        </Field>
    }, []);

    const renderMinutesInput = useCallback((record: any) => {

        return (
            <Field name={`${record._id}.minutes`}>
                {(field: FieldProps) => (
                    <FormikInputComponent
                        size={'small'}
                        validationPattern={Patterns.THREE_DIGITS_ONLY}
                        className={!field.form.values[record._id]?.is_selected ? 'display-none' : ''}
                        disabled={!field.form.values[record._id]?.is_selected}
                        formikField={field}
                        // onBlur={() => {
                        //     const minutes = parseInt(field.form.values[record._id]?.minutes || "0");
                        //     if (field.form.values[record._id]?.is_selected) {
                        //         setTotalMinutes((prevTotalMinutes) => prevTotalMinutes + minutes);
                        //     }
                        // }}
                        onChange={(value) => {
                            const minutes = parseInt(value || "0");
                            if (field.form.values[record._id]?.is_selected) {
                                setTotalMinutes((prevTotalMinutes) => prevTotalMinutes - field.form.values[record._id]?.minutes + minutes);
                            }
                            field.form.setFieldValue(`${record._id}.minutes`, value);
                        }}
                    />
                )}
            </Field>
        );
    }, []);


    const renderNotesInput = useCallback((record: any) => {
        return <Field name={`${record._id}.notes`}>
            {
                (field: FieldProps) => (
                    <FormikInputComponent
                        size={'small'}
                        fullWidth={true}
                        className={!field.form.values[record._id]?.is_selected ? 'display-none' : ''}
                        disabled={!field.form.values[record._id]?.is_selected}
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
        if (medicalInterventionId) {
            const payload: any = {
                cpt_codes: [],
                mode: "add"
            };
            if (medicalInterventionDetails?.linked_cpt_codes > 0 && linkedCPTCodes?.length > 0) {
                payload.mode = "edit"
            }
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
                    setLinkedCPTCodes(payload.cpt_codes);
                    handleInterventionCheckout();
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error.error || error.errors || 'Error saving CPT Codes', 'error');
                    setSubmitting(false);
                });
        }
    }, [linkedCPTCodes, medicalInterventionId, handleInterventionCheckout, medicalInterventionDetails]);

    useEffect(() => {
        if (CPTCodes.length) {
            const linkedCPTCodesConfig: any = {};

            const linked_cpt_codes = CPTCodes
                .filter((cptCode) => cptCode.is_selected && cptCode.linked_cpt_code_details)
                .map((cptCode) => cptCode.linked_cpt_code_details);


            let totalMinutesFromLinkedCodes = 0;
            linked_cpt_codes?.forEach((cptCode: any) => {
                totalMinutesFromLinkedCodes += cptCode?.minutes || 0;
            });
            setTotalMinutes(totalMinutesFromLinkedCodes);

            if (linked_cpt_codes?.length) {
                linked_cpt_codes.forEach((cptCode: any) => {
                    linkedCPTCodesConfig[cptCode?.cpt_code_id] = {
                        is_selected: true,
                        units_of_care: cptCode?.units_of_care,
                        minutes: cptCode?.minutes,
                        notes: cptCode?.notes
                    };
                });
            }
            setLinkedCPTCodes(linked_cpt_codes);
            setCptCodesFormInitialValues(linkedCPTCodesConfig);
        }
    }, [CPTCodes]);


    return (
        <div className={'medical-intervention-finalize-treatment-screen'}>
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
                                validateForm();
                            }, [validateForm, values]);
                            return (
                                <Form className="t-form" noValidate={true}>
                                    <CardComponent className={'finalize-treatment-wrapper'}>
                                        <div className="ts-row display-flex align-items-center">
                                            <div className="ts-col ts-col-6 mrg-bottom-15">
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
                                            </div>
                                            <div className="ts-col-6 text-right mrg-bottom-20">
                                                <ButtonComponent
                                                    className={'white-space-nowrap'}
                                                    type={"button"}
                                                    prefixIcon={<ImageConfig.EyeIcon/>}
                                                    onClick={() => setEightMinuteRuleChartDrawerOpen(true)}
                                                >
                                                    View 8-Minute Rule
                                                </ButtonComponent>
                                            </div>
                                        </div>
                                        <div>
                                            <TableWrapperComponent url={APIConfig.CPT_CODES_LIST.URL}
                                                                   method={APIConfig.CPT_CODES_LIST.METHOD}
                                                                   isPaginated={true}
                                                                   extraPayload={extraPayload}
                                                                   type={"ant"}
                                                                   showFooter={true}
                                                                   onDataLoaded={(data: any) => {
                                                                       if (data) {
                                                                           setCPTCodes(data);
                                                                       }
                                                                   }}
                                                                   footer={
                                                                       <div className='cpt-code-list-footer'>
                                                                           <div className="total-heading">Total number
                                                                               of minutes
                                                                           </div>
                                                                           <div
                                                                               className="total-minutes-wrapper">{totalMinutes}</div>
                                                                       </div>
                                                                   }
                                                                   columns={CPTCodesColumns}/>
                                        </div>
                                    </CardComponent>
                                    <div className="t-form-actions mrg-bottom-0">
                                        <>
                                            {
                                                medicalRecordId && <>
                                                    <LinkComponent
                                                        route={CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId)}>
                                                        <ButtonComponent variant={"outlined"}
                                                                         size={'large'}
                                                                         className={isSubmitting ? 'mrg-right-15' : ''}
                                                                         disabled={isSubmitting || isInterventionCheckingOut}>
                                                            Home
                                                        </ButtonComponent>&nbsp;&nbsp;
                                                    </LinkComponent>
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
                                                    return !!(cptDetails?.is_selected && cptDetails?.units_of_care && cptDetails?.minutes);
                                                }) || !Object.keys(values).every((cptCodeId) => {
                                                    const cptDetails = values[cptCodeId];
                                                    if (cptDetails?.is_selected) {
                                                        return !!(cptDetails?.units_of_care && cptDetails?.minutes);
                                                    } else {
                                                        return true;
                                                    }
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
                    <DrawerComponent isOpen={isEightMinuteRuleChartDrawerOpen}
                                     showClose={true}
                                     closeOnEsc={false}
                                     closeOnBackDropClick={true}
                                     onClose={() => setEightMinuteRuleChartDrawerOpen(false)}>
                        <Client8MinutesRuleChartComponent/>
                    </DrawerComponent>
                </>
            }
        </div>
    );

};

export default MedicalInterventionFinalizeTreatmentScreen;
