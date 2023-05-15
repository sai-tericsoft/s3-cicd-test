import "./SearchComponent.scss";
import InputComponent from "../form-controls/input/InputComponent";
import {ImageConfig} from "../../../constants";
import {useCallback, useEffect, useState} from "react";
import IconButtonComponent from "../icon-button/IconButtonComponent";

interface SearchComponentProps {
    label: string;
    size?: 'small' | 'medium';
    className?:any;
    placeholder?: string;
    value?: string;
    onSearchChange?: (value: any) => void;
}

const SearchComponent = (props: SearchComponentProps) => {

    const {label,className, onSearchChange} = props;
    const [searchText, setSearchText] = useState<string | undefined>(props.value);
    const placeholder = props.placeholder || label;
    const size = props.size || 'small'

    useEffect(() => {
        setSearchText(props.value);
    }, [props.value]);

    const handleSearchTextChange = useCallback((value: any) => {
        if (onSearchChange) {
            onSearchChange(value);
        }
        setSearchText(value);
    }, [onSearchChange]);

    const handleSearchClear = useCallback(() => {
        handleSearchTextChange("");
    }, [handleSearchTextChange]);

    return (
        <div className={'search-component'}>
            <InputComponent
                id={"search_input"}
                label={label}
                className={className}
                value={searchText}
                onChange={handleSearchTextChange}
                size={size}
                fullWidth={true}
                placeholder={placeholder}
                suffix={
                    <>
                        {searchText?.length === 0 && <IconButtonComponent
                            size={"small"}
                            position={"end"}>
                            <ImageConfig.SearchIcon/>
                        </IconButtonComponent>}
                        {(searchText && searchText.length > 0) && <IconButtonComponent
                            size={"small"}
                            position={"end"}
                            onClick={handleSearchClear}>
                            <ImageConfig.CloseIcon/>
                        </IconButtonComponent>
                        }
                    </>
                }
            />
        </div>
    );

};

export default SearchComponent;