import "./AvatarComponent.scss";
import {useEffect, useState} from "react";

interface AvatarComponentProps {
    className?: string;
    url?: string;
    title?: string;
    type?: "circle" | "square";
    size?: "md" | "xl";
}

const AVATAR_MAX_CHAR_LIMIT = 2;

const AvatarComponent = (props: AvatarComponentProps) => {

    const {url, title, className} = props;
    const type = props.type || "circle";
    const size = props.size || "md";
    const [label, setLabel] = useState<string>("");

    useEffect(() => {
        if (title) {
            const titleBits = title.split(' ');
            let label = '';
            if (titleBits.length > 1) {
                titleBits.forEach((bit, index) => {
                    if (index < AVATAR_MAX_CHAR_LIMIT && bit.trim().length > 0){
                        label += bit[0];
                    }
                });
            } else {
                label = title.slice(0, AVATAR_MAX_CHAR_LIMIT);
            }
            setLabel(label);
        }
    }, [title]);

    return (
        <div className={`avatar-component ${type} ${size} ${className}`}>
                {
                    url && <img src={url} alt={title}/>
                }
                {
                    !url && label
                }
        </div>
    );

};

export default AvatarComponent;
