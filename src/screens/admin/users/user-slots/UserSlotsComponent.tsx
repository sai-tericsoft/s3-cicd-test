import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUserBasicDetails, getUserSlots} from "../../../../store/actions/user.action";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
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
import _ from "lodash";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import * as Yup from "yup";

interface UserSlotsComponentProps {
}

const allSlotsTimeValidationSchema = Yup.object({
    start_time: Yup.string().required('Start time is required'),
    end_time: Yup.string().required('End time is required'),
    service_id: Yup.string().required('Service is required')
});

const validationSchema = Yup.object().shape({
    is_same_slots: Yup.boolean(),
    all_scheduled_slots: Yup.array().when('is_same_slots', {
        is: true,
        then: Yup.array().of(allSlotsTimeValidationSchema)
            .min(1, 'Select at least one record').required('Select at least one record')
    }),
    scheduled_slots: Yup.array().of(
        Yup.object().shape({
            day: Yup.number(),
            dayName: Yup.string(),
            is_selected: Yup.boolean(),
            slot_timings: Yup.array().when(['is_selected', 'is_same_slots'], {
                is: (is_selected: boolean, is_same_slots: boolean) => !is_same_slots && is_selected,
                then: Yup.array().of(allSlotsTimeValidationSchema).min(1, 'Select at least one record').required('Select at least one record'),
                otherwise: Yup.array().min(0) // No validation when is_same_slots is true or is_selected is false
            }),
        })
    )
        .test('at-least-one-record', 'Select at least one record', function (value: any) {
            const isSameSlots = this.parent.is_same_slots;
            const isAllSelectedFalse = value.every((record: any) => record.is_selected === false);
            return isSameSlots || !isAllSelectedFalse;
        }),
});

const InitialValue: any = {
    is_same_slots: false,
    all_scheduled_slots: [
        {
            start_time: "",
            end_time: "",
            service_id: ""
        },
    ],
    scheduled_slots: [
        {
            day: 0,
            dayName: 'Sunday',
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
            day: 1,
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
            day: 2,
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
            day: 3,
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
            day: 4,
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
            day: 5,
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
            day: 6,
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
            userSlots,
            isUserSlotsLoading,
            isUserSlotsLoaded,
            isUserSlotsLoadingFailed,
        } = useSelector((state: IRootReducerState) => state.user);
        const {serviceListLite} = useSelector((state: IRootReducerState) => state.service)
        const [currentTab, setCurrentTab] = useState<any>(userBasicDetails?.assigned_facilities || '');
        const [searchParams, setSearchParams] = useSearchParams();
        const [facilityId, setFacilityId] = useState<any>("")
        const [formInitialValues, setFormInitialValues] = useState(_.cloneDeep(InitialValue))
        const navigate = useNavigate();

        useEffect(() => {
            if (userId) {
                dispatch(getUserBasicDetails(userId));
            }
        }, [dispatch, userId]);

        useEffect(() => {
            dispatch(setCurrentNavParams('User Slots', null, () => {
                navigate(CommonService._routeConfig.UserList());
            }));
        }, [dispatch, navigate]);

        useEffect(() => {
            if (currentTab && userId) {
                dispatch(getUserSlots(userId, currentTab));
            }
        }, [dispatch, userId, currentTab]);


        useEffect(() => {
            if (isUserSlotsLoaded && userSlots && Object.keys(userSlots).length) {
                if (userSlots?.is_same_slots) {
                    const allScheduledSlots = {
                        is_same_slots: true,
                        all_scheduled_slots: userSlots?.all_scheduled_slots?.map((slot: any) => ({
                            start_time: slot.start_time,
                            end_time: slot.end_time,
                            service_id: slot.service_id
                        })),
                        scheduled_slots: InitialValue.scheduled_slots
                    };

                    setFormInitialValues(allScheduledSlots);

                } else {
                    const allSlots = _.cloneDeep(InitialValue.scheduled_slots);
                    const dayScheduledSlots = {
                        is_same_slots: false,
                        scheduled_slots: userSlots?.day_scheduled_slots?.map((slot: any) => ({
                            day: parseInt(slot.day),
                            dayName: slot.day_name,
                            is_selected: true,
                            slot_timings: slot.slot_timings?.map((timing: any) => ({
                                start_time: timing.start_time,
                                end_time: timing.end_time,
                                service_id: timing.service_id
                            }))
                        }))
                    };

                    console.log(dayScheduledSlots);

                    const updatedSlots = allSlots?.map((slot: any) => {
                        console.log(slot);
                        const matchingSlot = dayScheduledSlots?.scheduled_slots?.find((daySlot: any) => daySlot.dayName === slot.dayName);
                        console.log(matchingSlot)
                        if (matchingSlot) {
                            return matchingSlot;
                        } else {
                            return slot;
                        }
                    });

                    console.log(updatedSlots);
                    const updatedFormInitialValues = {
                        is_same_slots: dayScheduledSlots.is_same_slots,
                        scheduled_slots: updatedSlots,
                        all_scheduled_slots: InitialValue.all_scheduled_slots
                    };
                    setFormInitialValues(updatedFormInitialValues);
                }
            }
        }, [userSlots, isUserSlotsLoaded]);


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
        }, [searchParams, setSearchParams]);

        const onSlotAdd = useCallback(
            (values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
                const payload = {...values};
                if (payload.is_same_slots) {
                    delete payload.scheduled_slots;
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
                    delete payload.all_scheduled_slots;
                    payload.scheduled_slots = payload.scheduled_slots.filter(
                        (slot: any) => slot.is_selected
                    );

                    payload.scheduled_slots.forEach((day_slots: any) => {
                        const {day, slot_timings} = day_slots;

                        // Convert slot_timings to the desired format
                        const slots = slot_timings.map((slot: any) => ({
                            start_time: slot.start_time,
                            end_time: slot.end_time,
                            service_id: slot.service_id,
                        }));

                        // Update day_slots object
                        if (!payload.day_slots) {
                            payload.day_slots = {};
                        }
                        if (!payload.day_slots[day]) {
                            payload.day_slots[day] = {};
                        }
                        slots.forEach((slot: any) => {
                            if (!payload.day_slots[day][slot.service_id]) {
                                payload.day_slots[day][slot.service_id] = [];
                            }
                            payload.day_slots[day][slot.service_id].push({
                                start_time: slot.start_time,
                                end_time: slot.end_time,
                            });
                        });

                        // Update day_scheduled_slots object
                        if (!payload.day_scheduled_slots) {
                            payload.day_scheduled_slots = {};
                        }

                        if (!payload.day_scheduled_slots[day]) {
                            payload.day_scheduled_slots[day] = [];
                        }
                        payload.day_scheduled_slots[day].push(...slots);
                    });
                    delete payload.scheduled_slots;
                }
                console.log(payload);

                setSubmitting(true);

                // Perform the API request with the updated payload
                CommonService._user
                    .addUserSlots(userId, facilityId, payload)
                    .then((response) => {
                        setSubmitting(false);
                        // navigate(CommonService._routeConfig.UserList());
                        CommonService._alert.showToast(
                            response[Misc.API_RESPONSE_MESSAGE_KEY],
                            'success'
                        );
                    })
                    .catch((error) => {
                        setSubmitting(false);
                        CommonService.handleErrors(setErrors, error, true);
                    });
            },
            [facilityId, userId]
        );

        return (
            <div className="user-slots-component">
                <>
                    {isUserBasicDetailsLoading &&
                    <div>
                        <LoaderComponent/>
                    </div>
                    }
                    {isUserBasicDetailsLoadingFailed &&
                    <StatusCardComponent title={"Failed to fetch Details"}/>
                    }
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
                                {userBasicDetails.assigned_facility_details?.map((facility: any, index: any) => (
                                    <TabComponent className={'client-details-tab'} label={facility.name}
                                                  value={facility._id}/>
                                ))}
                            </TabsComponent>
                        </div>

                        {userBasicDetails?.assigned_facility_details?.map((facility: any, index: any) => (
                            <TabContentComponent
                                key={facility._id}
                                value={facility._id}
                                selectedTab={currentTab}
                            >
                                <CardComponent title={'Available Hours and Service'}>
                                    <FormControlLabelComponent label={facility.name}/>
                                    <>
                                        {isUserSlotsLoading && (
                                            <div>
                                                <LoaderComponent/>
                                            </div>
                                        )}
                                        {isUserSlotsLoadingFailed && (
                                            <StatusCardComponent title={"Failed to fetch Details"}/>
                                        )}
                                    </>
                                    {isUserSlotsLoaded && <Formik initialValues={formInitialValues}
                                                                  onSubmit={onSlotAdd}
                                                                  validationSchema={validationSchema}
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
                                                                            const timings = facility.timings[0];
                                                                            const start_time = parseInt(timings?.timings?.start_time);
                                                                            const end_time = parseInt(timings?.timings?.end_time);
                                                                            return (
                                                                                <div className={'ts-row'}>
                                                                                    <div className={'ts-col'}>
                                                                                        <Field
                                                                                            name={`all_scheduled_slots[${index}].start_time`}>
                                                                                            {
                                                                                                (field: FieldProps) => (
                                                                                                    <FormikSelectComponent
                                                                                                        options={CommonService.generateTimeSlots(start_time, end_time)}
                                                                                                        displayWith={(item) => item.title}
                                                                                                        valueExtractor={(item) => item.code}
                                                                                                        selectedValues={values?.all_scheduled_slots[index].start_time}
                                                                                                        label={'From'}
                                                                                                        required={true}
                                                                                                        formikField={field}
                                                                                                        fullWidth={true}
                                                                                                        onUpdate={(value: any) => {
                                                                                                            if (value) {
                                                                                                                setFieldValue(`all_scheduled_slots[${index}].end_time`, '')
                                                                                                            }
                                                                                                        }}
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
                                                                                                        options={CommonService.generateTimeSlots(parseInt(values?.all_scheduled_slots[index].start_time), end_time)}
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
                                                        <>
                                                            {values?.scheduled_slots?.map((item: any, index: any) => {
                                                                const timings = facility.timings.find((timing: any) => timing.day_name === item.dayName);
                                                                const start_time = parseInt(timings?.timings?.start_time);
                                                                const end_time = parseInt(timings?.timings?.end_time);
                                                                return (
                                                                    <div className={'ts-row '}>
                                                                        {facility.timings.find((timing: any) => {
                                                                            return timing.day_name === item.dayName
                                                                        }) && <>

                                                                            <div className={'ts-col-2'}>
                                                                                <Field
                                                                                    name={`scheduled_slots[${index}].is_selected`}>
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
                                                                                    name={`scheduled_slots[${index}].slot_timings`}
                                                                                    render={(arrayHelpers) => (
                                                                                        <>
                                                                                            {item?.slot_timings?.map((item: any, slotIndex: any) => {
                                                                                                return (
                                                                                                    <div
                                                                                                        className={'ts-row'}>
                                                                                                        <div
                                                                                                            className={'ts-col'}>
                                                                                                            <Field
                                                                                                                name={`scheduled_slots[${index}].slot_timings[${slotIndex}].start_time`}>
                                                                                                                {
                                                                                                                    (field: FieldProps) => (
                                                                                                                        <FormikSelectComponent
                                                                                                                            options={CommonService.generateTimeSlots(start_time, end_time)}
                                                                                                                            displayWith={(item) => item.title}
                                                                                                                            valueExtractor={(item) => item.code}
                                                                                                                            selectedValues={values?.scheduled_slots[index].slot_timings[slotIndex].start_time}
                                                                                                                            label={'From'}
                                                                                                                            disabled={!(values?.scheduled_slots[index].is_selected)}
                                                                                                                            required={true}
                                                                                                                            formikField={field}
                                                                                                                            fullWidth={true}
                                                                                                                            onUpdate={(value: any) => {
                                                                                                                                if (value) {
                                                                                                                                    setFieldValue(`scheduled_slots[${index}].slot_timings[${slotIndex}].end_time`, '')
                                                                                                                                }
                                                                                                                            }}
                                                                                                                        />
                                                                                                                    )
                                                                                                                }
                                                                                                            </Field>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className={'ts-col'}>
                                                                                                            <Field
                                                                                                                name={`scheduled_slots[${index}].slot_timings[${slotIndex}].end_time`}>
                                                                                                                {
                                                                                                                    (field: FieldProps) => (
                                                                                                                        <FormikSelectComponent
                                                                                                                            options={CommonService.generateTimeSlots(parseInt(values?.scheduled_slots[index].slot_timings[slotIndex].start_time), end_time)}
                                                                                                                            displayWith={(item) => item.title}
                                                                                                                            valueExtractor={(item) => item.code}
                                                                                                                            label={'To'}
                                                                                                                            selectedValues={values?.scheduled_slots[index].slot_timings[slotIndex].end_time}
                                                                                                                            disabled={!(values?.scheduled_slots[index].is_selected && values?.scheduled_slots[index].slot_timings[slotIndex].start_time)}
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
                                                                                                                name={`scheduled_slots[${index}].slot_timings[${slotIndex}].service_id`}>
                                                                                                                {
                                                                                                                    (field: FieldProps) => (
                                                                                                                        <FormikSelectComponent
                                                                                                                            options={serviceListLite}
                                                                                                                            displayWith={(item) => item?.name}
                                                                                                                            valueExtractor={(item) => item?._id}
                                                                                                                            label={'Service Name'}
                                                                                                                            disabled={!(values?.scheduled_slots[index].is_selected)}
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
                                                                                                                    disabled={!(values?.scheduled_slots[index].is_selected)}
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

                                                                        </>
                                                                        }
                                                                    </div>
                                                                )
                                                            })
                                                            }
                                                        </>
                                                    </div>}

                                                    <div className="t-form-actions">
                                                        <ButtonComponent
                                                            isLoading={isSubmitting}
                                                            disabled={!isValid}
                                                            type='submit'>
                                                            Save details
                                                        </ButtonComponent>
                                                    </div>
                                                </Form>
                                            )
                                        }}

                                    </Formik>}

                                </CardComponent>
                            </TabContentComponent>
                        ))}
                    </TabsWrapperComponent>

                    <div className="h-v-center">
                        <ButtonComponent onClick={() => navigate(CommonService._routeConfig.UserList())}>
                            Go Back
                        </ButtonComponent>
                    </div>
                </>
                }
            </div>
        )
            ;
    }
;

export default UserSlotsComponent;
