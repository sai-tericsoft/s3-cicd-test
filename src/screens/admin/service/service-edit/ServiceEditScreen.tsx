import "./ServiceEditScreen.scss";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import React, {useCallback, useEffect, useState} from "react";
import * as Yup from "yup";
import FormikInputComponent from "../../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikTextAreaComponent
    from "../../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FilePickerComponent from "../../../../shared/components/file-picker/FilePickerComponent";
import _ from "lodash";
import ErrorComponent from "../../../../shared/components/error/ErrorComponent";
import FilePreviewThumbnailComponent
    from "../../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {ImageConfig, Misc, Patterns} from "../../../../constants";
import CardComponent from "../../../../shared/components/card/CardComponent";
import FormikSelectComponent from "../../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {useNavigate, useParams} from "react-router-dom";
import IconButtonComponent from "../../../../shared/components/icon-button/IconButtonComponent";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";
import {IService} from "../../../../shared/models/service.model";
import FormikSwitchComponent from "../../../../shared/components/form-controls/formik-switch/FormikSwitchComponent";
import HorizontalLineComponent
    from "../../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";

interface ServiceEditComponentProps {
}

const CONSULTATION_DURATION_SLOT = {
    duration: undefined,
    price: ""
};

const CONSULTATION_BLOCK = {
    title: "",
    consultation_details: [
        CONSULTATION_DURATION_SLOT
    ]
}

const ServiceEditFormInitialValues: IService = {
    name: "",
    description: "",
    image: "",
    category_id: "",
    is_active: false,
    initial_consultation: [
        CONSULTATION_BLOCK
    ],
    followup_consultation: [
        CONSULTATION_BLOCK
    ],
};


const serviceEditFormValidationSchema = Yup.object({
    name: Yup.string()
        .required('Service Name is required'),
    description: Yup.string()
        .required("Service Description is required"),
    image: Yup.mixed()
        .required('Image is required'),
    initial_consultation: Yup.array(Yup.object({
            title: Yup.string().nullable(),
            consultation_details: Yup.array(Yup.object({
                duration: Yup.number().required("Duration is required"),
                price: Yup.string()
                    // .matches(Patterns.POSITIVE_INTEGERS, "Price per hour must be a number")
                    .required("Price is required"),
            })),
        })
    ),
    // followup_consultation: Yup.array(Yup.object({
    //         title: Yup.string().nullable(),
    //         consultation_details: Yup.array(Yup.object({
    //             duration: Yup.number().required("Duration is required"),
    //             price: Yup.string()
    //                 // .matches(Patterns.POSITIVE_INTEGERS, "Price per hour must be a number")
    //                 .required("Price is required"),
    //         })),
    //     })
    // ),
});

const ServiceEditScreen = (props: ServiceEditComponentProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {serviceId} = useParams();
    const [serviceDetails, setServiceDetails] = useState<IService | undefined>(undefined);
    const [isServiceDetailsLoading, setIsServiceDetailsLoading] = useState<boolean>(false);
    const [isServiceDetailsLoaded, setIsServiceDetailsLoaded] = useState<boolean>(false);
    const [isServiceDetailsLoadingFailed, setIsServiceDetailsLoadingFailed] = useState<boolean>(false);

    const [editServiceFormInitialValues, setEditServiceFormInitialValues] = useState<IService>(_.cloneDeep(ServiceEditFormInitialValues));

    const [isServiceEditInProgress, setIsServiceEditInProgress] = useState(false);
    const {consultationDurationList} = useSelector((state: IRootReducerState) => state.staticData);

    useEffect(() => {
        dispatch(setCurrentNavParams("Edit Service", null, () => {
            if (serviceId) {
                navigate(CommonService._routeConfig.ServiceDetails(serviceId));
            }
        }));
    }, [navigate, serviceId, dispatch]);

    const fetchServiceDetails = useCallback((serviceId: string) => {
        setIsServiceDetailsLoading(true);
        CommonService._serviceCategory.ServiceDetailsAPICall(serviceId, {})
            .then((response: IAPIResponseType<IService>) => {
                setServiceDetails(response.data);
                setIsServiceDetailsLoading(false);
                setIsServiceDetailsLoaded(true);
                setIsServiceDetailsLoadingFailed(false);
            }).catch((error: any) => {
            setServiceDetails(undefined);
            setIsServiceDetailsLoading(false);
            setIsServiceDetailsLoaded(false);
            setIsServiceDetailsLoadingFailed(true);
        })
    }, []);

    useEffect(() => {
        if (serviceId) {
            fetchServiceDetails(serviceId);
        }
    }, [serviceId, fetchServiceDetails]);

    useEffect(() => {
        if (serviceDetails) {
            console.log(serviceDetails);
            if (serviceDetails.initial_consultation.length === 0) {
                serviceDetails.initial_consultation = [CONSULTATION_BLOCK];
            }
            if (serviceDetails.followup_consultation.length === 0) {
                serviceDetails.followup_consultation = [CONSULTATION_BLOCK];
            }
            setEditServiceFormInitialValues({
                name: serviceDetails.name,
                description: serviceDetails.description,
                image: serviceDetails.image,
                category_id: serviceDetails.category_id,
                is_active: serviceDetails.is_active,
                initial_consultation: serviceDetails.initial_consultation,
                followup_consultation: serviceDetails.followup_consultation
            });
        }
    }, [serviceDetails]);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        if (serviceId) {
            const payload = {...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['duration_details'])};
            if (!(payload.image instanceof File)) {
                delete payload.image;
            }
            setIsServiceEditInProgress(true);
            const formData = CommonService.getFormDataFromJSON(payload);
            CommonService._service.ServiceEditAPICall(serviceId, formData)
                .then((response: IAPIResponseType<IService>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setIsServiceEditInProgress(false);
                    if (serviceId) {
                        navigate(CommonService._routeConfig.ServiceDetails(serviceId));
                    }
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error, true);
                    setIsServiceEditInProgress(false);
                });
        }
    }, [navigate, serviceId]);

    const handleBackNavigation = useCallback(() => {
        if (serviceId) {
            navigate(CommonService._routeConfig.ServiceDetails(serviceId));
        }
    }, [navigate, serviceId]);

    return (
        <div className={'service-add-component'}>
            <div className={'service-category-service-edit-form'}>
                {
                    !serviceId && <StatusCardComponent title={"Service ID Not Found, Cannot edit a service"}/>
                }
                {
                    isServiceDetailsLoading && <LoaderComponent/>
                }
                {
                    isServiceDetailsLoadingFailed &&
                    <StatusCardComponent title={"Unable to load data. Please wait a moment and try again."}/>
                }
                {
                    (isServiceDetailsLoaded && serviceId) &&
                    <>
                        <Formik
                            validationSchema={serviceEditFormValidationSchema}
                            initialValues={editServiceFormInitialValues}
                            onSubmit={onSubmit}
                            validateOnChange={false}
                            validateOnBlur={true}
                            enableReinitialize={true}
                            validateOnMount={true}>
                            {({values, touched, errors, setFieldValue, validateForm}) => {
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useEffect(() => {
                                    validateForm();
                                }, [validateForm, values]);
                                return (
                                    <Form className="t-form" noValidate={true}>
                                        <>
                                            <div
                                                className={"display-flex align-items-center ts-justify-content-between"}>
                                                <FormControlLabelComponent label={"Edit Service"} size={'xl'}/>
                                                <div className={'status-text-wrapper'}>
                                                    <span className={'status-text'}>Status:</span>
                                                    <Field name={'is_active'} className="t-form-control">
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikSwitchComponent
                                                                    label={values.is_active ? "Active" : "Inactive"}
                                                                    required={true}
                                                                    formikField={field}
                                                                    labelPlacement={"start"}
                                                                    id={"sc_edit_is_active_toggle"}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                            </div>
                                        </>
                                        <CardComponent title={"Service Details"}>
                                            <div className={"ts-row"}>
                                                <div className="ts-col-lg-10">
                                                    <Field name={'name'}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikInputComponent
                                                                    label={'Service Name'}
                                                                    placeholder={'Service Name'}
                                                                    required={true}
                                                                    formikField={field}
                                                                    fullWidth={true}
                                                                    titleCase={true}
                                                                    id={"sv_edit_name_input"}
                                                                />
                                                            )
                                                        }

                                                    </Field>
                                                    <Field name={'description'}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikTextAreaComponent formikField={field}
                                                                                         label={'Service Description'}
                                                                                         placeholder={'Service Description'}
                                                                                         fullWidth={true}
                                                                                         required={true}
                                                                                         id={"sv_edit_desc_input"}
                                                                />)
                                                        }
                                                    </Field>
                                                </div>
                                            </div>
                                        </CardComponent>
                                        <FieldArray
                                            name="initial_consultation"
                                            render={arrayHelpers => (
                                                <CardComponent title={"Initial Consultation Details"}
                                                               className={"consultation-card-item"}
                                                               size={"md"}>
                                                    <>
                                                        {values?.initial_consultation && values?.initial_consultation?.map((item: any, index: any) => {
                                                            return (
                                                                <div key={index}>
                                                                    <div
                                                                        className={"display-flex ts-align-items-center"}>
                                                                        <FormControlLabelComponent
                                                                            label={`Consultation ${index + 1}`}/>
                                                                        <div>
                                                                            {values?.initial_consultation?.length !== 1 &&
                                                                                <ButtonComponent
                                                                                    className={'mrg-bottom-10 mrg-left-20'}
                                                                                    color={'error'}
                                                                                    variant={'outlined'}
                                                                                    prefixIcon={
                                                                                        <ImageConfig.CrossOutlinedIcon/>}
                                                                                    onClick={() => {
                                                                                        arrayHelpers.remove(index);
                                                                                    }}
                                                                                    id={"sv_ic_remove_" + index}
                                                                                >
                                                                                    Remove Consultation
                                                                                </ButtonComponent>}
                                                                        </div>
                                                                    </div>
                                                                    <div className={"ts-row"}>
                                                                        <div className="ts-col-lg-10">
                                                                            <Field
                                                                                name={`initial_consultation[${index}].title`}>
                                                                                {
                                                                                    (field: FieldProps) => (
                                                                                        <FormikInputComponent
                                                                                            label={'Title'}
                                                                                            placeholder={'Title'}
                                                                                            type={"text"}
                                                                                            formikField={field}
                                                                                            fullWidth={true}
                                                                                            id={"sv_ic_title_" + index}
                                                                                        />
                                                                                    )
                                                                                }
                                                                            </Field>
                                                                        </div>
                                                                    </div>
                                                                    <FieldArray
                                                                        name={`initial_consultation[${index}].consultation_details`}
                                                                        render={({push, remove}) => (
                                                                            <div>
                                                                                {values?.initial_consultation[index].consultation_details && values?.initial_consultation[index].consultation_details?.map((item: any, iIndex: any) => {
                                                                                    return (
                                                                                        <div key={iIndex}
                                                                                             className={"ts-row"}>
                                                                                            <div
                                                                                                className="ts-col-lg-5">
                                                                                                <Field
                                                                                                    name={`initial_consultation[${index}].consultation_details[${iIndex}].duration`}>
                                                                                                    {
                                                                                                        (field: FieldProps) => (
                                                                                                            <FormikSelectComponent
                                                                                                                formikField={field}
                                                                                                                fullWidth={true}
                                                                                                                required={true}
                                                                                                                keyExtractor={item => item.id}
                                                                                                                label={"Duration"}
                                                                                                                selectedValues={values?.initial_consultation[index].consultation_details?.map((item: any) => item.duration)}
                                                                                                                options={consultationDurationList}
                                                                                                                id={"sv_ic_cd_duration_" + index}
                                                                                                            />
                                                                                                        )
                                                                                                    }
                                                                                                </Field>
                                                                                            </div>
                                                                                            <div
                                                                                                className="ts-col-lg-5">
                                                                                                <Field
                                                                                                    name={`initial_consultation[${index}].consultation_details[${iIndex}].price`}>
                                                                                                    {
                                                                                                        (field: FieldProps) => (
                                                                                                            <FormikInputComponent
                                                                                                                label={'Price'}
                                                                                                                placeholder={'Price'}
                                                                                                                // type={"number"}
                                                                                                                required={true}
                                                                                                                prefix={Misc.CURRENCY_SYMBOL}
                                                                                                                formikField={field}
                                                                                                                fullWidth={true}
                                                                                                                id={"sv_ic_cd_price" + index}
                                                                                                                validationPattern={Patterns.POSITIVE_INTEGERS_WITH_DECIMALS}
                                                                                                            />
                                                                                                        )
                                                                                                    }
                                                                                                </Field>
                                                                                            </div>
                                                                                            <div
                                                                                                className="ts-col-lg-2">
                                                                                                {
                                                                                                    values?.initial_consultation[index].consultation_details.length > 1 &&
                                                                                                    <>
                                                                                                        <IconButtonComponent
                                                                                                            className={'mrg-top-5'}
                                                                                                            onClick={() => {
                                                                                                                remove(iIndex);
                                                                                                            }}
                                                                                                            id={"sv_ic_cd_remove_" + index}
                                                                                                        >
                                                                                                            <ImageConfig.DeleteIcon/>
                                                                                                        </IconButtonComponent>
                                                                                                    </>
                                                                                                }
                                                                                                {
                                                                                                    iIndex === values?.initial_consultation[index].consultation_details.length - 1 &&
                                                                                                    <IconButtonComponent
                                                                                                        className={'mrg-top-5'}
                                                                                                        onClick={() => {
                                                                                                            push(_.cloneDeep(CONSULTATION_DURATION_SLOT));
                                                                                                        }}
                                                                                                        id={"sv_ic_cd_add"}
                                                                                                    >
                                                                                                        <ImageConfig.AddCircleIcon/>
                                                                                                    </IconButtonComponent>
                                                                                                }

                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        )
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        })
                                                        }
                                                        <HorizontalLineComponent className={'horizontal-divider'}/>
                                                        <div className={"h-v-center"}>
                                                            <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}
                                                                             className={'mrg-bottom-20'}
                                                                             onClick={() => {
                                                                                 arrayHelpers.push(_.cloneDeep(CONSULTATION_BLOCK))
                                                                             }}
                                                                             id={"sv_ic_add"}
                                                            >
                                                                Add Another Consultation
                                                            </ButtonComponent>
                                                        </div>
                                                    </>
                                                </CardComponent>
                                            )}/>
                                        <FieldArray
                                            name="followup_consultation"
                                            render={arrayHelpers => (
                                                <CardComponent title={"Follow-Up Consultation Details"}
                                                               className={"consultation-card-item"}
                                                               size={"md"}>
                                                    <div>
                                                        {values?.followup_consultation && values?.followup_consultation?.map((item: any, index: any) => {
                                                            return (
                                                                <div key={index}>
                                                                    <div
                                                                        className={"display-flex"}>
                                                                        <FormControlLabelComponent
                                                                            className={'mrg-top-10 mrg-right-20'}
                                                                            label={`Consultation ${index + 1}`}/>
                                                                        <div>
                                                                            {values?.followup_consultation?.length > 1 &&
                                                                                <ButtonComponent
                                                                                    color={'error'}
                                                                                    variant={'outlined'}
                                                                                    prefixIcon={
                                                                                        <ImageConfig.CrossOutlinedIcon/>}
                                                                                    onClick={() => {
                                                                                        arrayHelpers.remove(index);
                                                                                    }}
                                                                                    id={"sv_fc_remove" + index}
                                                                                >
                                                                                    Remove Consultation
                                                                                </ButtonComponent>}
                                                                        </div>
                                                                    </div>
                                                                    <div className={"ts-row"}>
                                                                        <div className="ts-col-lg-10">
                                                                            <Field
                                                                                name={`followup_consultation[${index}].title`}>
                                                                                {
                                                                                    (field: FieldProps) => (
                                                                                        <FormikInputComponent
                                                                                            label={'Title'}
                                                                                            placeholder={'Title'}
                                                                                            type={"text"}
                                                                                            formikField={field}
                                                                                            fullWidth={true}
                                                                                            id={"sv_fc_title_" + index}
                                                                                        />
                                                                                    )
                                                                                }
                                                                            </Field>
                                                                        </div>
                                                                    </div>
                                                                    <FieldArray
                                                                        name={`followup_consultation[${index}].consultation_details`}
                                                                        render={({push, remove}) => (
                                                                            <div>
                                                                                {values?.followup_consultation[index].consultation_details && values?.followup_consultation[index].consultation_details?.map((item: any, iIndex: any) => {
                                                                                    return (
                                                                                        <div key={iIndex}
                                                                                             className={"ts-row"}>
                                                                                            <div
                                                                                                className="ts-col-lg-5">
                                                                                                <Field
                                                                                                    name={`followup_consultation[${index}].consultation_details[${iIndex}].duration`}>
                                                                                                    {
                                                                                                        (field: FieldProps) => (
                                                                                                            <FormikSelectComponent
                                                                                                                formikField={field}
                                                                                                                fullWidth={true}
                                                                                                                // required={true}
                                                                                                                keyExtractor={item => item.id}
                                                                                                                label={"Duration"}
                                                                                                                selectedValues={values?.followup_consultation[index].consultation_details?.map((item: any) => item.duration)}
                                                                                                                options={consultationDurationList}
                                                                                                                id={"sv_fc_cd_duration_" + index}
                                                                                                            />
                                                                                                        )
                                                                                                    }
                                                                                                </Field>
                                                                                            </div>
                                                                                            <div
                                                                                                className="ts-col-lg-5">
                                                                                                <Field
                                                                                                    name={`followup_consultation[${index}].consultation_details[${iIndex}].price`}>
                                                                                                    {
                                                                                                        (field: FieldProps) => (
                                                                                                            <FormikInputComponent
                                                                                                                label={'Price'}
                                                                                                                placeholder={'Price'}
                                                                                                                // type={"number"}
                                                                                                                // required={true}
                                                                                                                prefix={Misc.CURRENCY_SYMBOL}
                                                                                                                formikField={field}
                                                                                                                fullWidth={true}
                                                                                                                id={"sv_fc_cd_price_" + index}
                                                                                                                validationPattern={Patterns.POSITIVE_INTEGERS_WITH_DECIMALS}
                                                                                                            />
                                                                                                        )
                                                                                                    }
                                                                                                </Field>
                                                                                            </div>
                                                                                            <div
                                                                                                className="ts-col-lg-2">
                                                                                                {
                                                                                                    values?.followup_consultation[index].consultation_details.length > 1 &&
                                                                                                    <>
                                                                                                        <IconButtonComponent
                                                                                                            className={'mrg-top-5'}
                                                                                                            onClick={() => {
                                                                                                                remove(iIndex);
                                                                                                            }}
                                                                                                            id={"sv_fc_cd_remove_" + index}
                                                                                                        >
                                                                                                            <ImageConfig.DeleteIcon/>
                                                                                                        </IconButtonComponent>
                                                                                                    </>
                                                                                                }
                                                                                                {
                                                                                                    iIndex === values?.followup_consultation[index].consultation_details.length - 1 &&
                                                                                                    <IconButtonComponent
                                                                                                        className={'mrg-top-5'}
                                                                                                        onClick={() => {
                                                                                                            push(_.cloneDeep(CONSULTATION_DURATION_SLOT));
                                                                                                        }}
                                                                                                        id={"sv_fc_cd_add"}
                                                                                                    >
                                                                                                        <ImageConfig.AddCircleIcon/>
                                                                                                    </IconButtonComponent>
                                                                                                }

                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        )
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        })
                                                        }
                                                        <HorizontalLineComponent className={'horizontal-divider'}/>
                                                        <div className={"h-v-center"}>
                                                            <ButtonComponent className={'mrg-bottom-20'}
                                                                             prefixIcon={<ImageConfig.AddIcon/>}
                                                                             onClick={() => {
                                                                                 arrayHelpers.push(_.cloneDeep(CONSULTATION_BLOCK))
                                                                             }}
                                                                             id={"sv_fc_add"}
                                                            >
                                                                Add Another Consultation
                                                            </ButtonComponent>
                                                        </div>
                                                    </div>
                                                </CardComponent>
                                            )}/>
                                        <div className={'image-wrapper'}>
                                            <CardComponent title="Upload Image*">
                                                <>
                                                    {(!values.image) && <>
                                                        <FilePickerComponent maxFileCount={1}
                                                                             onFilesDrop={(acceptedFiles, rejectedFiles) => {
                                                                                 if (acceptedFiles && acceptedFiles.length > 0) {
                                                                                     const file = acceptedFiles[0];
                                                                                     setFieldValue('image', file);
                                                                                 }
                                                                             }}
                                                                             acceptedFilesText={"PNG, JPG and JPEG files are allowed"}
                                                                             acceptedFileTypes={["png", "jpg", "jpeg"]}
                                                                             id={"sv_upload_btn"}
                                                        />
                                                        {
                                                            (_.get(touched, "image") && !!(_.get(errors, "image"))) &&
                                                            <ErrorComponent
                                                                errorText={(_.get(errors, "image"))}/>
                                                        }
                                                    </>
                                                    }
                                                </>
                                                <>
                                                    {
                                                        (values.image) && <>
                                                            <FilePreviewThumbnailComponent
                                                                file={values.image}
                                                                removeButtonId={"sv_delete_img"}
                                                                onRemove={() => {
                                                                    setFieldValue('image', '');
                                                                }}/>
                                                        </>
                                                    }
                                                </>
                                            </CardComponent>
                                        </div>
                                        <div className="t-form-actions">
                                            {/*<LinkComponent route={CommonService._routeConfig.ServiceDetails(serviceId)}>*/}
                                            <ButtonComponent
                                                variant={"outlined"}
                                                size={"large"}
                                                onClick={handleBackNavigation}
                                                disabled={isServiceEditInProgress}
                                                id={"sv_cancel_btn"}
                                            >
                                                Cancel
                                            </ButtonComponent>
                                            {/*</LinkComponent>*/}
                                            &nbsp; &nbsp;
                                            <ButtonComponent
                                                isLoading={isServiceEditInProgress}
                                                type={"submit"}
                                                size={"large"}
                                                id={"sv_save_btn"}
                                            >
                                                {isServiceEditInProgress ? "Saving" : "Save"}
                                            </ButtonComponent>
                                        </div>

                                    </Form>
                                )
                            }}
                        </Formik>
                    </>
                }
            </div>
        </div>
    );

};

export default ServiceEditScreen;
