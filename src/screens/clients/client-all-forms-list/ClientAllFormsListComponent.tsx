import "./ClientAllFormsListComponent.scss";
import {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import CardComponent from "../../../shared/components/card/CardComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import momentTimezone from "moment-timezone";

interface ClientAllFormsListComponentProps {
    clientId: string | undefined;
    appointmentId: string | undefined;
}

const ClientAllFormsListComponent = (props: ClientAllFormsListComponentProps) => {

        const {clientId, appointmentId} = props;
        const [getAllFormList, setGetAllFormList] = useState<any | null>(null);
        const [isGetAllFormListLoaded, setIsGetAllFormListLoaded] = useState<boolean>(false);

        const getAllForm = useCallback(() => {
            if (clientId && appointmentId) {
                setIsGetAllFormListLoaded(false);
                CommonService._client.getClientAllFormList(clientId, appointmentId)
                    .then((response: any) => {
                        console.log('response', response);
                        setGetAllFormList(response.data);
                        setIsGetAllFormListLoaded(true);
                    }).catch(() => {
                    setIsGetAllFormListLoaded(true);
                    setGetAllFormList(null);
                })
            }
        }, [clientId, appointmentId]);

        useEffect(() => {
            getAllForm();
        }, [getAllForm]);

        const fetchForm = useCallback(async (form: any, cb: any) => {
            try {
                const payload = {
                    initial_appointment_id: appointmentId,
                    client_id: clientId,
                    timezone: momentTimezone.tz.guess(),
                };

                let response;
                if (form?.form_type === 'Personal and Medical Information') {
                    response = await CommonService._client.printPersonalAndMedicalInfo(payload)
                } else if (form?.form_type === 'Waiver and Release of Liability' && clientId && appointmentId) {
                    response = await CommonService._client.printWaiverForm(clientId, appointmentId, payload)
                } else if (form?.form_type === 'Authorization to Release Medical Information' && clientId && appointmentId) {
                    response = await CommonService._client.printAuthorizationForm(clientId, appointmentId, payload)
                } else if (form?.form_type === 'Attendance Policy' && clientId && appointmentId) {
                    response = await CommonService._client.printAttendancePolicyForm(clientId, appointmentId, payload)
                } else if (form?.form_type === 'Notice of Privacy Practices' && clientId && appointmentId) {
                    response = await CommonService._client.printNoticeOfPrivacyForm(clientId, appointmentId, payload)
                } else if (form?.form_type === 'New Injury/Condition Information' && clientId && appointmentId) {
                    response = await CommonService._client.printNewInjuryForm(clientId, appointmentId, payload)
                }else{
                    return;
                }
                cb(response?.data?.url);
            } catch (error: any) {
                CommonService._alert.showToast(error.error || error.errors || "Failed to fetch", "error");
            }

        }, [appointmentId, clientId]);

        const handlePrintForm = useCallback((form: any) => {
            fetchForm(form, (url: string) => {
                CommonService.printAttachment({
                    url: url,
                    type: "application/pdf",
                    key: CommonService.getUUID(),
                    name: `${form.form_type}.pdf`
                })
            });
        }, [fetchForm]);


        return (
            <div className={'client-all-forms-list-component'}>
                {
                    isGetAllFormListLoaded &&
                    <div>
                        {getAllFormList?.length > 0 && getAllFormList?.map((pendingForm: any, index: number) => {
                            console.log('pendingForm', pendingForm);
                            return <>
                                <div className={'ts-col-lg-12'}>
                                    <CardComponent className={'pending-form-wrapper pdf'}>
                                        <div className={'ts-row d-flex ts-justify-content-sm-between align-items-center'}>
                                            <div className={'d-flex align-items-center form-name-icon'}>
                                                <ImageConfig.DocumentIcon height={'40'} width={'40'}/>
                                                <span className={'pending-form-title'}>{pendingForm?.form_type}</span><span>
                                               {pendingForm?.status === 'pending' &&
                                                <ChipComponent className={pendingForm?.status === 'pending' ? 'Modified mrg-left-10':''}
                                                                label={pendingForm?.status === 'pending' ? "Pending" : 'Completed'}/>
                                                }
                                            </span>
                                            </div>
                                            {pendingForm?.status === 'completed' && <div>
                                                <ButtonComponent prefixIcon={<ImageConfig.EyeIcon/>}
                                                                 variant={'outlined'}
                                                                 className={'view-pdf-button'}
                                                                 onClick={() => handlePrintForm(pendingForm)}
                                                                 size={'large'}>View
                                                    PDF</ButtonComponent>
                                            </div>}
                                        </div>

                                    </CardComponent>
                                </div>
                            </>
                        })}
                    </div>
                }
            </div>
        );

    }
;

export default ClientAllFormsListComponent;