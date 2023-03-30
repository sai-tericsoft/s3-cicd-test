import "./AllAddedICD11CodesComponent.scss";
import React, {useEffect, useMemo} from "react";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import {APIConfig, ImageConfig} from "../../../constants";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import TableComponent from "../../../shared/components/table/TableComponent";
import {getAllAddedICD11Code} from "../../../store/actions/chart-notes.action";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";

interface AllAddedIcd11CodesComponentProps {
    medicalRecordId: string;
}


const AllAddedICD11CodesComponent = (props: AllAddedIcd11CodesComponentProps) => {
    const {medicalRecordId} = props;
    const dispatch = useDispatch();
    const {
        addedICD11CodeList,
        isAddedICD11CodeListLoading,
        isAddedICD11CodeListLoaded,
        isAddedICD11CodeListLoadingFailed
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    const AddedICDCodesColumns: any = useMemo(() => [
        {
            title: 'ICD Code',
            key: 'icd_code',
            dataIndex: 'icd_code',
            fixed: 'left',
            width: 150,
        },
        {
            title: 'Description',
            key: 'description',
            dataIndex: 'description',
        }
    ], [medicalRecordId]);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getAllAddedICD11Code(medicalRecordId))
        }
    }, [dispatch, medicalRecordId]);


    return (
        <div className={'all-added-icd-11-codes-component'}>
            <div className={'display-flex align-items-center '}>
                <FormControlLabelComponent className={'mrg-top-20 mrg-right-20'} label={'Added ICD-11 Code (s)'}
                                           size={'lg'}/>
                <IconButtonComponent className={"form-helper-icon"}>
                    <ToolTipComponent
                        showArrow={true}
                        position={'top'}
                        tooltip={"The displayed ICD-11 codes are from the most recent SOAP note that contained ICD-11 codes."}>
                        <ImageConfig.InfoIcon/>
                    </ToolTipComponent>
                </IconButtonComponent>
            </div>
            {
                isAddedICD11CodeListLoading && <LoaderComponent/>
            }
            {
                isAddedICD11CodeListLoadingFailed && <StatusCardComponent title={'Failed to fetch ICD-11 code list'}/>
            }
            {isAddedICD11CodeListLoaded &&
                <TableComponent columns={AddedICDCodesColumns}
                                className={'added-icd-11-code-list'}
                                bordered={true} data={addedICD11CodeList}/>
            }
        </div>
    );

};

export default AllAddedICD11CodesComponent;