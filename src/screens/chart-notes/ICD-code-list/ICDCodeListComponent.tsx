import "./ICDCodeListComponent.scss";
import {APIConfig, ImageConfig, Misc} from "../../../constants";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../../shared/components/tabs/TabsComponent";
import {useCallback, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import FavouriteICDCodesComponent from "../favourite-ICD-codes/FavouriteICDCodesComponent";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";

interface ICDCodeListComponentProps {

}

const ICDCodesSteps: any = ["icdCodes", "favourites"];


const ICDCodeListComponent = (props: ICDCodeListComponentProps) => {

    const [currentTab, setCurrentTab] = useState<any>("icdCodes");
    const [searchParams, setSearchParams] = useSearchParams();
    const [refreshToken, setRefreshToken] = useState<string>('');
    useEffect(() => {
        let currentTab: any = searchParams.get("currentStep");
        if (currentTab) {
            if (!ICDCodesSteps.includes(currentTab)) {
                currentTab = "icdCodes";
            }
        } else {
            currentTab = "icdCodes";
        }
        setCurrentTab(currentTab);
    }, [searchParams]);

    const handleTabChange = useCallback((e: any, value: any) => {
        searchParams.set("currentStep", value);
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams]);


    const codeListColumns: ITableColumn[] = [
        {
            title: 'ICD-11 Codes',
            dataIndex: 'icd_code',
            key: 'icd_code',
            width: 120,
            fixed: 'left',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 250,
        },
        {
            title: 'Mark as Favourite',
            dataIndex: 'is_fav',
            key: 'favorite',
            fixed: 'right',
            width: 120,
            render: (_: any, item: any) => {
                return <span>

                    {
                        !item?.is_fav &&
                        <div className={'star-icon'} onClick={() => addFavouriteList(item?._id)}>
                            <ImageConfig.StarIcon/>
                        </div>
                    }
                    {
                        item?.is_fav &&
                        <div className={'star-icon'} onClick={() => removeFavouriteCode(item?._id)}>
                            <ImageConfig.FilledStarIcon/></div>
                    }
               </span>
            }
        }
    ];
    const addFavouriteList = useCallback((codeId: string) => {
        CommonService._client.AddFavouriteCode(codeId, {})
            .then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setRefreshToken(Math.random().toString(36).substring(7));
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error, "error");
            })
    }, []);

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
        <div className={'ICD-code-list-component'}>
            <TabsWrapperComponent>
                <TabsComponent
                    value={currentTab}
                    allowScrollButtonsMobile={false}
                    variant={"fullWidth"}
                    onUpdate={handleTabChange}
                >
                    <TabComponent label={'ALL ICD-11 CODES'} value={'icdCodes'}/>
                    <TabComponent label={'FAVOURITES'} value={'favourites'}/>
                </TabsComponent>
                <TabContentComponent value={'icdCodes'} selectedTab={currentTab}>
                    <TableWrapperComponent refreshToken={refreshToken} url={APIConfig.ICD_CODE_LIST.URL}
                                           method={APIConfig.ICD_CODE_LIST.METHOD}
                                           columns={codeListColumns}
                                           isPaginated={true}
                    />
                </TabContentComponent>
                <TabContentComponent value={'favourites'} selectedTab={currentTab}>
                    <FavouriteICDCodesComponent/>
                </TabContentComponent>
            </TabsWrapperComponent>
        </div>
    );
};

export default ICDCodeListComponent;