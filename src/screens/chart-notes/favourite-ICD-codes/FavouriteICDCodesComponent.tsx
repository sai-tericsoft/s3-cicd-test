import "./FavouriteICDCodesComponent.scss";
import {ITableColumn} from "../../../shared/models/table.model";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig, ImageConfig, Misc} from "../../../constants";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {useCallback, useState} from "react";

interface FavouriteICDCodesComponentProps {
    rowSelection?: any;
}

const FavouriteICDCodesComponent = (props: FavouriteICDCodesComponentProps) => {

    const {rowSelection} = props;
    const [refreshToken, setRefreshToken] = useState<string>('');
    const favouriteICDCodesColumns: ITableColumn[] = [
        {
            title: 'ICD-11 Codes',
            dataIndex: 'icd_code',
            key: 'icd_code',
            width: 120,
            render: (_: any, item: any) => {
                return <>{item?.icd_code_details?.icd_code}</>
            }
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            render: (_: any, item: any) => {
                return <>{item?.icd_code_details?.description}</>
            }
        },
        {
            title: ' Favourite Code(s)',
            dataIndex: 'favourite',
            key: 'favorite',
            fixed: 'right',
            width: 120,
            render: (_: any, item: any) => {
                return <span onClick={() => removeFavouriteCode(item?.icd_code_id)}>
                  <ImageConfig.FilledStarIcon className={'star-icon-favourite'}/>
               </span>
            }
        }
    ];

    const removeFavouriteCode = useCallback((id: any) => {
        CommonService._client.RemoveFavouriteCode(id, {})
            .then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setRefreshToken(Math.random().toString(36).substring(7));
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error, "error");
            });
    }, []);


    return (
        <div className={'favourite-ICD-codes-component'}>
            <TableWrapperComponent rowKey={(row, index) => row.icd_code_id} rowSelection={rowSelection} refreshToken={refreshToken} url={APIConfig.ICD_CODE_FAVOURITE_LIST.URL}
                                   method={APIConfig.ICD_CODE_FAVOURITE_LIST.METHOD}
                                   columns={favouriteICDCodesColumns} isPaginated={true}/>
        </div>
    );

};

export default FavouriteICDCodesComponent;
