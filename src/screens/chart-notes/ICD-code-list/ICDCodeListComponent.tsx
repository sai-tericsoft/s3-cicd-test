import "./ICDCodeListComponent.scss";
import TableComponent from "../../../shared/components/table/TableComponent";
import {ImageConfig} from "../../../constants";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import {useCallback, useState} from "react";
import {CommonService} from "../../../shared/services";

interface ICDCodeListComponentProps {

}

const ICDCodeListComponent = (props: ICDCodeListComponentProps) => {

    const [isStarFilled,setIsStarFilled]=useState<boolean>(false);

    const handleStarIcon=useCallback(()=>{
        setIsStarFilled(true);
        CommonService._client.HandleICDStar()
            
    },[])

    const codeList: any = [
        {
            code: 'M54,4',
            description: 'Lumbago with Sciatica',
            mark_as_favourite:<ImageConfig.StarIcon/>
        },
        {
            code: 'M54,40',
            description: 'Lumbago with Sciatica, unspecified side',
            mark_as_favourite:<ImageConfig.StarIcon/>

        },
        {
            code: 'M54,41',
            description: 'Lumbago with Sciatica, right side',
            mark_as_favourite:<ImageConfig.StarIcon/>
        },
        {
            code: 'M54,42',
            description: 'Lumbago with Sciatica, left side',
            mark_as_favourite:<ImageConfig.StarIcon/>
        },
        {
            code: 'M54,45',
            description: 'Low Back Pain',
            mark_as_favourite:<ImageConfig.StarIcon/>
        },
        {
            code: 'M54,4',
            description: 'Lumbago with Sciatica',
            mark_as_favourite:<ImageConfig.StarIcon/>
        },
        {
            code: 'M54,40',
            description: 'Lumbago with Sciatica, unspecified side',
            mark_as_favourite:<ImageConfig.StarIcon/>
        },
        {
            code: 'M54,41',
            description: 'Lumbago with Sciatica, right side',
            mark_as_favourite:<ImageConfig.StarIcon/>
        },
        {
            code: 'M54,42',
            description: 'Lumbago with Sciatica, left side',
            mark_as_favourite:<ImageConfig.StarIcon/>
        },
    ];

    const codeListDataColumn:any=[
        {
            title:"ICD-10 Codes",
            key:'code',
            dataIndex:'code',
            width:'20%'
        },
        {
            title: 'Description',
            key:'description',
            dataIndex: 'description',
            width:' 60%'
        },
        {
            title: 'Mark as Favourite',
            key:'mark_as_favourite',
            dataIndex: 'mark_as_favourite',
            render:(_:any,item:any)=>{
                return <IconButtonComponent onClick={handleStarIcon}>
                    {isStarFilled?<ImageConfig.FilledStarIcon/>:<ImageConfig.StarIcon/>}
                </IconButtonComponent>
            }

        },
    ]

    return (
        <div className={'ICD-code-list-component'}>
            <div>
                <TableComponent data={codeList} columns={codeListDataColumn}/>
            </div>
        </div>
    );

};

export default ICDCodeListComponent;