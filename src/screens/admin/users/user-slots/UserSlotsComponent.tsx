import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUserBasicDetails} from "../../../../store/actions/user.action";
import {useParams, useSearchParams} from "react-router-dom";
import {IRootReducerState} from "../../../../store/reducers";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent,
} from "../../../../shared/components/tabs/TabsComponent";
import CardComponent from "../../../../shared/components/card/CardComponent";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikSelectComponent from "../../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import FormikCheckBoxComponent
    from "../../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import IconButtonComponent from "../../../../shared/components/icon-button/IconButtonComponent";
import {ImageConfig, Misc} from "../../../../constants";
import {CommonService} from "../../../../shared/services";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";

import './UserSlotsComponent.scss';

interface UserSlotsComponentProps {
}

const InitialValue: any = {
    is_same_slots: false,
    all_scheduled_slots: [
        {
            start_time: "",
            end_time: "",
            service_id: ""
        },
    ],
    day_scheduled_slots: [
        {
            dayId: 1,
            dayName: 'Monday',
            is_selected: false,
            slot_timings: [
                {
                    start_time: "",
                    end_time: "",
                    service_id: ""
                }
            ]
        },
        {
            dayId: 2,
            dayName: 'Tuesday',
            is_selected: false,
            slot_timings: [
                {
                    start_time: "",
                    end_time: "",
                    service_id: ""
                }
            ]
        },
        {
            dayId: 3,
            dayName: 'Wednesday',
            is_selected: false,
            slot_timings: [
                {
                    start_time: "",
                    end_time: "",
                    service_id: ""
                }
            ]
        },
        {
            dayId: 4,
            dayName: 'Thursday',
            is_selected: false,
            slot_timings: [
                {
                    start_time: "",
                    end_time: "",
                    service_id: ""
                }
            ]
        },
        {
            dayId: 5,
            dayName: 'Friday',
            is_selected: false,
            slot_timings: [
                {
                    start_time: "",
                    end_time: "",
                    service_id: ""
                }
            ]
        },
        {
            dayId: 6,
            dayName: 'Saturday',
            is_selected: false,
            slot_timings: [
                {
                    start_time: "",
                    end_time: "",
                    service_id: ""
                }
            ]
        },
        {
            dayId: 7,
            dayName: 'Sunday',
            is_selected: false,
            slot_timings: [
                {
                    start_time: "",
                    end_time: "",
                    service_id: ""
                }
            ]
        }
    ],
}

const UserSlotsComponent = (props: UserSlotsComponentProps) => {

        const dispatch = useDispatch();
        const {userId}: any = useParams();
        const {
            isUserBasicDetailsLoaded,
            isUserBasicDetailsLoading,
            isUserBasicDetailsLoadingFailed,
            userBasicDetails,
        } = useSelector((state: IRootReducerState) => state.user);
        const {serviceListLite} = useSelector((state: IRootReducerState) => state.service)
        const [currentTab, setCurrentTab] = useState<any>(userBasicDetails?.assigned_facility_details[0]?._id || '');
        const [searchParams, setSearchParams] = useSearchParams();
        const [facilityId, setFacilityId] = useState<any>("")

        useEffect(() => {
            if (userId) {
                dispatch(getUserBasicDetails(userId));
            }
        }, [dispatch, userId]);

        useEffect(() => {
            let currentTab: any = searchParams.get("currentStepId");
            setCurrentTab(currentTab);
            setFacilityId(currentTab);
        }, [searchParams]);

        const handleTabChange = useCallback((e: any, value: any) => {
            searchParams.set("currentStepId", value);
            setSearchParams(searchParams);
            setCurrentTab(value);
            setFacilityId(value);
        }, []);

        const onSlotAdd = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
            const payload = {...values}

            if (payload.is_same_slots) {
                payload.all_scheduled_slots.forEach((slot: any, index: any) => {
                    if (!payload?.service_slots) {
                        payload.service_slots = {};
                    }
                    if (!payload?.service_slots[slot.service_id]) {
                        payload.service_slots[slot.service_id] = [];
                    }
                    payload.service_slots[slot.service_id].push({
                        start_time: slot.start_time,
                        end_time: slot.end_time
                    });
                })
            } else {

            }
            setSubmitting(true);
            CommonService._user.addUserSlots(userId, facilityId, payload)
                .then((response: any) => {
                    setSubmitting(false);
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                }).catch((error: any) => {
                setSubmitting(false);
                CommonService.handleErrors(setErrors, error, true);
            });

        }, []);

        return (
            <div className="user-slots-component">
                <>
                    {isUserBasicDetailsLoading && (
                        <div>
                            <LoaderComponent/>
                        </div>
                    )}
                    {isUserBasicDetailsLoadingFailed && (
                        <StatusCardComponent title={"Failed to fetch client Details"}/>
                    )}
                </>
                {isUserBasicDetailsLoaded && <>
                    <TabsWrapperComponent>
                        <div className="tabs-wrapper">
                            <TabsComponent
                                value={currentTab}
                                allowScrollButtonsMobile={false}
                                variant={"fullWidth"}
                                onUpdate={handleTabChange}
                            >
                                {userBasicDetails.assigned_facility_details.map((facility: any, index: any) => (
                                    <TabComponent className={'client-details-tab'} label={`facility${index + 1}`}
                                                  value={facility._id}/>
                                ))}
                            </TabsComponent>
                        </div>

                        {userBasicDetails?.assigned_facility_details.map((facility: any, index: any) => (
                            <TabContentComponent
                                key={facility._id}
                                value={facility._id}
                                selectedTab={currentTab}
                            >
                                <CardComponent title={'Available Hours and Service'}>
                                    <FormControlLabelComponent label={facility.name}/>
                                    <Formik initialValues={InitialValue}
                                            onSubmit={onSlotAdd}
                                            validateOnChange={false}
                                            validateOnBlur={true}
                                            enableReinitialize={true}
                                            validateOnMount={true}>
                                        {({
                                              values,
                                              isValid,
                                              touched,
                                              errors,
                                              setFieldValue,
                                              validateForm,
                                              isSubmitting
                                          }) => {
                                            // eslint-disable-next-line react-hooks/rules-of-hooks
                                            useEffect(() => {
                                                validateForm();
                                            }, [validateForm, values]);
                                            return (
                                                <Form className="t-form" noValidate={true}>
                                                    <div className={'ts-row'}>
                                                        <div className={'ts-col-2'}>
                                                            <Field name={'is_same_slots'}>
                                                                {
                                                                    (field: FieldProps) => (
                                                                        <FormikCheckBoxComponent formikField={field}
                                                                                                 label={'Same for all days'}/>
                                                                    )
                                                                }
                                                            </Field>
                                                        </div>
                                                        {values.is_same_slots && <div className={'ts-col-10'}>
                                                            <FieldArray
                                                                name="all_scheduled_slots"
                                                                render={(arrayHelpers) => (
                                                                    <>
                                                                        {values?.all_scheduled_slots?.map((item: any, index: any) => {
                                                                            return (
                                                                                <div className={'ts-row'}>
                                                                                    <div className={'ts-col'}>
                                                                                        <Field
                                                                                            name={`all_scheduled_slots[${index}].start_time`}>
                                                                                            {
                                                                                                (field: FieldProps) => (
                                                                                                    <FormikSelectComponent
                                                                                                        options={CommonService.StartTimingsList}
                                                                                                        displayWith={(item) => item.title}
                                                                                                        valueExtractor={(item) => item.code}
                                                                                                        selectedValues={values?.all_scheduled_slots[index].start_time}
                                                                                                        label={'From'}
                                                                                                        required={true}
                                                                                                        formikField={field}
                                                                                                        fullWidth={true}
                                                                                                    />
                                                                                                )
                                                                                            }
                                                                                        </Field>
                                                                                    </div>
                                                                                    <div className={'ts-col'}>
                                                                                        <Field
                                                                                            name={`all_scheduled_slots[${index}].end_time`}>
                                                                                            {
                                                                                                (field: FieldProps) => (
                                                                                                    <FormikSelectComponent
                                                                                                        options={CommonService.StartTimingsList}
                                                                                                        displayWith={(item) => item.title}
                                                                                                        valueExtractor={(item) => item.code}
                                                                                                        label={'To'}
                                                                                                        selectedValues={values?.all_scheduled_slots[index].end_time}
                                                                                                        // disabled={!(values.all_scheduled_slots[index].start_time)}
                                                                                                        required={true}
                                                                                                        formikField={field}
                                                                                                        fullWidth={true}
                                                                                                    />
                                                                                                )
                                                                                            }
                                                                                        </Field>
                                                                                    </div>
                                                                                    <div className={'ts-col-4'}>
                                                                                        <Field
                                                                                            name={`all_scheduled_slots[${index}].service_id`}>
                                                                                            {
                                                                                                (field: FieldProps) => (
                                                                                                    <FormikSelectComponent
                                                                                                        options={serviceListLite}
                                                                                                        displayWith={(item) => item?.name}
                                                                                                        valueExtractor={(item) => item?._id}
                                                                                                        label={'Service Name'}
                                                                                                        // required={true}
                                                                                                        formikField={field}
                                                                                                        fullWidth={true}
                                                                                                    />
                                                                                                )
                                                                                            }
                                                                                        </Field>
                                                                                    </div>
                                                                                    <div className="ts-col-1">
                                                                                        <div className="d-flex">
                                                                                            <IconButtonComponent
                                                                                                className={"form-helper-icon"}
                                                                                                onClick={() => {
                                                                                                    arrayHelpers.push({
                                                                                                        start_time: "",
                                                                                                        end_time: "",
                                                                                                        service_id: ""
                                                                                                    });
                                                                                                }}
                                                                                            >
                                                                                                <ImageConfig.AddCircleIcon/>
                                                                                            </IconButtonComponent>
                                                                                            {index > 0 &&
                                                                                            <IconButtonComponent
                                                                                                className={"form-helper-icon"}
                                                                                                onClick={() => {
                                                                                                    arrayHelpers.remove(index);
                                                                                                }}
                                                                                            >
                                                                                                <ImageConfig.DeleteIcon/>
                                                                                            </IconButtonComponent>}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>)
                                                                        })
                                                                        }
                                                                    </>)}
                                                            />
                                                        </div>}
                                                    </div>

                                                    {!values.is_same_slots && <div className="mrg-top-20">
                                                        <FieldArray
                                                            name="day_scheduled_slots"
                                                            render={(arrayHelpers) => (
                                                                <>
                                                                    {values?.day_scheduled_slots?.map((item: any, index: any) => {
                                                                        return (
                                                                            <div className={'ts-row '}>
                                                                                <div className={'ts-col-2'}>
                                                                                    <Field
                                                                                        name={`values?.day_scheduled_slots[${index}].is_selected`}>
                                                                                        {
                                                                                            (field: FieldProps) => (
                                                                                                <FormikCheckBoxComponent
                                                                                                    formikField={field}
                                                                                                    label={item.dayName}/>
                                                                                            )
                                                                                        }
                                                                                    </Field>
                                                                                </div>

                                                                                <div className={'ts-col-10'}>
                                                                                    <FieldArray
                                                                                        name={`day_scheduled_slots[${index}].slot_timings`}
                                                                                        render={(arrayHelpers) => (
                                                                                            <>
                                                                                                {item?.slot_timings?.map((item: any, slotIndex: any) => {
                                                                                                    return (
                                                                                                        <div
                                                                                                            className={'ts-row'}>
                                                                                                            <div
                                                                                                                className={'ts-col'}>
                                                                                                                <Field
                                                                                                                    name={`day_scheduled_slots[${index}].slot_timings[${slotIndex}].start_time`}>
                                                                                                                    {
                                                                                                                        (field: FieldProps) => (
                                                                                                                            <FormikSelectComponent
                                                                                                                                options={CommonService.StartTimingsList}
                                                                                                                                displayWith={(item) => item.title}
                                                                                                                                valueExtractor={(item) => item.code}
                                                                                                                                selectedValues={values?.day_scheduled_slots[index].slot_timings[slotIndex].start_time}
                                                                                                                                label={'From'}
                                                                                                                                required={true}
                                                                                                                                formikField={field}
                                                                                                                                fullWidth={true}
                                                                                                                            />
                                                                                                                        )
                                                                                                                    }
                                                                                                                </Field>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                className={'ts-col'}>
                                                                                                                <Field
                                                                                                                    name={`day_scheduled_slots[${index}].slot_timings[${slotIndex}].end_time`}>
                                                                                                                    {
                                                                                                                        (field: FieldProps) => (
                                                                                                                            <FormikSelectComponent
                                                                                                                                options={CommonService.StartTimingsList}
                                                                                                                                displayWith={(item) => item.title}
                                                                                                                                valueExtractor={(item) => item.code}
                                                                                                                                label={'To'}
                                                                                                                                selectedValues={values?.day_scheduled_slots[index].slot_timings[slotIndex].end_time}
                                                                                                                                // disabled={!(values.slot_timings[index].start_time)}
                                                                                                                                required={true}
                                                                                                                                formikField={field}
                                                                                                                                fullWidth={true}
                                                                                                                            />
                                                                                                                        )
                                                                                                                    }
                                                                                                                </Field>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                className={'ts-col-4'}>
                                                                                                                <Field
                                                                                                                    name={`day_scheduled_slots[${index}].slot_timings[${slotIndex}].service_id`}>
                                                                                                                    {
                                                                                                                        (field: FieldProps) => (
                                                                                                                            <FormikSelectComponent
                                                                                                                                options={serviceListLite}
                                                                                                                                displayWith={(item) => item?.name}
                                                                                                                                valueExtractor={(item) => item?._id}
                                                                                                                                label={'Service Name'}
                                                                                                                                // required={true}
                                                                                                                                formikField={field}
                                                                                                                                fullWidth={true}
                                                                                                                            />
                                                                                                                        )
                                                                                                                    }
                                                                                                                </Field>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                className="ts-col-1">
                                                                                                                <div
                                                                                                                    className="d-flex">
                                                                                                                    <IconButtonComponent
                                                                                                                        className={"form-helper-icon"}
                                                                                                                        onClick={() => {
                                                                                                                            arrayHelpers.push({
                                                                                                                                start_time: "",
                                                                                                                                end_time: "",
                                                                                                                                service_id: ""
                                                                                                                            });
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <ImageConfig.AddCircleIcon/>
                                                                                                                    </IconButtonComponent>
                                                                                                                    {slotIndex > 0 &&
                                                                                                                    <IconButtonComponent
                                                                                                                        className={"form-helper-icon"}
                                                                                                                        onClick={() => {
                                                                                                                            arrayHelpers.remove(slotIndex);
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <ImageConfig.DeleteIcon/>
                                                                                                                    </IconButtonComponent>}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>)
                                                                                                })
                                                                                                }
                                                                                            </>)}
                                                                                    />
                                                                                </div>

                                                                            </div>
                                                                        )
                                                                    })
                                                                    }
                                                                </>)}
                                                        />
                                                    </div>}


                                                    <div className="t-form-actions">
                                                        <ButtonComponent
                                                            type='submit'
                                                        >
                                                            Save details
                                                        </ButtonComponent>
                                                    </div>
                                                </Form>
                                            )
                                        }}

                                    </Formik>

                                </CardComponent>
                            </TabContentComponent>
                        ))}
                    </TabsWrapperComponent>
                </>
                }
            </div>
        )
            ;
    }
;

export default UserSlotsComponent;
