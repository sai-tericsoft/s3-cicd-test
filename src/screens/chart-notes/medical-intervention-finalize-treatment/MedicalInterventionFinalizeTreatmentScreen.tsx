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
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import ClientMedicalDetailsCardComponent from "../client-medical-details-card/ClientMedicalDetailsCardComponent";

interface MedicalInterventionFinalizeTreatmentScreenProps {

}

const CPTCodesInitialValues = {};

const FULL_PAGES = {
    page: 1,
    limit: 1000
}

const MedicalInterventionFinalizeTreatmentScreen = (props: MedicalInterventionFinalizeTreatmentScreenProps) => {

    const {medicalRecordId, medicalInterventionId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cptCodesFormInitialValues, setCptCodesFormInitialValues] = useState<any>(_.cloneDeep(CPTCodesInitialValues));
    const [isInterventionCheckingOut, setIsInterventionCheckingOut] = useState<boolean>(false);
    const [isEightMinuteRuleChartDrawerOpen, setEightMinuteRuleChartDrawerOpen] = useState<boolean>(false);
    const {
        medicalInterventionDetails,
        isMedicalInterventionDetailsLoading,
        isMedicalInterventionDetailsLoaded,
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    const [extraPayload, setExtraPayload] = useState<any>({
        ...FULL_PAGES, search: ''
    });

    const CPTCodesColumns: ITableColumn[] = [
        {
            key: 'select',
            title: '',
            dataIndex: 'select',
            width: 90,
            render: (text: string, record: any) => <Field name={`${record._id}.is_selected`}>
                {
                    (field: FieldProps) => (
                        <FormikCheckBoxComponent
                            formikField={field}
                            size={'small'}
                            onChange={(isChecked) => {
                                if (!isChecked) {
                                    field.form.setFieldValue(`${record?._id}.units_of_care`, "");
                                    field.form.setFieldValue(`${record?._id}.minutes`, "");
                                    field.form.setFieldValue(`${record?._id}.notes`, "");
                                }
                            }}
                        />
                    )
                }
            </Field>
        },
        {
            key: 'cpt_code',
            title: 'CPT Codes',
            dataIndex: 'cpt_code',
            width: 380,
        },
        {
            key: 'units_of_care',
            title: 'Units of Care',
            dataIndex: 'units_of_care',
            width: 130,
            render: (text: string, record: any) => <Field name={`${record._id}.units_of_care`}>
                {
                    (field: FieldProps) => (
                        <FormikInputComponent
                            size={'small'}
                            validationPattern={Patterns.POSITIVE_INTEGERS}
                            className={!field.form.values[record._id]?.is_selected ? 'display-none' : ''}
                            disabled={!field.form.values[record._id]?.is_selected}
                            formikField={field}
                        />
                    )
                }
            </Field>
        },
        {
            key: 'minutes',
            title: 'Minutes',
            dataIndex: 'minutes',
            width: 120,
            render: (text: string, record: any) => <Field name={`${record._id}.minutes`}>
                {
                    (field: FieldProps) => (
                        <FormikInputComponent
                            size={'small'}
                            validationPattern={Patterns.POSITIVE_INTEGERS}
                            className={!field.form.values[record._id]?.is_selected ? 'display-none' : ''}
                            disabled={!field.form.values[record._id]?.is_selected}
                            formikField={field}
                        />
                    )
                }
            </Field>
        },
        {
            key: 'notes',
            title: 'Notes',
            dataIndex: 'notes',
            width: 300,
            render: (text: string, record: any) => <Field name={`${record._id}.notes`}>
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
        }
    ];

    useEffect(() => {
        if (medicalRecordId && medicalInterventionId) {
            dispatch(setCurrentNavParams("Finalize Treatment", null, () => {
                medicalInterventionId && navigate(CommonService._routeConfig.AddMedicalIntervention(medicalRecordId, medicalInterventionId));
            }));
        }
    }, [dispatch, navigate, medicalRecordId, medicalInterventionId]);

    useEffect(() => {
        if (medicalInterventionId && !medicalInterventionDetails) {
            dispatch(getMedicalInterventionDetails(medicalInterventionId));
        }
    }, [medicalInterventionId, medicalInterventionDetails, dispatch]);

    const handleCPTCodesSubmit = useCallback((values: any, {setSubmitting}: FormikHelpers<any>) => {
        if (medicalInterventionId) {
            const payload: any = {
                cpt_codes: [],
                mode: "add"
            };
            if (medicalInterventionDetails?.linked_cpt_codes?.length) {
                payload.mode = "edit"
            }
            Object.keys(values).forEach((key) => {
                payload.cpt_codes.push({
                    cpt_code_id: key,
                    units_of_care: values[key].units_of_care,
                    minutes: values[key].minutes,
                    notes: values[key].notes
                });
            });
            setSubmitting(true);
            CommonService._chartNotes.SaveMedicalInterventionCPTCodesAPICall(medicalInterventionId, payload)
                .then((response: any) => {
                    CommonService._alert.showToast(response.message, 'success');
                    setSubmitting(false);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error.error || error.errors || 'Error saving CPT Codes', 'error');
                    setSubmitting(false);
                });
        }
    }, [medicalInterventionDetails, medicalInterventionId]);

    useEffect(() => {
        const linkedCPTCodesConfig: any = {};
        const linked_cpt_codes = medicalInterventionDetails?.linked_cpt_codes;
        if (linked_cpt_codes?.length) {
            linked_cpt_codes.forEach((cptCode: any) => {
                linkedCPTCodesConfig[cptCode.cpt_code_id] = {
                    is_selected: true,
                    units_of_care: cptCode.units_of_care,
                    minutes: cptCode.minutes,
                    notes: cptCode.notes
                };
            })
        }
        setCptCodesFormInitialValues(linkedCPTCodesConfig);
    }, [medicalInterventionDetails]);

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

    return (
        <div className={'medical-intervention-finalize-treatment-screen'}>
            <ClientMedicalDetailsCardComponent/>
            {
                isMedicalInterventionDetailsLoading && <>
                    <LoaderComponent/>
                </>
            }
            {
                isMedicalInterventionDetailsLoaded && <>
                    <Formik initialValues={cptCodesFormInitialValues}
                            enableReinitialize={true}
                            onSubmit={handleCPTCodesSubmit}>
                        {({values, validateForm, isSubmitting}) => {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useEffect(() => {
                                validateForm();
                            }, [validateForm, values]);
                            return (
                                <Form className="t-form" noValidate={true}>
                                    <CardComponent>
                                        <div className="ts-row align-items-center">
                                            <div className="ts-col ts-col-6">
                                                <SearchComponent label={'Search CPT Code'}
                                                                 size={"medium"}
                                                                 placeholder={'Search CPT Code'}
                                                                 value={extraPayload.search}
                                                                 onSearchChange={(value) => {
                                                                     setExtraPayload((ov:any) => ({...ov, search: value}))
                                                                 }}
                                                />
                                            </div>
                                            <div className="ts-col-6 text-right">
                                                <ButtonComponent
                                                    className={'white-space-nowrap'}
                                                    type={"button"}
                                                    prefixIcon={<ImageConfig.EyeIcon/>}
                                                    onClick={() => setEightMinuteRuleChartDrawerOpen(true)}
                                                >
                                                    View 8 Minute Rule
                                                </ButtonComponent>
                                            </div>
                                        </div>
                                        <div>
                                            <TableWrapperComponent url={APIConfig.CPT_CODES_LIST.URL}
                                                                   method={APIConfig.CPT_CODES_LIST.METHOD}
                                                                   isPaginated={false}
                                                                   extraPayload={extraPayload}
                                                                   columns={CPTCodesColumns}/>
                                        </div>
                                    </CardComponent>
                                    <div className="t-form-actions">
                                        <>
                                            {
                                                medicalRecordId && <>
                                                    <LinkComponent
                                                        route={CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId)}>
                                                        <ButtonComponent variant={"outlined"}
                                                                         disabled={isSubmitting || isInterventionCheckingOut}>
                                                            Home
                                                        </ButtonComponent>&nbsp;&nbsp;
                                                    </LinkComponent>
                                                </>
                                            }
                                        </>
                                        <ButtonComponent type={"submit"} isLoading={isSubmitting}
                                                         disabled={isSubmitting || isInterventionCheckingOut}>
                                            Save
                                        </ButtonComponent>
                                        <>
                                            {
                                                (medicalRecordId && medicalInterventionDetails?.linked_cpt_codes?.length > 0) && <>&nbsp;&nbsp;
                                                    <ButtonComponent disabled={isSubmitting || isInterventionCheckingOut}
                                                                     isLoading={isInterventionCheckingOut}
                                                                     onClick={handleInterventionCheckout}>
                                                        Checkout
                                                    </ButtonComponent>
                                                </>
                                            }
                                        </>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                    <DrawerComponent isOpen={isEightMinuteRuleChartDrawerOpen}
                                     showClose={true}
                                     closeOnEsc={false}
                                     closeOnBackDropClick={false}
                                     onClose={() => setEightMinuteRuleChartDrawerOpen(false)}>
                        <Client8MinutesRuleChartComponent/>
                    </DrawerComponent>
                </>
            }
        </div>
    );

};

export default MedicalInterventionFinalizeTreatmentScreen;
