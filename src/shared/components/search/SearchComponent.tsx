import "./SearchComponent.scss";
import InputComponent from "../form-controls/input/InputComponent";
import {ImageConfig} from "../../../constants";
import {useCallback, useEffect, useState} from "react";
import IconButtonComponent from "../icon-button/IconButtonComponent";

interface SearchComponentProps {
    label: string;
    placeholder?: string;
    value?: string;
    onSearchChange?: (value: any) => void;
}

const SearchComponent = (props: SearchComponentProps) => {

    const {label, onSearchChange} = props;
    const [searchText, setSearchText] = useState<string | undefined>(props.value);
    const placeholder = props.placeholder || label;

    useEffect(() => {
        setSearchText(props.value);
    }, [props.value]);

    const handleSearchTextChange = useCallback((value: any) => {
        if (onSearchChange) {
            onSearchChange(value);
        }
        setSearchText(value);
    }, []);

    const handleSearchClear = useCallback(() => {
        handleSearchTextChange("");
    }, [handleSearchTextChange]);

    return (
        <div className={'search-component'}>
            <InputComponent
                label={label}
                value={searchText}
                onChange={handleSearchTextChange}
                size={"small"}
                placeholder={placeholder}
                suffix={
                    <>
                        {searchText?.length === 0 && <IconButtonComponent
                            position={"end"}>
                            <ImageConfig.SearchIcon/>
                        </IconButtonComponent>}
                        {(searchText && searchText.length > 0) && <IconButtonComponent
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