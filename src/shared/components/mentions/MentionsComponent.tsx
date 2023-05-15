import "./MentionsComponent.scss";
import {Mention, MentionsInput} from "react-mentions";
import {useCallback} from "react";

interface MentionsComponentProps {
    data: any[];
    inputHeight?: number;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

const MentionsComponent = (props: MentionsComponentProps) => {

    const {data, value, onChange, placeholder} = props;

    const handleChange = useCallback((e: any) => {
        const value = e.target.value;
        onChange(value);
    }, [onChange]);

    return (
        <>
            <MentionsInput
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="mentions"
            >
                <Mention
                    type="user"
                    trigger="@"
                    data={data}
                    className="mentions__mention"
                />
            </MentionsInput>
        </>
    );

};

export default MentionsComponent;
