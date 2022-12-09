import "./TextConverterComponent.scss";
import React, {useState} from "react";
import {text} from "stream/consumers";

interface TextConverterComponentProps {
 value:string;

}

const TextConverterComponent = (props:React.PropsWithChildren<TextConverterComponentProps>) => {

     const {value}=props;
    const [isStarShowing,setIsStarShowing]=useState<boolean>(false);




    return (
        <div className={'TextConverterComponent'} >

        </div>
    );

};

export default TextConverterComponent;