import "./ServiceAddScreen.scss";
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
import {IService} from "../../../../shared/models/service.model";
import LinkComponent from "../../../../shared/components/link/LinkComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";

interface ServiceAddComponentProps {
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

const ServiceAddFormInitialValues: IService = {
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

const ConsultationDurationSlotValidationSchema = Yup.object({
    duration: Yup.number().required("Duration is required"),
    price: Yup.number().required("Price is required"),
});

const InitialConsultationValidationSchema = Yup.object({
    title: Yup.string().nullable(),
    consultation_details: Yup.array(ConsultationDurationSlotValidationSchema),
})

const FollowupConsultationValidationSchema = Yup.object({
    title: Yup.string().nullable(),
    consultation_details: Yup.array(ConsultationDurationSlotValidationSchema),
})

const serviceAddFormValidationSchema = Yup.object({
    name: Yup.string()
        .required('The name field is required'),
    description: Yup.string()
        .nullable(),
    image: Yup.mixed()
        .required('The image field is required'),
    initial_consultation: Yup.array(InitialConsultationValidationSchema),
    followup_consultation: Yup.array(FollowupConsultationValidationSchema),
});

const ServiceAddScreen = (props: ServiceAddComponentProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {serviceCategoryId} = useParams();

    const [addServiceFormInitialValues] = useState<IService>(_.cloneDeep(ServiceAddFormInitialValues));

    const [isServiceAddInProgress, setIsServiceAddInProgress] = useState(false);
    const {consultationDurationList} = useSelector((state: IRootReducerState) => state.staticData);

    useEffect(() => {
        dispatch(setCurrentNavParams("Add Service", null, () => {
            if (serviceCategoryId) {
                navigate(CommonService._routeConfig.ServiceCategoryDetails(serviceCategoryId));
            }
        }));
    }, [navigate, serviceCategoryId, dispatch]);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        values["category_id"] = serviceCategoryId;
        setIsServiceAddInProgress(true);
        const formData = CommonService.getFormDataFromJSON(values);
        CommonService._service.ServiceAddAPICall(formData)
            .then((response: IAPIResponseType<IService>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsServiceAddInProgress(false);
                if (serviceCategoryId) {
                    navigate(CommonService._routeConfig.ServiceCategoryDetails(serviceCategoryId));
                }
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsServiceAddInProgress(false);
            })

    }, [navigate, serviceCategoryId]);

    return (
        <div className={'service-add-component'}>
            <div className={'service-category-service-add-form'}>
                {
                    !serviceCategoryId &&
                    <StatusCardComponent title={"Service Category Not Found, Cannot add a service"}/>
                }
                {
                    serviceCategoryId && <Formik
                        validationSchema={serviceAddFormValidationSchema}
                        initialValues={addServiceFormInitialValues}
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
                                    <CardComponent title={"Service Details"}>
                                        <div className={"ts-row"}>
                                            <div className="ts-col-lg-10">
                                                <Field name={'name'}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikInputComponent
                                                                label={'Service Name'}
                                                                placeholder={'Service Name'}
                                                                type={"text"}
                                                                formikField={field}
                                                                titleCase={true}
                                                                required={true}
                                                                fullWidth={true}
                                                                id={"sv_name_input"}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                                <Field name={'description'}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikTextAreaComponent
                                                                formikField={field}
                                                                label={'Service Description'}
                                                                placeholder={'Service Description'}
                                                                fullWidth={true}
                                                                id={"sv_desc_input"}
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
                                                           className={"mrg-bottom-20"}
                                                           size={"md"}
                                                           actions={<>
                                                               <ButtonComponent size={"small"}
                                                                                prefixIcon={<ImageConfig.AddIcon/>}
                                                                                onClick={() => {
                                                                                    arrayHelpers.push(_.cloneDeep(CONSULTATION_BLOCK))
                                                                                }}
                                                                                id={"sv_ic_add"}
                                                               >
                                                                   Add more
                                                               </ButtonComponent>
                                                           </>
                                                           }>
                                                <>
                                                    {values?.initial_consultation && values?.initial_consultation?.map((item: any, index: any) => {
                                                        return (
                                                            <div key={index}>
                                                                <div
                                                                    className={"display-flex align-items-center justify-content-space-between mrg-bottom-20"}>
                                                                    <FormControlLabelComponent
                                                                        label={`Initial Consultation Details ${index + 1}`}/>
                                                                    <div>
                                                                        {(index > 0) && <ButtonComponent
                                                                            prefixIcon={<ImageConfig.CloseIcon/>}
                                                                            onClick={() => {
                                                                                arrayHelpers.remove(index);
                                                                            }}
                                                                            id={"sv_ic_remove_" + index}
                                                                        >
                                                                            Remove
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
                                                                                        <div className="ts-col-lg-5">
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
                                                                                                            options={consultationDurationList}
                                                                                                            id={"sv_ic_cd_duration_" + index}
                                                                                                        />
                                                                                                    )
                                                                                                }
                                                                                            </Field>
                                                                                        </div>
                                                                                        <div className="ts-col-lg-5">
                                                                                            <Field
                                                                                                name={`initial_consultation[${index}].consultation_details[${iIndex}].price`}>
                                                                                                {
                                                                                                    (field: FieldProps) => (
                                                                                                        <FormikInputComponent
                                                                                                            label={'Price'}
                                                                                                            placeholder={'Price'}
                                                                                                            type={"number"}
                                                                                                            required={true}
                                                                                                            prefix={Misc.CURRENCY_SYMBOL}
                                                                                                            formikField={field}
                                                                                                            fullWidth={true}
                                                                                                            id={"sv_ic_cd_price" + index}
                                                                                                            validationPattern={Patterns.POSITIVE_INTEGERS_PARTIAL}
                                                                                                        />
                                                                                                    )
                                                                                                }
                                                                                            </Field>
                                                                                        </div>
                                                                                        <div className="ts-col-lg-2">
                                                                                            {
                                                                                                iIndex === values?.initial_consultation[index].consultation_details.length - 1 &&
                                                                                                <IconButtonComponent
                                                                                                    onClick={() => {
                                                                                                        push(_.cloneDeep(CONSULTATION_DURATION_SLOT))
                                                                                                    }}
                                                                                                    id={"sv_ic_cd_add"}
                                                                                                    disabled={!ConsultationDurationSlotValidationSchema.isValidSync(values?.initial_consultation[index]?.consultation_details[iIndex])}
                                                                                                >
                                                                                                    <ImageConfig.AddCircleIcon/>
                                                                                                </IconButtonComponent>
                                                                                            }
                                                                                            {
                                                                                                iIndex > 0 &&
                                                                                                <>
                                                                                                    &nbsp;
                                                                                                    <IconButtonComponent
                                                                                                        onClick={() => {
                                                                                                            remove(iIndex);
                                                                                                        }}
                                                                                                        id={"sv_ic_cd_remove_" + index}
                                                                                                    >
                                                                                                        <ImageConfig.DeleteIcon/>
                                                                                                    </IconButtonComponent>
                                                                                                </>
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
                                                </>
                                            </CardComponent>
                                        )}/>
                                    <FieldArray
                                        name="followup_consultation"
                                        render={arrayHelpers => (
                                            <CardComponent title={"Follow Up Consultation Details"}
                                                           className={"mrg-bottom-20"}
                                                           size={"md"}
                                                           actions={<>
                                                               <ButtonComponent size={"small"}
                                                                                prefixIcon={<ImageConfig.AddIcon/>}
                                                                                onClick={() => {
                                                                                    arrayHelpers.push(_.cloneDeep(CONSULTATION_BLOCK))
                                                                                }}
                                                                                id={"sv_fc_add"}
                                                               >
                                                                   Add more
                                                               </ButtonComponent>
                                                           </>
                                                           }>
                                                <div>
                                                    {values?.followup_consultation && values?.followup_consultation?.map((item: any, index: any) => {
                                                        return (
                                                            <div key={index}>
                                                                <div
                                                                    className={"display-flex align-items-center justify-content-space-between mrg-bottom-20"}>
                                                                    <FormControlLabelComponent
                                                                        label={`Follow Up Consultation Details ${index + 1}`}/>
                                                                    <div>
                                                                        {(index > 0) && <ButtonComponent
                                                                            prefixIcon={<ImageConfig.CloseIcon/>}
                                                                            onClick={() => {
                                                                                arrayHelpers.remove(index);
                                                                            }}
                                                                            id={"sv_fc_remove" + index}
                                                                        >
                                                                            Remove
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
                                                                                        <div className="ts-col-lg-5">
                                                                                            <Field
                                                                                                name={`followup_consultation[${index}].consultation_details[${iIndex}].duration`}>
                                                                                                {
                                                                                                    (field: FieldProps) => (
                                                                                                        <FormikSelectComponent
                                                                                                            formikField={field}
                                                                                                            fullWidth={true}
                                                                                                            required={true}
                                                                                                            keyExtractor={item => item.id}
                                                                                                            label={"Duration"}
                                                                                                            options={consultationDurationList}
                                                                                                            id={"sv_fc_cd_duration_" + index}
                                                                                                        />
                                                                                                    )
                                                                                                }
                                                                                            </Field>
                                                                                        </div>
                                                                                        <div className="ts-col-lg-5">
                                                                                            <Field
                                                                                                name={`followup_consultation[${index}].consultation_details[${iIndex}].price`}>
                                                                                                {
                                                                                                    (field: FieldProps) => (
                                                                                                        <FormikInputComponent
                                                                                                            label={'Price'}
                                                                                                            placeholder={'Price'}
                                                                                                            type={"number"}
                                                                                                            required={true}
                                                                                                            prefix={Misc.CURRENCY_SYMBOL}
                                                                                                            formikField={field}
                                                                                                            fullWidth={true}
                                                                                                            id={"sv_fc_cd_price_" + index}
                                                                                                            validationPattern={Patterns.POSITIVE_INTEGERS_PARTIAL}
                                                                                                        />
                                                                                                    )
                                                                                                }
                                                                                            </Field>
                                                                                        </div>
                                                                                        <div className="ts-col-lg-2">
                                                                                            {
                                                                                                iIndex === values?.followup_consultation[index].consultation_details.length - 1 &&
                                                                                                <IconButtonComponent
                                                                                                    onClick={() => {
                                                                                                        push(_.cloneDeep(CONSULTATION_DURATION_SLOT));
                                                                                                    }}
                                                                                                    id={"sv_fc_cd_add"}
                                                                                                    disabled={!ConsultationDurationSlotValidationSchema.isValidSync(values?.followup_consultation[index]?.consultation_details[iIndex])}
                                                                                                >
                                                                                                    <ImageConfig.AddCircleIcon/>
                                                                                                </IconButtonComponent>
                                                                                            }
                                                                                            {
                                                                                                iIndex > 0 &&
                                                                                                <>
                                                                                                    &nbsp;
                                                                                                    <IconButtonComponent
                                                                                                        onClick={() => {
                                                                                                            remove(iIndex);
                                                                                                        }}
                                                                                                        id={"sv_fc_cd_remove_" + index}
                                                                                                    >
                                                                                                        <ImageConfig.DeleteIcon/>
                                                                                                    </IconButtonComponent>
                                                                                                </>
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
                                                </div>
                                            </CardComponent>
                                        )}/>
                                    <CardComponent title={'Upload Image for Service'}>
                                            {(!values.image) && <>
                                                <FilePickerComponent maxFileCount={1}
                                                                     id={"sv_upload_btn"}
                                                                     onFilesDrop={(acceptedFiles, rejectedFiles) => {
                                                                         if (acceptedFiles && acceptedFiles.length > 0) {
                                                                             const file = acceptedFiles[0];
                                                                             setFieldValue('image', file);
                                                                         }
                                                                     }}
                                                                     acceptedFilesText={"PNG, JPG and JPEG files are allowed"}
                                                                     acceptedFileTypes={["png", "jpg", "jpeg"]}
                                                />
                                                {
                                                    (_.get(touched, "image") && !!(_.get(errors, "image"))) &&
                                                    <ErrorComponent
                                                        errorText={(_.get(errors, "image"))}/>
                                                }
                                            </>
                                            }
                                            {
                                                (values.image) && <>
                                                    <FilePreviewThumbnailComponent
                                                        file={values.image}
                                                        removeButtonId={"sv_delete_img"}
                                                        onRemove={() => {
                                                            setFieldValue('image', undefined);
                                                        }}/>
                                                </>
                                            }
                                    </CardComponent>
                                    <div className="t-form-actions">
                                        <LinkComponent
                                            route={CommonService._routeConfig.ServiceCategoryDetails(serviceCategoryId)}>
                                            <ButtonComponent
                                                variant={"outlined"}
                                                disabled={isServiceAddInProgress}
                                                id={"sv_cancel_btn"}
                                            >
                                                Cancel
                                            </ButtonComponent>
                                        </LinkComponent>
                                        &nbsp;
                                        <ButtonComponent
                                            isLoading={isServiceAddInProgress}
                                            type={"submit"}
                                            id={"sv_save_btn"}
                                        >
                                            {isServiceAddInProgress ? "Saving" : "Save"}
                                        </ButtonComponent>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                }
            </div>
        </div>
    );

};

export default ServiceAddScreen;