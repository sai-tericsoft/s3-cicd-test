import "./MentionsComponent.scss";
import {Mention, MentionsInput} from "react-mentions";
import merge from "lodash/merge";
import {useCallback} from "react";

interface MentionsComponentProps {
    data: any[];
    inputHeight: number;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

const MentionsComponent = (props: MentionsComponentProps) => {

    const {data, inputHeight, value, onChange, placeholder} = props;

    const styledComponents = {
        control: {
            backgroundColor: '#fff',
            fontSize: 16,
            // fontWeight: 'normal',
        },
        '&multiLine': {
            control: {
                fontFamily: 'monospace',
                minHeight: inputHeight,
            },
            highlighter: {
                padding: 9,
                border: '1px solid transparent',
            },
            input: {
                padding: 9,
                border: '1px solid silver',
            },
        },
        '&singleLine': {
            display: 'inline-block',
            width: 180,
            highlighter: {
                padding: 1,
                border: '2px inset transparent',
            },
            input: {
                padding: 1,
                border: '2px inset',
            },
        },
        suggestions: {
            list: {
                backgroundColor: 'white',
                border: '1px solid rgba(0,0,0,0.15)',
                fontSize: 16,
            },
            item: {
                padding: '5px 15px',
                '&focused': {
                    backgroundColor: '#cee4e5',
                },
            },
        },
    }

    let customStyle = merge({}, styledComponents, {
        input: {
            height: inputHeight,
            overflow: "auto",
        },
        highlighter: {
            height: 80,
            overflow: "hidden",
            boxSizing: "border-box",
        },
    });

    const mentionStyle = {
        // color: "#1479FF",
        backgroundColor: "#E6F2FF",
        fontSize: 14,
    }

    const handleChange = useCallback((e: any) => {
        const value = e.target.value;
        onChange(value);
    }, [onChange]);

    return (
        <div className={'mentions-component'}>
            <MentionsInput
                value={value}
                onChange={handleChange}
                style={customStyle}
                placeholder={placeholder}
            >
                <Mention
                    trigger="@"
                    data={data}
                    style={mentionStyle}
                    displayTransform={(id: any, display: any) => `@${display}`}
                    // markup=""
                />
            </MentionsInput>
        </div>
    );

};

export default MentionsComponent;
