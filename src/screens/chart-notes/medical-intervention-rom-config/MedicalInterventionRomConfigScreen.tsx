import "./MedicalInterventionRomConfigScreen.scss";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import TableComponent from "../../../shared/components/table/TableComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import {Field, FieldArray, FieldProps, Form, Formik} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import _ from "lodash";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";

interface MedicalInterventionRomConfigScreenProps {

}

const medicalInterventionDetails = {
    injury_details: [
        {
            body_part_id: "63aaa520fa2621a3af6ace13",
            body_side: "Left",
            body_part_details: {
                "_id": "63aaa40bfa2621a3af6ace12",
                "name": "Jaw",
                "sides": ['Left', 'Right', 'Central'],
                "movements": [
                    {
                        "name": "Lateral Deviation",
                        "applicable_rom": ["AROM", "Strength"],
                        "applicable_sides": ['Left', 'Right', 'Central']
                    },
                    {
                        "name": "Protrusion",
                        "applicable_rom": ["AROM", "Strength", "PROM"],
                        "applicable_sides": ['Left', 'Right']
                    },
                    {
                        "name": "Elevation (Closing)",
                        "applicable_rom": ["AROM", "Strength", "PROM"],
                        "applicable_sides": ['Left', 'Right']
                    },
                    {
                        "name": "Retraction",
                        "applicable_rom": ["AROM", "Strength", "PROM"],
                        "applicable_sides": ['Left', 'Right']
                    }
                ],
                "special_tests": [
                    "Tinel’s Test",
                    "Valgus Stress Test",
                    "Varusus Stress Test",
                    "Lateral Epicondylitis Test"
                ],
                "default_body_side": "Central"
            }
        },
        {
            body_part_id: "63aaa520fa2621a3af6ace14",
            body_side: "Right",
            body_part_details: {
                "_id": "63aaa40bfa2621a3af6ace12",
                "name": "Shoulder",
                "sides": ['Left', 'Right'],
                "movements": [
                    {
                        "name": "Lateral Deviation",
                        "applicable_rom": ["AROM", "Strength"],
                        "applicable_sides": ['Left', 'Right', 'Central']
                    },
                    {
                        "name": "Protrusion",
                        "applicable_rom": ["AROM", "Strength", "PROM"],
                        "applicable_sides": ['Left', 'Right']
                    },
                    {
                        "name": "Elevation (Closing)",
                        "applicable_rom": ["AROM", "Strength", "PROM"],
                        "applicable_sides": ['Left', 'Right']
                    },
                    {
                        "name": "Retraction",
                        "applicable_rom": ["AROM", "Strength", "PROM"],
                        "applicable_sides": ['Left', 'Right']
                    }
                ],
                "special_tests": [
                    "Tinel’s Test",
                    "Valgus Stress Test",
                    "Varusus Stress Test",
                    "Lateral Epicondylitis Test"
                ],
                "default_body_side": "Central"
            }
        }
    ]
};

const MedicalInterventionRomConfigScreen = (props: MedicalInterventionRomConfigScreenProps) => {

    const [romConfigValues, setRomConfigValues] = useState<any>({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {medicalInterventionId} = useParams();
    const [isInterventionCommentsModalOpen, setIsInterventionCommentsModalOpen] = useState(false);
    // const {medicalInterventionDetails} = useSelector((state: IRootReducerState) => state.chartNotes);

    useEffect(() => {
        dispatch(setCurrentNavParams("SOAP Note", null, () => {
            medicalInterventionId && navigate(CommonService._routeConfig.AddMedicalIntervention(medicalInterventionId));
        }));
    }, [dispatch, navigate, medicalInterventionId]);

    // useEffect(() => {
    //     if (medicalInterventionId && !medicalInterventionDetails) {
    //         dispatch(getMedicalInterventionDetails(medicalInterventionId));
    //     }
    // }, [medicalInterventionId, medicalInterventionDetails, dispatch]);

    const generateROMConfigColumns = useCallback((bodyPartConfig: any) => {
        console.log("bodyPartConfig", bodyPartConfig);
        const columns: any = [
            {
                title: 'Movement',
                key: 'movement',
                render: (_: any, record: any) => {
                    return record.name;
                }
            }
        ];
        bodyPartConfig.selected_sides.forEach((side: any) => {
            columns.push({
                title: side,
                children: [
                    {
                        title: 'AROM',
                        key: 'arom',
                        render: (_: any, record: any) => {
                            return <Field
                                name={`${bodyPartConfig.body_part_id}.${record?.name}.${side}.arom`}
                                className="t-form-control">
                                {
                                    (field: FieldProps) => (
                                        <FormikInputComponent
                                            formikField={field}
                                            size={"small"}/>
                                    )
                                }
                            </Field>;
                        }
                    },
                    {
                        title: 'PROM',
                        key: 'prom',
                        render: (_: any, record: any) => {
                            return <Field
                                name={`${bodyPartConfig.body_part_id}.${record?.name}.${side}.prom`}
                                className="t-form-control">
                                {
                                    (field: FieldProps) => (
                                        <FormikInputComponent
                                            formikField={field}
                                            size={"small"}
                                        />
                                    )
                                }
                            </Field>;
                        }
                    },
                    {
                        title: 'Strength',
                        key: 'strength',
                        render: (_: any, record: any) => {
                            return <Field
                                name={`${bodyPartConfig.body_part_id}.${record?.name}.${side}.strength`}
                                className="t-form-control">
                                {
                                    (field: FieldProps) => (
                                        <FormikInputComponent
                                            formikField={field}
                                            size={"small"}/>
                                    )
                                }
                            </Field>;
                        }
                    },
                ]
            });
        });
        columns.push({
            title: '',
            key: 'comments',
            render: (_: any, record: any) => {
                return <IconButtonComponent color={record?.comment?.length > 0 ? "primary" : "inherit"}
                onClick={()=>setIsInterventionCommentsModalOpen(true)}>
                    <ImageConfig.CommentIcon/>
                </IconButtonComponent>
            }
        });
        return columns;
    }, []);

    const generateROMConfigForAnInjury = useCallback((injury: any) => {
        const bodyPartConfig: any = _.cloneDeep(injury);
        bodyPartConfig.selected_sides = [injury.body_side];
        bodyPartConfig.body_part_details.movements = injury.body_part_details.movements.map((movement: any, index: number) => {
            return {...movement, comment: "", commentMode: "add", commentTemp: ""};
        });
        bodyPartConfig.tableConfig = generateROMConfigColumns(bodyPartConfig);
        return bodyPartConfig;
    }, [generateROMConfigColumns]);

    useEffect(() => {
        const romConfig: any = [];
        console.log('medicalInterventionDetails', medicalInterventionDetails);
        if (medicalInterventionDetails.injury_details) {
            const injuryDetails = medicalInterventionDetails.injury_details;
            injuryDetails.forEach((injury: any) => {
                const injuryConfig = generateROMConfigForAnInjury(injury);
                romConfig.push(injuryConfig);
            });
            console.log("romConfig", {romConfig});
            setRomConfigValues({romConfig});
        }
    }, [medicalInterventionDetails, generateROMConfigForAnInjury]);

    return (
        <div className={'medical-intervention-rom-config-screen'}>
            <FormControlLabelComponent label={'Range of Motion and Strength'}/>
            <Formik initialValues={romConfigValues}
                    enableReinitialize={true}
                    onSubmit={(values, formikHelpers) => {
                        console.log(values);
                    }}>
                {({values, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            {/*<FormDebuggerComponent values={values}/>*/}
                            <FieldArray
                                name="romConfig"
                                render={(arrayHelpers) => (
                                    <>
                                        {values?.romConfig && values?.romConfig?.map((item: any, index: any) => {
                                            return (
                                                <CardComponent title={"Body Part: " + item.body_part_details.name}
                                                               key={item.body_part_details._id + index}
                                                               actions={<>
                                                                   <ButtonComponent
                                                                       size={"small"}
                                                                       prefixIcon={<ImageConfig.DeleteIcon/>}
                                                                       onClick={() => {
                                                                           arrayHelpers.remove(index);
                                                                       }}
                                                                   >
                                                                       Delete
                                                                   </ButtonComponent>
                                                               </>}
                                                >
                                                    {
                                                        item.body_part_details.sides.map((side: any, index: number) => {
                                                            return <CheckBoxComponent
                                                                label={side}
                                                                key={index + side}
                                                                checked={item.selected_sides.includes(side)}
                                                                onChange={(isChecked) => {
                                                                    console.log("isChecked", isChecked, side);
                                                                }
                                                                }
                                                            />
                                                        })
                                                    }
                                                    <TableComponent
                                                        data={item.body_part_details.movements}
                                                        bordered={true}
                                                        columns={item.tableConfig}/>
                                                    <ModalComponent isOpen={isInterventionCommentsModalOpen}
                                                                    title={"Comments"}
                                                                    closeOnBackDropClick={true}
                                                                    className={"intervention-comments-modal"}
                                                                    modalFooter={<>
                                                                        <ButtonComponent variant={"outlined"} onClick={()=>setIsInterventionCommentsModalOpen(false)}>
                                                                            Cancel
                                                                        </ButtonComponent>&nbsp;
                                                                        <ButtonComponent onClick={()=>setIsInterventionCommentsModalOpen(false)}>
                                                                            Add
                                                                        </ButtonComponent>
                                                                    </>
                                                                    }>
                                                        <Field
                                                            name={"comments"}
                                                            className="t-form-control">
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikTextAreaComponent
                                                                        label={""}
                                                                        placeholder={"Enter your comments here..."}
                                                                        formikField={field}
                                                                        size={"small"}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    </ModalComponent>
                                                </CardComponent>
                                            )
                                        })}
                                    </>
                                )}/>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );

};

export default MedicalInterventionRomConfigScreen;
