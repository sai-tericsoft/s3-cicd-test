import Menu from '@mui/material/Menu';
import React, {ReactNode, useCallback, useEffect, useState} from "react";
import {MenuItem} from "@mui/material";

interface MenuDropdownComponentProps {
    isOpen?: boolean;
    menuBase: ReactNode | null;
    menuOptions: ReactNode[] | null | undefined;
    onOpen?: () => void;
    onClose?: () => void;
}

const MenuDropdownComponent = (props: MenuDropdownComponentProps) => {

    const {isOpen, menuBase, onClose, onOpen, menuOptions} = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState(!!isOpen);

    console.log(menuOptions);

    const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        setOpen(true);
        setAnchorEl(event.currentTarget);
        if (onOpen) {
            onOpen();
        }
    }, [onOpen]);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
        setOpen(false);
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        setOpen(!!isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (anchorEl) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [anchorEl]);

    return (
        <div className={'menu-dropdown-component'}>
            <div aria-controls={open ? 'basic-menu' : undefined}
                 aria-haspopup="true"
                 aria-expanded={open ? 'true' : undefined}
                 onClick={handleClick}>
                {menuBase}
            </div>
            {anchorEl && <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                className={"menu-dropdown-component-menu"}
            >
                {menuOptions && menuOptions.map((option, index) => (
                    <MenuItem key={index}
                              disableRipple={true}
                              className={"menu-dropdown-option"}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>}
        </div>
    );

};

export default MenuDropdownComponent;

// ****************************** USAGE ****************************** //

// const [isContextMenuOpened, setIsContextMenuOpened] = useState<boolean | undefined>(undefined);
//
// <MenuDropdownComponent
//     menuBase={
//         <ButtonComponent>Context Menu</ButtonComponent>
//     }
//     menuOptions={[
//         <CheckBoxComponent label={"Option 1"}/>,
//         <CheckBoxComponent label={"Option 2"}/>,
//         <CheckBoxComponent label={"Close"} onChange={()=>{setIsContextMenuOpened(false)}}/>,
//     ]}
//     isOpen={isContextMenuOpened}
//     onOpen={()=>{setIsContextMenuOpened(true)}}
//     onClose={()=>{setIsContextMenuOpened(false)}}
// />

// ****************************** USAGE ****************************** //
